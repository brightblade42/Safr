namespace EyemetricFR
open System
open System.Net.Http
open System.Net.WebSockets
open System.Threading

open H.Socket.IO
open H.Socket.IO.EventsArgs
open Paravision.Types.Streaming
open HTTPApi
module REST = Paravision //as little  more explicit that we're using a REST api.

[<AutoOpen>]
module PVStreams =
    //Todo: A bit hackey but standard attempts have yet to work
    let unescape_json (json_str: string) = json_str.Replace("\\","""""").Replace("\"{", "{").Replace("}\"", "}")

    type StreamingResult<'T> =
       | Success  of 'T
       | StreamUnhealthyError of string
       | ConnectionError of string
       | StreamingError of string

    //shorten the monster type list. OOFAH!
    type StartStreamingResultList = StreamingResult<Result<StartDecodeReply,string> list>  //Hoochie Mama!
    type StopStreamingResultList = StreamingResult<Result<StopDecodeReply,string> list>  //Hoochie Mama!

    //function type aliases.
    type stream_api_call = HttpClient -> (string -> Uri) -> CameraStream -> Async<HttpResult<string>>
    type reply_builder<'T> = string -> Result<'T, string>

    type FaceDetection(stream_addr: string, socket_addr: string) =

        let mutable active_streams: Result<StreamState, string> option = None
        let mutable cam_streams: CameraStream list option              = None
        let mutable socket_subs:IDisposable list                       = List.Empty

        let mutable web_socket    = new SocketIoClient()
        let mutable socket_killed = false  //if the remote socket was abruptly and very rudely closed.

        let client               = create_client None
        let stream_url           = $"http://%s{stream_addr}"
        let socket_url           = $"ws://%s{socket_addr}"
        let make_stream_url      = create_url stream_url
        let face_detected_event  = Event<Result<string * DetectedFacesReply, string>>()  //return the PV type
        let socket_error         = Event<Result<string, exn>>() //coming soon
        let cam_stream_connected = Event<string>() //string might not be enough.
        let socket_timeout_ms    = 10000

        //internal web socket event handler. called when face detection images are received from PV
        let faces_detected (se: SocketIoEventEventArgs) =

            let ns = se.Namespace.TrimStart [|'/'|] //name of the stream (cam_name)

            printfn "=========== In Faces Detected Event ============="

            let detect_info =
                se.Value
                |> unescape_json
                |> to_detected_faces_reply
                |> Result.map (fun x -> (ns, x))

            face_detected_event.Trigger detect_info

        //Todo: some things to do
        //create an event to nofity whenever the health of the streams goes off.
        //create a timer to check the health of the streams every N milliseconds.
        //if health = unhealthy, try to restart the streams until healthy or after N tries.
        //after streams have started decoding we can handle detection events over a socket.

        //a function that returns a new function that will make a stream call for every camera in provided list.
        let build_stream_fun  (stream_call: stream_api_call) (to_reply: reply_builder<'T>) =
            fun (cams: CameraStream list) -> async {
                let mutable stream_msg = []
                let mutable kill_loop  = false
                let mutable conn_error = ConnectionError "poop"

                for cam in cams do
                    if not kill_loop then
                        let! res = stream_call client make_stream_url cam
                        match res with
                        | HttpResult.Success r ->
                            let res =
                                match (to_reply r) with
                                | Ok dec ->  Ok dec
                                | Error e -> Error e

                            stream_msg <- stream_msg @ [res]
                        | TimedOutError t ->
                            kill_loop <- true
                            conn_error <- ConnectionError "Stream Request timed out. Aborting remaining requests. Try again"

                        | UnhandledError e ->
                                kill_loop <- true
                                conn_error <- ConnectionError e.Message
                        | HTTPResponseError e ->
                                stream_msg <- stream_msg @ [Error e]
                               // kill_loop <- true
                                conn_error <- ConnectionError e


                if kill_loop then
                    return conn_error
                else
                    return StreamingResult.Success stream_msg
            }

        /// starts / stops face decoding of camera streams on remote pv streaming service
        let stop_streams  = build_stream_fun REST.stop_decode to_stop_decode_reply
        let start_streams = build_stream_fun REST.start_decode to_start_decode_reply


        let sub_socket_events () =

            if socket_subs.Length > 0 then
                socket_subs |> List.iter (fun x -> x.Dispose())
                socket_subs <- List.Empty
                web_socket.Dispose()
                web_socket <- new SocketIoClient()

            let socket_conn_sub = web_socket.Connected.Subscribe(fun x ->
                 socket_killed <- false
                 cam_stream_connected.Trigger(x.Namespace) //TODO: is this being utilized
                )

            //TODO: what is diff between Error vs Exception in context of a web socket?
            let socket_err_sub = web_socket.ErrorReceived.Subscribe(fun x ->
                 printfn "==============================================================="
                 printfn $"Error from PV WebSocket : %s{x.Namespace} :: %s{x.Value}"
                 printfn "==============================================================="
                )

            let socket_exn_sub = web_socket.ExceptionOccurred.Subscribe(fun x ->
                 socket_killed <- true
                 web_socket.Dispose()
                 socket_error.Trigger(Error x.Value))

            //The ALL important face detection event.
            let msg_received_sub = web_socket.EventReceived.Subscribe(faces_detected)

            let socket_disconnected_sub = web_socket.Disconnected.Subscribe(fun x ->
                 if not socket_killed then //disconnected but not fatal.
                     socket_error.Trigger(Error (Exception $"NOT KILLED: Socket disconnected: %s{x.Reason}"))
                 )

            socket_subs <- [socket_conn_sub; socket_err_sub; socket_exn_sub;msg_received_sub;socket_disconnected_sub]

        let connect_socket () = async {
            try
                let ctok = new CancellationTokenSource(socket_timeout_ms) //if op not done in 10secs, cancel
                if not web_socket.EngineIoClient.IsOpened then
                    printfn "Socket was not opened. Connecting web socket"
                    let! conn = web_socket.ConnectAsync(Uri(socket_url), ctok.Token) |> Async.AwaitTask
                    printfn $"CONN: %b{conn}"
                    return Ok conn
                else
                    return Ok true
            with
            | :? AggregateException as agx -> //this runs when the remote server process is not running.
                printfn $"=====  SOCKET FAILED TO CONNECT ON INIT: %s{agx.Message}"
                socket_error.Trigger(Error (Exception(agx.Message)))
                return Error agx.Message
            | :? WebSocketException as wex ->
                printfn $"=====  SOCKET FAILED TO CONNECT ON INIT: %s{wex.Message}"
                socket_error.Trigger(Error (Exception(wex.Message)))
                return Error wex.Message

            | :? OperationCanceledException as ex ->
                printfn $"=====  SOCKET FAILED TO CONNECT ON INIT: %s{ex.Message}"
                socket_error.Trigger(Error (Exception(ex.Message)))
                return Error ex.Message
        }

        let connect_socket_namespaces(namespaces: string list) = async {
            let ctok = new CancellationTokenSource(15000)
            try
                let! ns_conn = web_socket.ConnectToNamespacesAsync(ctok.Token, namespaces |> Array.ofList) |> Async.AwaitTask
                return Ok ns_conn
            with
            | :? Exception as ex ->
                printfn $"=====  SOCKET FAILED TO CONNECT TO Namespace: %s{ex.Message}"
                return Error ex
        }

        let unpack_stream_info(sinfo: Result<StreamState, string> option) =
            match sinfo with
            | Some (Ok streams) -> Some streams
            | Some (Error _) ->  None
            | None -> None

        //I feel like Bind is what this sort of thing is for.
        let handle_api_result (res: HttpResult<string>) =
                match res with
                | HttpResult.Success str         -> Ok str
                | HttpResult.TimedOutError t     -> Error t
                | HttpResult.UnhandledError e    -> Error e.Message
                | HttpResult.HTTPResponseError e -> Error e

        let build_socket_connection (a_streams: Result<StreamState, string> option  ) = async {
            sub_socket_events() //this destroys and creates new socket. evil but easy.
            match! (connect_socket()) with
            | Ok is_conn when is_conn ->
                match (unpack_stream_info a_streams) with
                | Some s ->
                    //we only connect to namespaces that the pv server is already running, which are active_streams
                    let s_names  = s.streams |> List.map (fun x -> x.name.TrimStart [|'/'|] )
                    let! ns_conn = connect_socket_namespaces s_names
                    printfn $"Connected to namespaces %A{ns_conn}"
                    ()
                | None -> printfn "no active streams to connect"

            | Ok _    -> printfn "Did not connect to Socket"
            | Error e -> printfn $"Socket conn Error from ConnectToStream: %s{e}"

        }

        let update_active_streams() = async {
            let! streams = REST.get_streams client make_stream_url

            let a_streams =
                match (handle_api_result streams) with
                | Ok stream -> (Some (StreamState.from stream))
                | Error _   -> active_streams //TODO: Handle the error

            active_streams <- a_streams
            return ()
        }

        member self.start_decode cams = async {
            let! res = start_streams cams

            match res with
            | Success _ ->
                do! update_active_streams ()
                do! build_socket_connection(active_streams)
            | ConnectionError ce ->
                printfn $"Get Streams Error: %s{ce}"

            cam_streams <- Some(cams)
            return res
        }

        member self.stop_decode  cams = async {
            let! res = stop_streams cams
            match res with
            | Success _ ->
                do! update_active_streams ()
                do! build_socket_connection(active_streams)
            | ConnectionError ce ->
                printfn $"Get Streams Error: %s{ce}"

            cam_streams <- Some(cams)
            return res
        }

        member self.async_get_streams(?timeout) = async {
            do! update_active_streams ()
            return active_streams.Value //TODO: direct Value access is never a good sign. maybe return the option
        }
        member self.face_detected           = face_detected_event.Publish
        member self.stream_disconnected     = socket_error.Publish
        member self.camera_stream_connected = cam_stream_connected.Publish



