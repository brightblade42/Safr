namespace EyemetricFR

open System
open Eyemetric.FR
open Eyemetric.FR.Utils
open Fable.SignalR
open EyemetricFR.Server.Types //clean up these hideous types
open Eyemetric.FR.Logging
open Eyemetric.FR.Logging.Enrollment
open Eyemetric.FR.Config
open Eyemetric.FR.Camera
open Eyemetric.FR.Enrollment
open Microsoft.AspNetCore.SignalR
open Paravision
open Paravision.Identification
open Safr.Types.Paravision.Streaming
open Safr.Types.Paravision.Identification
open Paravision.Utils
open Safr.Types.TPass
open Safr.Types.Eyemetric
open TPass.Client.Service

open Eyemetric.FR.Funcs



type IFR =
    abstract get_conf : unit -> Configuration option
    abstract stop_streams: unit -> Async<StopStreamingResultList>
    abstract start_streams: unit -> Async<StartStreamingResultList>
    abstract stop_stream: CameraStream -> Async<Result<StopDecodeReply, string>>
    abstract start_stream: CameraStream -> Async<Result<StartDecodeReply, string>>
    //abstract get_streams: unit -> Asymc<
    abstract add_camera: CameraStream -> Async<string>  //should have a better return value
    abstract remove_camera: int -> Async<Result<int, exn>> //should have a better return value
    abstract update_camera: CameraStream -> Async<Result<int, exn>>
    //abstract get_cams: unit -> CameraStream list
    abstract get_cams: unit -> Async<CameraStream list>
    abstract get_cam_info: unit -> Async<CameraInfo>
    abstract log_enroll_attempt: EnrollLog -> Async<Result<int, string>>
    abstract get_frlog_top: Option<int> -> Async<Result<seq<FRLog>, exn>>
    abstract get_frlog_daterange: Option<string> -> Option<string> -> Async<Result<seq<FRLog>, exn>>
    abstract delete_enrollment: string -> Async<Result<int, exn>>
    abstract delete_all_enrollments: unit -> Async<Result<int, exn>>
    abstract get_enrollment: string -> Async<Result<EnrolledIdentity option, exn>>
    abstract get_client_by_ccode: CCode -> Async<TPassResult<TPassClient>>
    abstract search_tpass: SearchReq list -> Async<TPassResult<TPassClient []>>
    abstract to_client_with_image: TPassClient [] -> Async<TPassClientWithImage[]>
    abstract enroll_clients: TPassClientWithImage seq  -> Async<int>

    abstract get_identity: GetIdentityReq -> Async<Result<Identity, string>>

    abstract recognize: FaceImage -> Async<Result<PossibleMatch, string>>
    abstract add_face: AddFaceReq -> Async<Result<FaceID, string>>
    abstract delete_face: DeleteFaceReq -> Async<Result<FaceID, string>>

    abstract validate_user: string -> string -> bool

type FRService(config_agent:     ConfigAgent,
               tpass_agent:      TPassAgent option,
               det_agent:        DetectionAgent,
               ident_agent:      IdentificationAgent,
               enroll_agent:     EnrollmentAgent,
               cam_agent:        CameraAgent,
               fr_log_agent:     FRLogAgent,
               enroll_log_agent: EnrollLogAgent,
               hub:              Hub
               ) =

    let mutable config_agent = config_agent
    let mutable fr_log_agent = fr_log_agent
    let mutable enroll_log_agent = enroll_log_agent
    //let mutable fr_agent = fr_agent
    let mutable tpass_agent  = tpass_agent
    let mutable enroll_agent = enroll_agent
    let mutable ident_agent  = ident_agent
    let mutable det_agent    = det_agent
    let mutable cam_agent    = cam_agent
    let mutable hub_context  = hub
    let mutable handling_face_detection = false
    let mutable id_cache = CacheMap(1000)

    let token_timer = SimpleTimer (84_600_000, fun () ->   //23.5hrs
        async {
            match tpass_agent with
            | Some tpa ->
                printfn "TRYING TOKEN TIMER REFRESH"
                let res = tpa.initialize() |> Async.RunSynchronously
                match res with
                | Success x ->
                    printfn "GOT US A SHINY NEW TOKEN! GOOD FER ANOTHER 23.5 hrs!"
                    ()
                | InvalidTokenError  -> ()   //TODO: for the error log! log token error.
                | _ -> ()

            | None -> () //TODO: a retry attept for when TPassAgent doesn't exist?
        })



    //let mutable (disposables: IDisposable list) = List.Empty
    let mutable cams: CameraStream list =  []

    let is_cached id =
      //false
      match (id_cache.get id) with
      | Some _ -> true
      | None ->
        id_cache.set id id
        false


    let log_matched_identity (face: IdentifiedFace) (pm: PossibleMatch ) (detected_img: string ) =
      {
        identity = pm.identities.Head.id
        detected_img = detected_img //"" //None //face.Frame //None // Some detected_img
        matched_face = ""
        name = face.Name
        confidence = pm.identities.Head.confidence
        matched_on = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss") //TODO: face.TimeStamp
        status = face.Status
        location = face.Cam
      } |> fr_log_agent.log

    //return top N fr log item
    let get_frlog_top (count: Option<int>) = async {
        return! count |> fr_log_agent.get_top
    }

    let get_frlog_daterange (startdate: Option<string>) (enddate: Option<string>) = async {
        printfn $"FR SERVICE: get_frlog daterange %A{startdate} : %A{enddate}"
        return! (startdate, enddate) ||> fr_log_agent.get_by_daterange
    }
    let get_enrollment (id: string) = async {
        return enroll_agent.get_enrolled_details_by_id id  //should this be async as well?
    }
    let log_enroll_attempt (item: EnrollLog) = async { return! item |> enroll_log_agent.log }

    let delete_enrollment (fr_id: string) = async {
        return! (ident_agent, enroll_agent, fr_id) |||> Funcs.delete_enrollment
    }


    let delete_all_enrollments () = async {
        return! (ident_agent, enroll_agent) ||> Funcs.delete_all_enrollments
    }

    let get_client_by_ccode (ccode: CCode) = async {
        let tpa = tpass_agent.Value
        return! ccode |> tpa.get_client_by_ccode
    }

    let search_tpass (search_req: SearchReq list) = async {
        let tpa = tpass_agent.Value
        return! search_req |> tpa.search_client
    }

    let to_client_with_image (clients: TPassClient []) = async {
        let tpa = tpass_agent.Value
        return! (tpa, clients) ||> Eyemetric.FR.Utils.TPassEnrollment.combine_with_image
    }

    let enroll_clients (clients: TPassClientWithImage seq) = async {

        //TODO: What if tpass_reg fails? Should log that for later retry

        let tpa = tpass_agent.Value
        let! new_idents =  (ident_agent, clients) ||> TPassEnrollment.create_enrollments
        printfn $"ENROLL: PV identities created: %i{new_idents.Length}"

        let! enrolled = (enroll_agent, new_idents) ||> Utils.do_enroll //TODO: we can do better than this name
        let enroll_count = enrolled |> Array.sumBy(fun x -> match x with | Ok c -> c | _ -> 0)

        //TODO: we may want to keep track of local enroll count, vs what tpass accepted.
        new_idents
            |> Seq.map(fun info ->

                match info with
                | Ok en   -> Some(TPassClient.ccode en.tpass_client.Value, en.identity.id)
                | Error e -> None
                )
            |> Seq.filter(fun x -> x.IsSome)
            |> Seq.map(fun x -> x.Value)
            |> Seq.map(fun info ->
                 let (ccode, pv) = info
                 (string ccode, pv) ||> tpa.update_pv
                 )
            |> Async.Parallel
            |> Async.RunSynchronously
            |> ignore

        return enroll_count
    }

    let recognize (face: FaceImage) = async { return! face |> ident_agent.detect_identity }

    let add_face (req: AddFaceReq) = async { return! req |> ident_agent.add_face }
    let delete_face (req: DeleteFaceReq) = async { return! req |> ident_agent.delete_face }

    let get_identity (req: GetIdentityReq) = async { return! req |> ident_agent.get_identity }

    //TODO: Checkin calls may change when updated specifically for other TPASS Client types (Visitor . Employee
    let create_checkin_rec (compId: int) (ccode: int) =
          CheckInRecord.create(pkid=0, compId= compId, ccode=bigint ccode, flag= "I", date=DateTime.Now, timeIn=DateTime.Now)

    let create_checkout_rec (compId: int) (ccode: int) =
          CheckOutRecord.create(pkid=0, compId= compId, ccode=bigint ccode, flag= "O", date=DateTime.Now, timeOut=DateTime.Now)

    //TODO: Checkin / OUT for types other than studentsd
    let check_in (tpc: TPassClient) =

        let tpa = tpass_agent.Value

        let check_fn () =
            match tpc with
            | Student s -> (s.compId, s.ccode) ||> create_checkin_rec |> tpa.checkin_student
            //TODO: add non student check ins
            //| EmployeeOrUser emp -> (emp.compId, emp.ccode) ||> create_checkin_rec |> fr_agent.checkin
            | _ ->  async { return Success "" } //Placeholder for other possible types

        let is_on_watchlist =  (tpc |> TPassClient.status).Contains("FR") //TODO: substring check is garbage.

        match is_on_watchlist with
        | true -> Some "FR Watchlist"
        | false ->
            let res = check_fn () |> Async.RunSynchronously
            match res with
            | Success s -> "Checked In" |> Some
            | _ -> None //TODO: provide some other status? Unknown or something

    let check_out (tpc: TPassClient) =

        let tpa = tpass_agent.Value

        let check_fn () =
            match tpc with
            | Student s -> (s.compId ,s.ccode) ||> create_checkout_rec |> tpa.checkout_student
            //| EmployeeOrUser emp -> (emp.compId, emp.ccode) ||> create_checkout_rec |> fr_agent.checkout
            | _ ->  async { return Success "" } //Placeholder for other possible types

        let is_on_watchlist =  (tpc |> TPassClient.status).Contains("FR")

        match is_on_watchlist with
        | true -> Some "FR Watchlist"
        | false ->
            let res = check_fn () |> Async.RunSynchronously
            match res with
            | Success _-> "Checked Out" |> Some
            | NotCheckedInError -> None
            | _ -> None

    let check_in_or_out (tcl: TPassClient) (cam_name: string) =

        let dir = cams |> List.filter(fun c -> c.name = cam_name) |>  List.map (fun x -> x.direction) |> List.head

        match (tcl, dir) with
        | (Student s , 1) -> (s.name,  check_in tcl)
        | (Student s, 0) -> (s.name, check_out tcl)
        | (EmployeeOrUser e, 1) -> (e.name, check_in tcl)
        | (EmployeeOrUser e, 0)  -> (e.name, check_out tcl)
        | _ -> ("Unknown", None)

    let validate_user(user: string)(pass:string) =

            let tpa = tpass_agent.Value
            let cred = UserPass (user, pass)
            let is_valid = tpa.validate_user cred |> Async.RunSynchronously

            match is_valid with
            | Success _ -> true
            | _ -> false //we're currently ignoring any errors (Auth Fail is an error)

    let get_identity_cache_expiry () =

        let conf_opt = config_agent.get_latest_config()
        match conf_opt with
        | Some conf -> conf.identity_cache_expiry
        | None -> 15000 //TODO: Is this a good default?

    let get_min_conf () =

        //TODO: Dont retrieve from db every time. This is a test hack.
        let min_conf = config_agent.get_latest_config()
        match min_conf with
        | Some conf -> conf.min_identity_confidence
        | None -> 0.96

    let is_confident ident =

        let min_conf = get_min_conf()
        match ident with
        | Some pf -> pf.identities.Head.confidence  >= min_conf
        | _ -> false

    let get_enrolled_details (pmatch: PossibleMatch option) = async {

        let tpa = tpass_agent.Value
        match pmatch with
        | Some pm when ((pm.identities.Head.id |> is_cached |> not) && pmatch |> is_confident) ->
              let! client = pm.identities.Head.id |> tpa.get_pv_client
              return client |> Some

        | _ -> return None //skip, found in cache.
     }
    let get_enrolled_details_async (pmatch: Async<PossibleMatch option>) = async {

        let! pm = pmatch
        let! res = pm |> get_enrolled_details
        return (res, pm)  //this is a damn weird way to get the pm out.
    }
    let get_possible_match (cropped_face: string option) = async {

        match cropped_face with
        | None -> return None
        | Some cropped ->
            let! pm =  (B64Encoding cropped) |> ident_agent.detect_identity
            return
                match pm with
                | Ok p ->  Some p
                | Error e ->
                    printfn $"couldn't get identification information: %s{e} "
                    //we'd log a thing here.
                    None
     }

    let verify_tpass (cam_name: string) (time_stamp: DateTime) (expanded_image: string) (mask_prob: float) enrolled_details (pm: PossibleMatch option)  = async {

          //TODO: keep an eye on using head for identities. we're only passing a single image to
          //pv and it will give us back an identies list of one but only if we send single face per image.
          return
              match enrolled_details with
              | Some (Success ed) ->
                    printfn "ENROLL DEETS SUCCESS"
                    let pi = pm.Value
                    let conf = pi.identities.Head.confidence //TODO: consider more than the Head.
                    //TODO: using time from this machine, pv time is off #22.
                    let time =  String.Format("{0:hh:mm:ss tt}", time_stamp.ToLocalTime())
                    let tpc = ed
                    //TODO: if status is FR then don't do check in, call FRAlert
                    let check_res =  ((tpc, cam_name) ||> check_in_or_out)

                    match check_res with
                    | (_, None) -> ()
                    | (name, Some status) ->
                        let frame =  Convert.FromBase64String expanded_image

                        let id_face = {
                                         ID=Guid.NewGuid().ToString()
                                         Name = name
                                         Cam=cam_name
                                         Confidence=conf
                                         TimeStamp=time
                                         Image=  [||] //just for kicks and shits
                                         Frame = frame
                                         Status=status
                                         Mask = mask_prob
                                     }

                        printfn "HELLO MCFLY!!!"
                        hub_context.Clients.All.SendAsync("FaceIdentified", id_face) |> Async.AwaitTask |> Async.Start
                        //hub_context.Clients.All.Send (FRHub.Response.Face id_face) |> ignore
                        (id_face, pi, expanded_image) |||> log_matched_identity
                        ()

              | Some (TPassError er) ->
                  printfn $"TPass Error %s{er.Message}"
                  ()
              | Some (PVNotRegisteredError id) ->
                  printfn $"ID not registered with TPass: %s{id}" //should we auto update this??
              | _ -> ()
    }


    let verify_tpass_async (cam_name: string) (time_stamp: DateTime) (exp_img: string) (mask_prob: float) (en_dets: Async<TPassResult<TPassClient> option * PossibleMatch option>) = async {

       let! (enrolled_details, possible_match)  = en_dets
       return! verify_tpass cam_name time_stamp exp_img mask_prob enrolled_details possible_match
    }

    let handle_detection (detected: (string * DetectedFacesReply)) =

        let (cam_name, det_faces) = detected
        printfn $"CAM: %s{cam_name} FACES in Frame: %i{det_faces.faces.Length}"

        let time_stamp = det_faces.timestamp

        det_faces.faces
        |> List.map (fun  x -> x.images.cropped |> get_possible_match)
        |> List.map (fun  x -> x |> get_enrolled_details_async)
        |> List.mapi (fun i x ->
           let exp_img =
               match det_faces.faces.[i].images.expanded with
               | Some exp -> exp
               | _ -> ""
           let mask_prob = det_faces.faces.[i].mask_probability
           verify_tpass_async cam_name time_stamp exp_img mask_prob x)
        |> Async.Parallel
        |> Async.RunSynchronously
        |> ignore
        ()

    let get_cams () = async {

       let! tcams = None |> cam_agent.get_cameras //|> Async.RunSynchronously
       cams <-
           match tcams with
           | Ok cs -> cs |> List.ofSeq
           | _ -> List.empty
       return cams
    }

    let get_cam_info () = async {

        let! cams    = get_cams()
        let! streams = det_agent.async_get_streams()

        return { available_cams = cams; streams = streams }
    }

    let notify_clients_camera_updating (cam: CameraStream) = async {

       let! cam_info = get_cam_info()
       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = cam.id then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }

       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
       //hub_context.Clients.All.Send (FRHub.Response.AvailableCameras cam_info) |> ignore
    }

    let notify_clients_camera_adding (cam: CameraStream) = async {

       let! cam_info = get_cam_info()
       let max_id (list: CameraStream list) =
           List.fold (fun acc (elem: CameraStream) -> if acc > elem.id then acc else elem.id ) 0 list

       let recent_cam = max_id cam_info.available_cams
       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = recent_cam then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }

       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
       //hub_context.Clients.All.Send (FRHub.Response.AvailableCameras cam_info) |> ignore
    }


    let notify_clients_camera_deleting (id: int) = async {

       let! cam_info = get_cam_info()

       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = id then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }
       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
       //hub_context.Clients.All.Send (FRHub.Response.AvailableCameras cam_info) |> ignore
    }

    let notify_clients_camera_updated () = async {
        let! cam_info = get_cam_info()
        hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
    }

    let notify_streams_starting() = async {
        printfn "Streams Starting on Server"
        hub_context.Clients.All.SendAsync("StreamsStarting") |> Async.AwaitTask |> Async.Start

        //hub_context.Clients.All.Send(FRHub.Response.StreamsStarting ) |> ignore
    }
    let notify_streams_stopping() = async {
        printfn "Streams Stopping on Server"
        hub_context.Clients.All.SendAsync("StreamsStopping") |> Async.AwaitTask |> Async.Start
        //hub_context.Clients.All.Send(FRHub.Response.StreamsStopping) |> ignore
    }

    let stop_streams () = async {

       let! cams = get_cams()
       do! notify_streams_stopping()
       let! sx = cams |> det_agent.stop_decode
       printfn $"%A{sx}"
       do! notify_clients_camera_updated ()
       return sx
    }

    let start_streams () = async {

       let! cams = get_cams()
       do! notify_streams_starting()
       let only_enabled = cams |> Seq.filter (fun x -> x.enabled) |>   List.ofSeq
       //reset the cache, value may have changed
       id_cache <- CacheMap(get_identity_cache_expiry()) //TODO: Use this?
       let! x = only_enabled |> det_agent.start_decode
       do! notify_clients_camera_updated ()

       return x
    }

    let start_stream (cam: CameraStream) = async {

        let! cams = get_cams()
        let cam_lst = cams |> Seq.filter(fun x -> x.name = cam.name) |> List.ofSeq

        match cam_lst.Length with
        | 0 ->
            return Error $"no available cameras named %s{cam.name}"
        | _ ->

            do! notify_clients_camera_updating cam
            let! res = cam_lst |> det_agent.start_decode
            do! notify_clients_camera_updated ()

            return
                match res with
                | StartStreamingResultList.Success s -> s.Head //we know there's only one.
                | StartStreamingResultList.StreamingError e -> Error e
                | StartStreamingResultList.ConnectionError e -> Error e
                | _ -> Error $"Could not start camera stream: %s{cam.name}"
    }

    let stop_stream (cam: CameraStream) = async {
      //start a single stream
        let! cams = get_cams()
        let cam_lst = cams |> Seq.filter(fun x -> x.name = cam.name) |> List.ofSeq
        match cam_lst.Length with
        | 0 ->
            return Error $"no available cameras named %s{cam.name}"
        | _ ->
            do! notify_clients_camera_updating cam
            let! res = cam_lst |> det_agent.stop_decode
            do! notify_clients_camera_updated ()
            return
                match res with
                | StopStreamingResultList.Success s -> s.Head //we know there's only one.
                | StopStreamingResultList.StreamingError e -> Error e
                | StopStreamingResultList.ConnectionError e -> Error e
                | _ -> Error $"Could not start camera stream: %s{cam.name}"
    }

    let sub_faces_detected () =

         if not handling_face_detection then

             det_agent.face_detected.Add(fun face_info ->
                 match face_info with
                 | Ok f -> f |> handle_detection
                 | Error e -> printfn $"face detection FAIL: %s{e} ")

             let disconn_sub = det_agent.stream_disconnected.Subscribe(fun dc ->
                 match dc with
                 | Error ex ->
                      printfn "STREAM HARD DISCONNECTED"
                      Async.Sleep 8000 |> Async.RunSynchronously  //timing is everything. This is shit. ;)
                      let n_streams = start_streams() |> Async.RunSynchronously
                      printfn "%A" n_streams
                      ()
                 | Ok s -> printfn $"%s{s}"
             )

             handling_face_detection <- true


    let set_camera_defaults(cam: CameraStream): CameraStream  =

       let user = "root"
       let password = "3y3Metr1c"
       { cam with
             user = user
             password = password
             connection = $"rtsp://%s{user}:%s{password}@%s{cam.ipaddress}/axis-media/media.amp"
             detect_frame_rate = 1
       }
    let add_camera (cam: CameraStream) = async {

        //set default user/pass
        //TODO: use default user/pass from config.
        let cam = cam |> set_camera_defaults
        let! res = cam_agent.save_camera cam
        printfn $"%A{res}"

        return!
            async {
                match res with
                | Ok _ ->

                    do! notify_clients_camera_adding(cam)
                    let! started = [cam] |> det_agent.start_decode
                    printfn $"FRSERVICE: New Cam stream started: %A{started}"
                    do! notify_clients_camera_updated ()
                    return "new camera saved"

                | Error e ->  //TODO: match on exception to provide correct message

                    if e.Message.Contains "constraint" then
                        return "Fail: attempt to add duplicate camera"
                    else return e.Message
            }
    }

    let remove_camera (id: int) = async {

        let! to_delete' = get_cams()
        let to_delete = to_delete' |> Seq.filter(fun c -> c.id = id) |> List.ofSeq

        match to_delete.Length with
        | 1 ->

            do! notify_clients_camera_deleting id
            let! res = cam_agent.delete_camera (CameraID id)
            return!
                async {
                    match res with
                    | Ok _ ->
                            //do! notify_clients_camera_update ()  doing this twice is odd. Reasons?
                            let msg =  "a camera was deleted"
                            let! stopped = to_delete |> det_agent.stop_decode
                            printfn $"FRSERVICE: stopped removed cam streams. %A{stopped} "
                            do! notify_clients_camera_updated ()
                            printfn "%s" msg
                            return Ok id
                    | Error e -> return Error e
               }
        | 0 -> return Error (Exception "requested camera not found")
        | _ -> return Error (Exception "duplicate cameras found. This should not happen.")
    }


    let update_camera (updated_cam: CameraStream) = async {

       do! notify_clients_camera_updating(updated_cam)
       let updated_cam = updated_cam |> set_camera_defaults
       //make sure the connection matched the address.
       //user: root  pass: 3y3Metr1c
       //TODO: this isn't quite the correct thing to do but it gets us up and runngin
       //IMPORTANT: we have to stop the running camera stream before updating its information.
       //otherwise the streaming service will become out of sync and unstable and that's just a bad time.
       //TODO: reject if camera id doesn't match existing camera. That's not cool bro
       let! current_cams = get_cams()
       //find the current (old) camera to be updated
       let old_cam = current_cams |> Seq.filter(fun x -> x.id = updated_cam.id) |> Seq.head

       let! strm_res = [old_cam] |> det_agent.stop_decode
       printfn $"FRSERVICE: old cam cam stream stopped : %i{old_cam.id} %s{old_cam.name}"
       let! res = cam_agent.update_camera updated_cam
       let! cams = get_cams()

       return!
            async {

                match res with
                | Ok _ ->
                    let ncam = cams |> Seq.filter(fun x -> x.id = updated_cam.id) |> List.ofSeq
                    //StartStreamingResultList (lol what is this?)
                    let! strm_res = ncam |> det_agent.start_decode
                    printfn $"FRSERVICE: updated cam stream started : %i{ncam.Head.id} %s{ncam.Head.name}"
                    do! notify_clients_camera_updated ()
                    let msg = "a camera was updated"
                    printfn "%s" msg
                    return Ok ncam.Head.id
                | Error e -> return Error e
            }
    }


    do
        printfn "start token timer and subscribing to face detection stream events"
        token_timer.start()
        sub_faces_detected()

    //new (fr_hub: Option<FableHubCaller<FRHub.Action, FRHub.Response>>) =
    new (fr_hub: Hub)=

        printfn "NEW UP THE FRSERVICE"

        let conf_agent = ConfigAgent ()
        let conf = conf_agent.get_latest_config()
        let cam_agent = CameraAgent ()
        let fr_log_agent = FRLogAgent ()
        let enroll_log_agent = Enrollment.EnrollLogAgent() //EnrollLogger?
        let c = conf.Value

        //let ag = FR_Agent(c)
        //TODO: this is dependent on tpass being able to provide us a jwt token. not the best place for it.
        //let res = ag.init() |> Async.RunSynchronously //might be ok since this is a startup only thing?

        //trying to remove FR_Agent. Too many layers
        let tpass_agent = init_tpass(c) |> Async.RunSynchronously //check opt
        let ident_agent = init_ident_agent(c) |> Async.RunSynchronously
        let enroll_agent = init_enroll_agent () |> Async.RunSynchronously
        let det_agent = init_detect_agent (c) |> Async.RunSynchronously

        FRService(conf_agent, tpass_agent, det_agent, ident_agent, enroll_agent, cam_agent, fr_log_agent, enroll_log_agent,  fr_hub)


    interface IFR with
        member self.get_conf () : Configuration option = config_agent.get_latest_config()
        //member self.get_agent () : FR_Agent = fr_agent

        member self.get_cams () : Async<CameraStream list> = get_cams()
        member self.get_cam_info () : Async<CameraInfo> = get_cam_info()
        member self.start_streams () = start_streams ()
        member self.stop_streams () = stop_streams ()
        member self.start_stream (cam: CameraStream) = start_stream cam
        member self.stop_stream (cam: CameraStream) = stop_stream cam
        member self.add_camera (cam: CameraStream) = add_camera cam
        member self.remove_camera (id: int) = remove_camera id //should have a better return value
        member self.update_camera (cam: CameraStream) = update_camera cam
        member self.log_enroll_attempt (item: EnrollLog) = log_enroll_attempt item

        member self.delete_enrollment (fr_id: string) = delete_enrollment fr_id
        member self.delete_all_enrollments () = delete_all_enrollments ()

        member self.get_client_by_ccode (ccode: CCode) = get_client_by_ccode ccode
        member self.search_tpass (search_req: SearchReq list) = search_tpass search_req
        member self.to_client_with_image (clients: TPassClient []) = to_client_with_image clients
        member self.enroll_clients (clients: TPassClientWithImage seq) = enroll_clients clients
        member self.get_identity (req: GetIdentityReq) = get_identity req

        member self.get_enrollment (id:string) = get_enrollment id
        member self.recognize (face: FaceImage) = recognize face
        member self.add_face (req: AddFaceReq) = add_face req
        member self.delete_face (req: DeleteFaceReq) = delete_face req
        member self.validate_user (user:string) (pass:string) = validate_user user pass
        member self.get_frlog_top (count: Option<int>) = get_frlog_top count
        member self.get_frlog_daterange (startdate: Option<string>) (enddate: Option<string>)= get_frlog_daterange startdate enddate
