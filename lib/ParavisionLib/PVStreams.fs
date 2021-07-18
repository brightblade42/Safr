namespace Paravision

open System
open System.Net.Http
open System.Net.WebSockets
open System.Threading

open H.Socket.IO
open H.Socket.IO.EventsArgs
open Safr.Types.Paravision.Streaming

[<AutoOpen>]
module PVStreams =
    //Todo: A bit hackey but standard attempts have yet to work
    let unescape_json (json_str: string) =
        json_str.Replace("\\","""""").Replace("\"{", "{").Replace("}\"", "}")

   type StreamingResult<'a> =
       | Success  of 'a
       | StreamUnhealthyError of string
       | ConnectionError of string
       | StreamingError of string

    //shorten the monster type list. OOFAH!
    type StartStreamingResultList = StreamingResult<Result<StartDecodeReply,string> list>  //Hoochie Mama!
    type StopStreamingResultList = StreamingResult<Result<StopDecodeReply,string> list>  //Hoochie Mama!

    //function type aliases.
    type stream_api_call = HttpClient -> (string -> Uri) -> CameraStream -> Async<APIResult<string>>
    type reply_builder<'T> = string -> Result<'T, string>

    type FaceDetection(stream_addr: string, socket_addr: string, ?eventContext: SynchronizationContext) =

        let client = create_client None
        let stream_url = sprintf "http://%s" stream_addr
        let socket_url = sprintf "ws://%s"  socket_addr

        let make_stream_url = stream_url |> create_url

        let mutable _active_streams: Result<StreamState, string> option = None
        let mutable cam_streams: CameraStream list option = None
        //let mutable stream_health:  Result<StreamHealth, string> option = None
        ///wraps an event to run in a synchronization context, if provided in constructor
        /// This is particularly useful when running from a GUI Thread
        let event_with_context (evt:Event<'T>) =
           fun state ->
                match eventContext with
                | None ->
                    evt.Trigger(state)
                | Some ctx ->
                    ctx.Post((fun _ -> evt.Trigger(state)), null)

        let face_detected_event = new Event<Result<string * DetectedFacesReply, string>>()  //return the PV type
        let socket_error = new Event<Result<string, exn>>() //coming soon
        let cam_stream_connected = new Event<string>() //string might not bet enough.
        let fire_face_detected = face_detected_event |> event_with_context
        //internal web socket event handler. called when face detection images are received from PV
        let faces_detected (se: SocketIoEventEventArgs) =

            let ns = se.Namespace.TrimStart [|'/'|] //name of the stream (cam_name)

            printfn "=========== In Faces Detected Event ============="

            let detect_info =
                se.Value
                |> unescape_json
                |> to_detected_faces_reply
                |> Result.map (fun x -> (ns, x))

            fire_face_detected  detect_info

        //Todo: some things to do
        //create an event to nofity whenever the health of the streams goes off.
        //create a timer to check the health of the streams every N milliseconds.
        //if health = unhealthy, try to restart the streams until healthy or after N tries.
        //after streams have started decoding we can handle detection events over a socket.

        /// stops face decoding of camera streams on remote pv streaming service
        //a function that returns a new function that will make a stream call for every camera in provided list.
        let build_stream_call  (stream_call: stream_api_call) (to_reply: reply_builder<'T>) =
            fun (cams: CameraStream list) -> async {
                let mutable stream_msg = []
                let mutable kill_loop = false
                let mutable conn_error = ConnectionError "poop"

                for cam in cams do
                    if not kill_loop then
                        let! result = (client, make_stream_url, cam) |||> stream_call
                        match result with
                        | APIResult.Success r ->
                            let reply = r |> to_reply //to_stop_decode_reply
                            let res =
                                match reply with
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

        let stop_streams = build_stream_call Streaming.stop_decode to_stop_decode_reply
        let start_streams = build_stream_call Streaming.start_decode to_start_decode_reply

        let socket_timeout_ms = 10000
        let mutable web_socket = new SocketIoClient()

        let mutable socket_killed = false  //if the remote socket was abruptly and very rudely closed.
        let mutable socket_subs:IDisposable list = List.Empty

        let dispose_web_socket() = web_socket.Dispose()
        let sub_socket_events () =

            if socket_subs.Length > 0 then
                socket_subs |> List.iter (fun x -> x.Dispose())
                socket_subs <- List.Empty
                web_socket.Dispose()
                web_socket <- new SocketIoClient()


            let conn_sub = web_socket.Connected.Subscribe(fun x ->
                 socket_killed <- false
                 cam_stream_connected.Trigger(x.Namespace)
                )

            let err_sub = web_socket.ErrorReceived.Subscribe(fun x ->
                 printfn "==============================================================="
                 printfn $"Error from PV WebSocket : %s{x.Namespace} :: %s{x.Value}"
                 printfn "==============================================================="
                )


            let exn_sub = web_socket.ExceptionOccurred.Subscribe(fun x ->
                 socket_killed <- true
                 dispose_web_socket()
                 socket_error.Trigger(Error x.Value)

                )

            let msg_recv_sub = web_socket.EventReceived.Subscribe(faces_detected)

            let discon_sub = web_socket.Disconnected.Subscribe(fun x ->
                 if not socket_killed then //disconnected but not fatal.
                     socket_error.Trigger(Error (Exception $"NOT KILLED: Socket disconnected: %s{x.Reason}"))
                 )

            socket_subs <- [conn_sub; err_sub; exn_sub;msg_recv_sub;discon_sub]


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
            | Some (Error e) ->  None
            | None -> None


        //I feel like Bind is what this sort of thing is for.
        let handle_api_result (res: APIResult<string>) =
                match res with
                | APIResult.Success str -> Ok str
                | APIResult.TimedOutError t -> Error t
                | APIResult.UnhandledError e -> Error e.Message
                | APIResult.HTTPResponseError e -> Error e

        let build_socket_connection (a_streams: Result<StreamState, string> option  ) = async {
            sub_socket_events() //this destroys and creates new socket. evil but easy.
            let! conn = connect_socket()
            match conn with
            | Ok is_conn when is_conn ->
                let strms = a_streams |> unpack_stream_info
                match strms with
                | Some s ->
                    //we only connect to namespaces that the pv server is already running, which are active_streams
                    let s_names = s.streams |> List.map (fun x -> x.name.TrimStart [|'/'|] )
                    let! ns_conn = s_names |> connect_socket_namespaces
                    printfn $"Connected to namespaces %A{ns_conn}"
                    ()
                | None ->
                    printfn "no active streams to connect"
            | Ok _ -> printfn "Did not connect to Socket"
            | Error e ->
                printfn $"Socket conn Error from ConnectToStream: %s{e}"

        }

        let update_active_streams() = async {

            let! streams = (client, make_stream_url) ||> Streaming.get_streams
            let strms = streams |> handle_api_result

            let a_streams =
                match strms with
                | Ok stream ->
                    let new_active_streams = (to_stream_state stream)
                    (Some new_active_streams)
                | Error e ->
                    printfn $"Get Streams Error: %s{e}"
                    _active_streams

            _active_streams <- a_streams //ooooh it's mutable....
            return ()
        }
        let update_camera_streams(cams: CameraStream list) =
            cam_streams <- Some(cams)

        let start_decoding(cams: CameraStream list ): Async<StartStreamingResultList> = async {
            let! res = cams |> start_streams

            match res with
            | Success srs ->
                do! update_active_streams ()
                do! build_socket_connection(_active_streams)
            | ConnectionError ce ->
                printfn $"Get Streams Error: %s{ce}"

            update_camera_streams cams
            return res
        }

        let stop_decoding(cams: CameraStream list): Async<StopStreamingResultList> = async {
            let! res = cams |> stop_streams

            match res with
            | Success srs ->
                do! update_active_streams ()
                do! build_socket_connection(_active_streams)
            | ConnectionError ce ->
                printfn $"Get Streams Error: %s{ce}"

            update_camera_streams cams
            return res
        }

        member self.start_decode (streams: CameraStream list) =
            start_decoding streams

        member self.stop_decode (streams: CameraStream list) =
            stop_decoding streams

        member self.async_get_streams(?timeout) = async {
            do! update_active_streams ()
            return _active_streams.Value //TODO: direct Value access is never a good sign. maybe return the option
        }
        member self.face_detected = face_detected_event.Publish
        member self.stream_disconnected = socket_error.Publish
        member self.camera_stream_connected = cam_stream_connected.Publish



