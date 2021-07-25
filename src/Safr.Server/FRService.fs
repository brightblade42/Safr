namespace Safr
open System
open Microsoft.AspNetCore.SignalR
open EyemetricFR
open EyemetricFR.TPass.Types
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.Paravision.Types.Identification
open EyemetricFR.Utils
open EyemetricFR.Identifier
open EyemetricFR.Logging

type FRService(config_agent:Config, tpass_service:TPassService option,
               face_detector:FaceDetection, identifier:FaceIdentification, hub:Hub ) =

    let mutable config_agent               = config_agent
    let mutable identified_logger          = IdentifiedLogger()
    let mutable enrollment_logger          = EnrollmentLogger()
    let mutable tpass_service              = tpass_service
    let mutable enrollments                = Enrollments(System.IO.Path.Combine(AppContext.BaseDirectory, "data/enrollment.sqlite"))
    let mutable identifier                 = identifier
    let mutable face_detector              = face_detector
    let mutable cam_agent                  = Cameras ()
    let mutable id_cache                   = CacheMap(1000)
    let mutable hub_context                = hub
    let mutable cams: CameraStream list    =  []
    let mutable is_handling_face_detection = false

    let token_timer = SimpleTimer (84_600_000, fun () ->   //23.5hrs
        async {
            match tpass_service with
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

    let is_cached id =
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
      } |> identified_logger.log


    //TODO: Checkin calls may change when updated specifically for other TPASS Client types (Visitor . Employee
    let create_checkin_rec (compId: int) (ccode: int) =
          CheckInRecord.create(pkid=0, compId= compId, ccode=bigint ccode, flag= "I", date=DateTime.Now, timeIn=DateTime.Now)

    let create_checkout_rec (compId: int) (ccode: int) =
          CheckOutRecord.create(pkid=0, compId= compId, ccode=bigint ccode, flag= "O", date=DateTime.Now, timeOut=DateTime.Now)

    //TODO: Checkin / OUT for types other than students!
    let check_in (tpc: TPassClient) =

        let svc = tpass_service.Value

        let check_fn () =
            match tpc with
            | Student s -> (s.compId, s.ccode) ||> create_checkin_rec |> svc.checkin_student
            //TODO: add non student check ins
            //| EmployeeOrUser emp -> (emp.compId, emp.ccode) ||> create_checkin_rec |> fr_agent.checkin
            | _ ->  async { return Success "" } //Placeholder for other possible types

        let is_on_watchlist =  (tpc |> TPassClient.status).Contains("FR") //TODO: substring check is garbage.

        match is_on_watchlist with
        | true -> Some "FR Watchlist"
        | false ->
            let res = check_fn () |> Async.RunSynchronously
            match res with
            | Success _ -> "Checked In" |> Some
            | _ -> None //TODO: provide some other status? Unknown or something

    let check_out (tpc: TPassClient) =

        let svc = tpass_service.Value

        let check_fn () =
            match tpc with
            | Student s -> (s.compId ,s.ccode) ||> create_checkout_rec |> svc.checkout_student
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

        //TODO: what if multiple cameras have same name?
        let dir = cams |> List.filter(fun c -> c.name = cam_name) |>  List.map (fun x -> x.direction) |> List.head

        match (tcl, dir) with
        | Student s , 1        -> (s.name, check_in tcl)
        | Student s, 0         -> (s.name, check_out tcl)
        | EmployeeOrUser e, 1  -> (e.name, check_in tcl)
        | EmployeeOrUser e, 0  -> (e.name, check_out tcl)
        | _ -> ("Unknown", None)

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

        let tpa = tpass_service.Value
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
            let! pm =  (B64Encoding cropped) |> identifier.detect_identity
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
                    let pi = pm.Value
                    let conf = pi.identities.Head.confidence //TODO: consider more than the Head.
                    //TODO: using time from this machine, pv time is off #22.
                    let time =  String.Format("{0:hh:mm:ss tt}", time_stamp.ToLocalTime())
                    let tpc = ed
                    //TODO: if status is FR then don't do check in, call FRAlert
                    let check_res =  check_in_or_out tpc cam_name

                    match check_res with
                    | _, None -> ()
                    | name, Some status ->
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

                        printfn "FACE IDENTIFIED!"
                        hub_context.Clients.All.SendAsync("FaceIdentified", id_face) |> Async.AwaitTask |> Async.Start
                        (log_matched_identity id_face, pi, expanded_image) |> ignore
                        ()

              | Some (TPassError er) ->
                  printfn $"TPass Error %s{er.Message}"
                  ()
              | Some (PVNotRegisteredError id) ->
                  printfn $"ID not registered with TPass: %s{id}" //should we auto update this??
              | _ -> ()
    }


    let verify_tpass_async (cam_name: string) (time_stamp: DateTime) (exp_img: string) (mask_prob: float) (en_dets: Async<TPassResult<TPassClient> option * PossibleMatch option>) = async {

       let! enrolled_details, possible_match  = en_dets
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

    let set_camera_defaults(cam: CameraStream): CameraStream  =

       let user = "root"
       let password = "3y3Metr1c"
       { cam with
             user = user
             password = password
             connection = $"rtsp://%s{user}:%s{password}@%s{cam.ipaddress}/axis-media/media.amp"
             detect_frame_rate = 1
       }


    do
        printfn "start token timer and subscribing to face detection stream events"
        token_timer.start()

    new (fr_hub: Hub)=

        printfn "NEW UP THE FRSERVICE"

        let conf_agent        = Config ()
        let conf              = conf_agent.get_latest_config()
        let c = conf.Value

        let tpass_service = FRService.init_tpass(c) |> Async.RunSynchronously //check opt
        let ident_agent   = FaceIdentification(c.pv_api_addr)
        let det_agent     = FaceDetection(c.vid_streaming_addr.Trim(), c.detection_socket_addr)

        FRService(conf_agent, tpass_service, det_agent, ident_agent, fr_hub)


    static member init_tpass(conf: Configuration) = async {

        let tpass_agent = TPassService(conf.tpass_api_addr.Trim(),UserPass (conf.tpass_user, conf.tpass_pwd),  false)

        let! is_init = tpass_agent.initialize()
        return
            match is_init with
            | Success _ -> Some tpass_agent
            | _ -> None     //should we log, retru or none?
    }

    member self.sub_faces_detected () =

         if not is_handling_face_detection then

             face_detector.face_detected.Add(fun face_info ->
                 match face_info with
                 | Ok f -> f |> handle_detection
                 | Error e -> printfn $"face detection FAIL: %s{e} ")

             let disconn_sub = face_detector.stream_disconnected.Subscribe(fun dc ->
                 match dc with
                 | Error ex ->
                      printfn "STREAM HARD DISCONNECTED"
                      Async.Sleep 8000 |> Async.RunSynchronously  //timing is everything. This is shit. ;)
                      let n_streams = self.start_streams() |> Async.RunSynchronously
                      printfn "STREAMS STARTED: "
                      printfn $"%A{n_streams}"
                      ()
                 | Ok s -> printfn $"%s{s}"
             )

             is_handling_face_detection <- true


    member self.notify_clients_camera_updating (cam: CameraStream) = async {

       let! cam_info = self.get_camera_info()
       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = cam.id then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }

       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
    }

    member self.notify_clients_camera_adding (cam: CameraStream) = async {

       let! cam_info = self.get_camera_info()
       let max_id (list: CameraStream list) =
           List.fold (fun acc (elem: CameraStream) -> if acc > elem.id then acc else elem.id ) 0 list

       let recent_cam = max_id cam_info.available_cams
       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = recent_cam then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }

       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
    }

    member private self.notify_clients_camera_deleting (id: int) = async {

       let! cam_info = self.get_camera_info()

       let av = cam_info.available_cams |>
                List.map (fun (c:CameraStream) ->
                if c.id = id then {c with updating = true}
                else c )

       let cam_info = {cam_info with available_cams = av }
       hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
    }

    member private self.notify_clients_camera_updated () = async {
        let! cam_info = self.get_camera_info()
        hub_context.Clients.All.SendAsync("AvailableCameras", cam_info) |> Async.AwaitTask |> Async.Start
    }

    member private self.notify_streams_starting() = async {
        printfn "Streams Starting on Server"
        hub_context.Clients.All.SendAsync("StreamsStarting") |> Async.AwaitTask |> Async.Start

    }
    member private self.notify_streams_stopping() = async {
        printfn "Streams Stopping on Server"
        hub_context.Clients.All.SendAsync("StreamsStopping") |> Async.AwaitTask |> Async.Start
    }

    member self.get_conf () : Configuration option = config_agent.get_latest_config()

    member self.get_cameras(): Async<CameraStream list> = async {

       let! tcams = None |> cam_agent.get_cameras
       cams <-
           match tcams with
           | Ok cs -> cs |> List.ofSeq
           | _ -> List.empty
       return cams
    }

    member self.get_camera_info () : Async<CameraInfo> = async {

        let! cams    = self.get_cameras()
        let! streams = face_detector.async_get_streams()
        return { available_cams = cams; streams = streams }
    }

    member self.start_streams () = async {

       let! cams = self.get_cameras()
       do! self.notify_streams_starting()
       let only_enabled = cams |> Seq.filter (fun x -> x.enabled) |>   List.ofSeq
       //reset the cache, value may have changed
       id_cache <- CacheMap(get_identity_cache_expiry()) //TODO: Use this?
       let! x = only_enabled |> face_detector.start_decode
       do! self.notify_clients_camera_updated ()

       return x
    }

    member self.stop_streams () = async {

       let! cams = self.get_cameras()
       do! self.notify_streams_stopping()
       let! sx = cams |> face_detector.stop_decode
       printfn $"%A{sx}"
       do! self.notify_clients_camera_updated ()
       return sx
    }

    member self.start_stream (cam: CameraStream) = async {

        let! cams = self.get_cameras()
        let cam_lst = cams |> Seq.filter(fun x -> x.name = cam.name) |> List.ofSeq

        match cam_lst.Length with
        | 0 ->
            return Error $"no available cameras named %s{cam.name}"
        | _ ->

            do! self.notify_clients_camera_updating cam
            let! res = cam_lst |> face_detector.start_decode
            do! self.notify_clients_camera_updated ()

            return
                match res with
                | StartStreamingResultList.Success s -> s.Head //we know there's only one.
                | StartStreamingResultList.StreamingError e -> Error e
                | StartStreamingResultList.ConnectionError e -> Error e
                | _ -> Error $"Could not start camera stream: %s{cam.name}"
    }

    member self.stop_stream (cam: CameraStream) = async {

        let! cams = self.get_cameras()
        let cam_lst = cams |> Seq.filter(fun x -> x.name = cam.name) |> List.ofSeq
        match cam_lst.Length with
        | 0 ->
            return Error $"no available cameras named %s{cam.name}"
        | _ ->
            do! self.notify_clients_camera_updating cam
            let! res = cam_lst |> face_detector.stop_decode
            do! self.notify_clients_camera_updated ()
            return
                match res with
                | StopStreamingResultList.Success s -> s.Head //we know there's only one.
                | StopStreamingResultList.StreamingError e -> Error e
                | StopStreamingResultList.ConnectionError e -> Error e
                | _ -> Error $"Could not start camera stream: %s{cam.name}"
    }

    member self.add_camera (cam: CameraStream) = async {

        //TODO: use default user/pass from config.
        let cam = set_camera_defaults cam
        let! res = cam_agent.save_camera cam
        printfn $"%A{res}"

        return!
            async {
                match res with
                | Ok _ ->

                    do! self.notify_clients_camera_adding(cam)
                    let! started = face_detector.start_decode [cam]
                    printfn $"FRSERVICE: New Cam stream started: %A{started}"
                    do! self.notify_clients_camera_updated ()
                    return "new camera saved"

                | Error e ->  //TODO: match on exception to provide correct message

                    if e.Message.Contains "constraint" then
                        return "Fail: attempt to add duplicate camera"
                    else return e.Message
            }
    }

    member self.remove_camera (id: int) = async {

        let! to_delete' = self.get_cameras()
        let to_delete = to_delete' |> Seq.filter(fun c -> c.id = id) |> List.ofSeq

        match to_delete.Length with
        | 1 ->

            do! self.notify_clients_camera_deleting id
            let! res = cam_agent.delete_camera (CameraID id)
            return!
                async {
                    match res with
                    | Ok _ ->
                            //do! notify_clients_camera_update ()  doing this twice is odd. Reasons?
                            let msg =  "a camera was deleted"
                            let! stopped = to_delete |> face_detector.stop_decode
                            printfn $"FRSERVICE: stopped removed cam streams. %A{stopped} "
                            do! self.notify_clients_camera_updated ()
                            printfn "%s" msg
                            return Ok id
                    | Error e -> return Error e
               }
        | 0 -> return Error (Exception "requested camera not found")
        | _ -> return Error (Exception "duplicate cameras found. This should not happen.")
    }

    member self.update_camera (cam: CameraStream) = async {

       do! self.notify_clients_camera_updating(cam)
       let updated_cam = set_camera_defaults cam
       //make sure the connection matched the address.
       //user: root  pass: 3y3Metr1c
       //TODO: this isn't quite the correct thing to do but it gets us up and runngin
       //IMPORTANT: we have to stop the running camera stream before updating its information.
       //otherwise the streaming service will become out of sync and unstable and that's just a bad time.
       //TODO: reject if camera id doesn't match existing camera. That's not cool bro
       let! current_cams = self.get_cameras() //get_cams'()
       //find the current (old) camera to be updated
       let old_cam = current_cams |> Seq.filter(fun x -> x.id = updated_cam.id) |> Seq.head

       let! strm_res = [old_cam] |> face_detector.stop_decode
       printfn $"FRSERVICE: old cam cam stream stopped : %i{old_cam.id} %s{old_cam.name}"
       let! res = cam_agent.update_camera updated_cam
       let! cams = self.get_cameras()

       return!
            async {

                match res with
                | Ok _ ->
                    let ncam = cams |> Seq.filter(fun x -> x.id = updated_cam.id) |> List.ofSeq
                    //StartStreamingResultList (lol what is this?)
                    let! strm_res = ncam |> face_detector.start_decode
                    printfn $"FRSERVICE: updated cam stream started : %i{ncam.Head.id} %s{ncam.Head.name}"
                    do! self.notify_clients_camera_updated ()
                    let msg = "a camera was updated"
                    printfn "%s" msg
                    return Ok ncam.Head.id
                | Error e -> return Error e
            }
    }

    member self.log_enroll_attempt (item: EnrollLog) = async { return enrollment_logger.log item        }

    member self.delete_enrollment (fr_id: string) = async {

        let! del_id = identifier.delete_identity fr_id
        return enrollments.delete_enrollment fr_id
    }

    member self.delete_all_enrollments () = async {

        let! ids = identifier.get_identities()
        //pv
        let deleted_identities =
            match ids with
            | Ok ids -> ids |> Seq.map (fun x -> identifier.delete_identity x.id) |> Async.Parallel |> Async.RunSynchronously
            | Error e -> failwith $"could not get current identity list from paravision: %s{e}"
        //eyemetric
        let deleted_locals = enrollments.delete_all_enrollments ()
        return! deleted_locals
    }

    member self.get_client_by_ccode (ccode: CCode) = async {

        let svc = tpass_service.Value
        return! svc.get_client_by_ccode ccode
    }

    member self.search_tpass (search_req: SearchReq list) = async {
        let svc = tpass_service.Value
        return! svc.search_client search_req
    }

    member self.to_client_with_image (clients: TPassClient []) = async {

        let svc = tpass_service.Value
        return! Enrollment.combine_with_image svc clients
    }

    member self.enroll_clients(clients: TPassClientWithImage seq) = async {


        //TODO: What if tpass_reg fails? Should log that for later retry
        let svc = tpass_service.Value
        let! new_idents = Enrollment.create_enrollments identifier clients
        printfn $"ENROLL: PV identities created: %i{new_idents.Length}"

        let! enrolled = enrollments.batch_enroll new_idents
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
                 let ccode, pv = info
                 svc.update_pv (string ccode) pv
                 )
            |> Async.Parallel
            |> Async.RunSynchronously
            |> ignore

        return enroll_count
    }

    member self.get_identity (req: GetIdentityReq) = async { return! identifier.get_identity req }
    member self.get_enrollment (id:string)  = async { return enrollments.get_enrolled_details_by_id id  }
    member self.recognize (face: FaceImage) = async { return! identifier.detect_identity face }
    member self.add_face (req: AddFaceReq)  = async { return! identifier.add_face req }
    member self.delete_face (req: DeleteFaceReq) = async { return! identifier.delete_face req }

    member self.validate_user (user:string) (pass:string) =
            let svc = tpass_service.Value
            let cred = UserPass (user, pass)
            let is_valid = svc.validate_user cred |> Async.RunSynchronously

            match is_valid with
            | Success _ -> true
            | _ -> false //we're currently ignoring any errors (Auth Fail is an error)


    member self.get_frlog_daterange (startdate: Option<string>) (enddate: Option<string>)= async {

        printfn $"FR SERVICE: get_frlog daterange %A{startdate} : %A{enddate}"
        return! identified_logger.get_by_daterange startdate enddate
    }

