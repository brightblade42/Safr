module Safr.Program

open System
open System.IO
open System.IdentityModel.Tokens.Jwt
open EyemetricFR
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Cors.Infrastructure
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.DependencyInjection
open Giraffe

open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Microsoft.AspNetCore.Http
open FSharp.Control.Tasks.V2
open EyemetricFR.TPass.Types
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.Paravision.Types.Identification

open Thoth.Json.Giraffe

[<RequireQualifiedAccess>]
module Helpers =

    let delete_enrollment (ctx: HttpContext) (delete_request: DeleteEnrollmentRequest) =
       task {
                let fr = ctx.GetService<FRService>()
                return
                    delete_request.fr_ids
                    |> List.map (fun fr_id ->
                            let r = fr_id |> fr.delete_enrollment |> Async.RunSynchronously
                            match r with
                            | Ok rr -> Ok (fr_id, rr)
                            | Error e -> Error (fr_id, e)
                            )
       }

    let private create_log_item (result: string) (client: TPassClientWithImage) (ident: IdentityItem list option )  (msg: string option) =

                   let client_str = client.client |> TPassClient.to_str
                   let fail_msg = defaultArg msg "generic fail"

                   let (ccode, name, typ) =
                       match client.client with
                       | Student c -> (c.ccode, c.name, c.typ)
                       | Visitor c -> (c.ccode, c.name, c.typ)
                       | EmployeeOrUser c -> (c.ccode, c.name, c.typ)


                   let (pv_id, conf) =
                       match ident with
                       | None -> ("", 0.0)
                       | Some id -> (id.Head.id, id.Head.confidence)

                   {
                     ccode= (string ccode)
                     name=name
                     typ=typ
                     pv_id = pv_id
                     result=result
                     conf=conf
                     client=client_str
                     msg=fail_msg
                   }

    let private create_success_log_item = "Success" |> create_log_item
    let private create_fail_log_item = "Fail" |> create_log_item

    let private validate_binary (bytes: byte array) =
         //<!doctype html> in bytes. TPASS returns html when an image url is not found..workaround it.
         [|60uy; 33uy; 100uy; 111uy; 99uy; 116uy;|] <> bytes.[0..5]

    ///This function is a SPICY MEATABALL! TODO: rework this madness
    let enroll (ctx: HttpContext) (enroll_request: EnrollRequest) =
          task {
                let fr = ctx.GetService<FRService>()
                //narrow = 1  wide = many
                let (narrow_search, wide_search) =
                    enroll_request.candidates |> List.partition(fun x -> x.ccode.Length > 1)

                //ccode means narrow
                let! narrow_res =
                    narrow_search
                    |> List.map(fun x -> CCode x.ccode)
                    |> List.map(fun x -> x |> fr.get_client_by_ccode)
                    |> Async.Parallel

                //split into good and bad.
                let (narrow_res_success, narrow_res_fail) =
                   narrow_res
                   |> Array.partition(fun x ->
                        match x with
                        | Success _ -> true
                        | _ -> false)


                let narrow_res_success =
                    narrow_res_success
                    |> Array.map (fun x ->
                        match x with
                        | Success tpc -> tpc
                        | _ -> failwith "not gonna happen since we know these are good")


                let! wide_res =
                    wide_search
                    |> List.map(fun x -> [(x.id_or_name, x.typ, x.comp_id)])
                    |> List.map(fun x -> x |> fr.search_tpass)
                    |> Async.Parallel

                //TODO: check enollment database for ccode.. return already enrolled if exists.
                //or just check identitiy and pass back a confidence number with duplicate message?
                //got results, we'll want to build up a list of rejects and send them along to tell
                //TPASS that we think there's a duplicate.
                //massage the results.

                let tpass_clients =
                    wide_res
                    |> Array.map(fun (tpr:TPassResult<TPassClient []>) ->
                        match tpr with
                        Success tpc -> tpc
                        | _ -> [||] //TODO: place to log error?
                     )
                    |> Array.filter( fun x -> x.Length > 0)
                    |> Array.collect id

                //THE DATA HAS BEEN Massaged like a fine Wagyu filet.

                let all_clients = Array.concat [| tpass_clients; narrow_res_success |] //combine our different results

                //store this for final results.
                let search_count = all_clients.Length //the number of results. compare with enrollments.

                printfn $"ENROLL: Search Count : %i{search_count}"

                let! tpc_with_image = all_clients |> fr.to_client_with_image
                let client_with_img, client_no_img =
                    tpc_with_image
                    |> Array.partition(fun (x:TPassClientWithImage) ->
                        match x.image with
                        | Some img -> img |> validate_binary
                        | None -> false
                        )

                //LOG NO IMG: clients without images
                let no_img_logs = client_no_img |> Array.map(fun tpc -> (tpc, None, Some "no image") |||> create_fail_log_item)

                for item in no_img_logs do
                    let! r =  item |> fr.log_enroll_attempt
                    ()

                printfn $"ENROLL: client with image count: %i{client_with_img.Length}"
                printfn $"ENROLL: client with NO image count: %i{client_no_img.Length}"

                let enrollable_maybe = //, recognize_fails) =
                    client_with_img
                    |> Array.map(fun tpci ->
                         let r = fr.recognize (Binary tpci.image.Value) |> Async.RunSynchronously
                         printfn $"PROGRAM: Rec result: %A{r}"
                         match r with
                         | Ok rr -> Ok (tpci, rr.identities |> Some)
                         | Error e  -> Error (tpci, e) //failed requests?
                        )


                let enrollable_or_dupe =
                     enrollable_maybe
                     |> Array.filter(fun x -> match x with | Ok en -> true| _ -> false)
                     |> Array.map (fun x -> match x with | Ok item -> Some item | _ -> None)
                     |> Array.filter(fun x -> x.IsSome)
                     |> Array.map(fun x -> x.Value)

                let recognize_fails =
                     enrollable_maybe
                     |> Array.filter(fun x -> match x with | Ok _ -> false| _ -> true)
                     |> Array.map (fun x -> match x with | Ok item -> None | Error e -> Some e)
                     |> Array.filter(fun x -> x.IsSome)
                     |> Array.map(fun x -> x.Value)


                //LOG recognize fails
                let rec_failed_logs =
                    recognize_fails
                    |> Array.map( fun fail ->
                        let (tpci, msg) = fail
                        (tpci, None, Some msg ) |||> create_fail_log_item)

                for item in rec_failed_logs do
                    let! r = item |> fr.log_enroll_attempt
                    ()

                let (enrollable, duplicates_maybe) =
                    enrollable_or_dupe
                    |> Array.partition(fun x ->
                          let pm = (snd x)
                          match pm with
                          | Some p when p.Length = 0 -> true
                          //| Some p -> p |> List.exists(fun i -> i.confidence <= 0.998) //TODO: make a config value
                          | Some p -> p |> List.exists(fun i -> i.confidence <= 1.0) //TODO: make a config value
                          | None -> true //there was nuttin at all so we good? concerened this could be an error and misrep.
                        )

                //enrollable maybe.. could be enrollable or duplicate
                //recognize fails.. got a result from pv that was no good. "Bad Request" TODO: get something more better tan that.
                //LOG potential Duplicates
                //i would comint the map and for loop but don't know how to do the async bit in the loop. gives error.
                let duplicate_logs =
                     duplicates_maybe
                     |> Array.map(fun item ->  (fst item, snd item, Some "duplicate") |||> create_fail_log_item)

                for item in duplicate_logs do
                    let! r = item |> fr.log_enroll_attempt
                    ()

                printfn $"ENROLL: %i{enrollable.Length} enrollable out of %i{search_count} candidates"
                let! enroll_count =
                    enrollable
                    |> Array.map (fun x -> fst x) //extract the tpass portion
                    |> fr.enroll_clients

                printfn "===================================================="
                printfn "                !! Quick SUMMARY !! "
                printfn "===================================================="
                printfn  $"Searched: %i{search_count}  Enrolled: %i{enroll_count}  "
                printfn "===================================================="
                printfn ""
                printfn ""
                printfn "===================================================="
                printfn "                !!   FAILS  !!"
                printfn "===================================================="
                printfn $" NO IMG: %i{no_img_logs.Length} "
                printfn $" DUPES: {0} " //duplicate_logs.Length
                printfn $" RECOGNIZE FAILED: %i{recognize_fails.Length}"
                printfn "===================================================="

                return
                    {|
                          search_count = search_count
                          enroll_count = enroll_count
                          dupe_count = duplicates_maybe.Length
                          no_img_count = no_img_logs.Length
                          rec_fail_count = rec_failed_logs.Length
                          duplicates = duplicates_maybe
                    |}

         }


//HTTP Handlers


let recognize_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            try
                let img = ctx.Request.Form.Files.GetFile("image")
                use mem = new MemoryStream()
                img.OpenReadStream().CopyTo mem
                let face = FaceImage.Binary (mem.ToArray())
                let  fr  = ctx.GetService<FRService>()
                let! res = fr.recognize face

                match res with
                //TODO: Use confidence from config
                | Ok pm ->
                    return! json {pm with identities = pm.identities |> List.filter(fun f -> f.confidence > 0.9) } next ctx
                | Error e ->
                    return! json {face_count =0; identities = List.empty } next ctx

            with
            | :? Exception as ex ->
                    return! json {face_count =0; identities = List.empty } next ctx
        }

let add_face_handler  =
    fun  (next: HttpFunc) (ctx: HttpContext)  ->
        task {

            try
                let qs = ctx.Request.Query

                if qs.Item("fr_id").Count = 0 then
                    return! json {| error="you must provide an fr_id to add a face" |} next ctx
                else

                    let fr_id = qs.Item("fr_id").Item(0) //only one
                    let img = ctx.Request.Form.Files.GetFile("image")
                    use mem = new MemoryStream()
                    img.OpenReadStream().CopyTo mem
                    let face = FaceImage.Binary (mem.ToArray())

                    let  fr = ctx.GetService<FRService>()
                    let! res =  fr.add_face { id = fr_id; image=face; confidence= Some 0.8; }

                    match res with
                    | Ok f_id ->
                         return! json {| fr_id= fr_id; face_id = f_id.id |}  next ctx
                    | Error e ->
                         let msg =
                             match e with
                             | "NOT FOUND" -> $"enrollment with fr_id %s{fr_id} could not be found"
                             | _ -> $"could not not complete add face request. %s{e}"
                         return! json {| error=msg |} next ctx

                 with
                 | :? Exception as ex ->
                     let msg = $"couldn't process request: %s{ex.Message}"
                     return! json {| error=msg |} next ctx
        }

let read_request_body (ctx: HttpContext) =
        let req = ctx.Request.Body
        use sr  = new StreamReader(req)
        sr.ReadToEndAsync()

let logout_handler =
    fun (next: HttpFunc) (ctx: HttpContext) -> task {
        ctx.Session.Clear() //blitz the sesh.
        return! json {| msg="coming soon" |} next ctx
    }

let login_handler =
    fun (next: HttpFunc) (ctx: HttpContext) -> task {

        let confirm_user (res: Result<JwtSecurityToken, string>) =
           match res with
           | Ok tok ->
               let role = (string (tok.Payload.Item("Role")))
               ctx.Session.SetString("UserToken", tok.RawData) //not using session just yet.
               ctx.Session.SetString("UserRole", role)
               ctx.Session.SetString("UserExpires", tok.ValidTo.ToString())

               json {| valid=true; role=role |}
           | Error e ->
               json {| valid=false; error=e |}

        try
            let fr = ctx.GetService<FRService>()
            let! body_str = read_request_body ctx
            let login = LoginCred.from body_str
            let login_res =
                match login with
                | Ok lg ->
                    let res = (fr.validate_user lg.user lg.password)
                    confirm_user res
                | Error e -> json {| error=e |}

            return! login_res next ctx

        with
        | :? Exception as ex ->
            let msg = $"couldn't process request: %s{ex.Message}"
            return! json {| error=msg |} next ctx
    }

let frlog_handler =
    fun (next: HttpFunc) (ctx: HttpContext) -> task {
        try
            let fr = ctx.GetService<FRService>()
            let! body_str = read_request_body ctx
            let dr = DateRange.from body_str

            let r =
                match dr with
                | Ok range ->
                    let logs = fr.get_frlog_daterange (Some range.start_date) (Some range.end_date) |> Async.RunSynchronously
                    //not letting the detected image pass to the client for "security" reasons
                    match logs with
                    | Ok logs ->
                         let nlogs =
                             logs |> Seq.map(fun lg ->
                             let en = fr.get_enrollment lg.identity |> Async.RunSynchronously
                             match en with
                             | Ok (Some enr) ->
                                 let img = Convert.ToBase64String enr.pv_img
                                 {lg with matched_face = img; detected_img= ""}
                             | _ -> {lg with detected_img = ""}

                             )

                         json {| logs=nlogs  |}
                    | Error e ->
                        json {| logs=[]; error=e |}
                 | Error e -> json {| error=e |}
            return! r next ctx
         with
         | :? Exception as ex ->
             let msg = $"couldn't process request: %s{ex.Message}"
             return! json {| error=msg |} next ctx
     }

let delete_face_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            try
                let! body_str = read_request_body ctx
                let face_req_body = DeleteFaceRequest.from body_str

                match face_req_body with
                | Ok req ->
                    let  fr = ctx.GetService<FRService>()
                    let! del_res =  fr.delete_face { id = req.fr_id; face_id = req.face_id }

                    match del_res  with
                    | Ok f_id -> return! json {| fr_id= req.fr_id; face_id= f_id.id |} next ctx
                    | Error e ->
                         let msg =
                             match e with
                             | "NOT FOUND" -> $"enrollment with fr_id: %s{req.fr_id} and face_id: %i{req.face_id} could not be found"
                             | _ -> $"could not not complete delete face request. %s{e}"
                         return! json {| error=msg |} next ctx

                | Error e ->
                     let msg = $"couldn't complete delete face request. Looks like something is wrong with your json input. %s{e} "
                     return! json {| error=msg |} next ctx
            with
            | :? Exception as ex ->
                 let msg = $"couldn't process request: %s{ex.Message}"
                 return! json {| error=msg |} next ctx
        }

let get_identity_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            try
                let! body_str = read_request_body ctx
                match (GetIdentityRequest.from body_str) with
                | Ok id_req ->
                    let fr = ctx.GetService<FRService>()
                    let! id_res = fr.get_identity { id= id_req.fr_id  }
                    match id_res with
                    | Ok ident -> return! json ident next ctx
                    | Error e ->
                        let msg = $"could not get identity info. %s{e}"
                        return! json {| error=msg |} next ctx
                | Error e ->
                     let msg = $"couldn't complete get identity request. Looks like something is wrong with your json input. %s{e} "
                     return! json {| error=msg |} next ctx
            with
            | :? Exception as ex ->
                  let msg = $"could not process get identity request. %s{ex.Message}"
                  return! json {| error=msg |} next ctx
        }

let enroll_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {

            let! body_str = read_request_body ctx

            match (EnrollRequest.from body_str) with
            | Ok ereq ->
                printfn "%A" ereq
                let! enroll_res = Helpers.enroll ctx ereq
                let duplicates_maybe = enroll_res.duplicates

                let dupe_results =
                    duplicates_maybe |> Array.map (fun dp ->
                        let (tpc, pm) = dp
                        match pm with
                        | Some idents -> Some {| ccode= TPassClient.ccode tpc.client; identities = idents  |}
                        | None ->  None //{| ccode= TPassClient.ccode tpc; identities = []  |}
                    )
                    |> Array.filter (fun x -> x.IsSome)
                    |> Array.map (fun x -> x.Value)

                //json results  TODO: return better json results. Perhaps build proper datatype
                let jb = {|
                          search_count = enroll_res.search_count
                          enroll_count = enroll_res.enroll_count
                          dupe_count = enroll_res.dupe_count
                          no_img_count = enroll_res.no_img_count
                          rec_fail_count = enroll_res.rec_fail_count
                          duplicates = dupe_results
                    |}

                return! json jb next ctx
            | Error e ->
                return! json {| error="couldn't complete enrollment request. Looks like something is wrong with your json input." |} next ctx

        }

let delete_enrollment_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let! body_str = read_request_body ctx
            let enroll_req = DeleteEnrollmentRequest.from body_str

            match enroll_req with
            | Ok delete_request ->
                let! delete_results = Helpers.delete_enrollment ctx delete_request

                let  final_res = delete_results |> List.map (fun res ->
                        match res with
                        | Ok (fr_id, r) when r = 0 -> {| fr_id = fr_id; result = "fail"; msg = "fr_id was not found" |}
                        | Ok (fr_id, _) -> {| fr_id = fr_id; result = "success"; msg = "" |}
                        | Error (fr_id, e) -> {| fr_id = fr_id; result = "fail"; msg = e.Message |}
                )

                return! json {| delete_results=final_res |} next ctx

             | Error e -> return! json {| error="could not parse json input. Looks invalid." |} next ctx
       }

let delete_all_enrollments_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let fr = ctx.GetService<FRService>()
            let! del_res = fr.delete_all_enrollments ()

            match del_res with
            | Ok r ->
                let msg = $"%i{r} enrollments have been deleted"
                return! json {| delete_results=msg |} next ctx
            | Error e ->
                let msg = $"could not delete enrollments: %s{e.Message}"
                return! json {| error=msg |} next ctx
        }

let get_enrollments_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            //use sr = new StreamReader(ctx.Request.Body)
            //let! body_str = sr.ReadToEndAsync()
           return! json {| message="Coming Soon!" |} next ctx

        }

let start_camera_streams_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {

            let fr = ctx.GetService<FRService>()
            let! streams = fr.start_streams()

            return! json {| msg=streams |} next ctx
        }

let stop_camera_streams_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let fr = ctx.GetService<FRService>()
            let! streams =  fr.stop_streams()
            return! json {| msg=streams |} next ctx
        }
let add_camera_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {

            let! body_str = read_request_body ctx
            let cam_stream = CameraStream.from body_str

            match cam_stream with
            | Ok c ->
                let fr = ctx.GetService<FRService>()
                let! res = fr.add_camera c
                return! json {| msg=res |} next ctx
             | Error e -> return!  json {| msg=e |} next ctx
        }



let remove_camera_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let! body_str = read_request_body ctx
            let rem_cam_req = RemoveCameraRequest.from body_str

            match rem_cam_req with
            | Ok cr ->
                let fr = ctx.GetService<FRService>()
                let! res = fr.remove_camera cr.cam_id
                return! json {| msg= $"removed camera with id: %i{cr.cam_id}" |} next ctx

            | Error e -> return! json {| msg = $"Could not remove camera:  %s{e}"  |} next ctx

        }

let update_camera_handler =
    fun (next: HttpFunc) (ctx: HttpContext) ->
        task {
            let! body_str = read_request_body ctx
            let update_cam_req = UpdateCameraRequest.from body_str

            match update_cam_req with
            | Ok ur ->
                    let cam = ur.camera
                    let fr = ctx.GetService<FRService>()
                    let! res = fr.update_camera cam
                    return! json {| msg="Camera has been updated" |} next ctx

            | Error e -> return! json {| msg = $"Could not update camera:  %s{e}"  |} next ctx
        }

let webApp : HttpHandler =

    choose [
        GET >=>
            choose [
               route "/fr/enrollments" >=> get_enrollments_handler
               route "/fr/start-streams" >=> start_camera_streams_handler
               route "/fr/stop-streams" >=> stop_camera_streams_handler
               route "/fr/enrollment/delete-all" >=> delete_all_enrollments_handler
           ]
        POST >=>
            choose [
                route "/fr/validate_user" >=> login_handler
                route "/fr/logs" >=> frlog_handler
                route "/fr/recognize" >=> recognize_handler
                route "/fr/enrollment/create" >=> enroll_handler
                route "/fr/enrollment/delete" >=> delete_enrollment_handler
                route "/fr/get-identity" >=> get_identity_handler
                route "/fr/camera/add" >=> add_camera_handler
                route "/fr/camera/remove" >=> remove_camera_handler
                route "/fr/camera/update" >=> update_camera_handler
                route "/fr/enrollment/add-face" >=> add_face_handler
                route "/fr/enrollment/delete-face" >=> delete_face_handler
            ]
        DELETE >=>
            choose [
                route "/fr/enrollment/delete" >=> delete_enrollment_handler
                route "/fr/enrollment/delete-face" >=> delete_face_handler
                route "/fr/camera/remove" >=> remove_camera_handler
            ]
    ]


let configCors (builder: CorsPolicyBuilder) =
    builder.WithOrigins("http://localhost:8080").AllowAnyMethod().AllowAnyHeader() |> ignore


let add_deps (p: IServiceProvider) =
    let n_hub = p.GetRequiredService<FRHub>()
    let fr_svc = FRService n_hub
    fr_svc.sub_faces_detected()
    fr_svc


let configureApp (app: IApplicationBuilder) =

        //let fho = new ForwardedHeadersOptions() //for the reverse proxy magic
        //fho.ForwardedHeaders <- ForwardedHeaders.XForwardedFor ||| ForwardedHeaders.XForwardedProto
        //printfn "THIS IS WHERE THE WEB SOCKET CONN HAPPENS"
        app
          //  .UseForwardedHeaders(fho)
          //  .UseSession()
            .UseDefaultFiles()
            .UseStaticFiles()
            .UseSession()
            .UseRouting()

            .UseCors(fun opts ->
                 opts.AllowAnyHeader() |> ignore
                 opts.AllowAnyMethod() |> ignore
                 opts.SetIsOriginAllowed(fun origin -> true) |> ignore
                 opts.AllowAnyOrigin() |> ignore
                 ()
                )
            .UseEndpoints(fun endpoints -> endpoints.MapHub<FRHub>("/frhub") |> ignore )
            .UseGiraffe webApp

let configureServices (services: IServiceCollection) =

        services.AddSession() |> ignore
        services.AddDistributedMemoryCache() |> ignore
        services.AddSingleton<FRHub>() |> ignore
        services.AddSingleton<FRService>(add_deps) |> ignore
        services.AddSignalR() |> ignore
        services.AddCors()|> ignore
        services.AddGiraffe() |> ignore
        services.AddSingleton(ThothSerializer()) |> ignore


[<EntryPoint>]
let main _ =

     Host.CreateDefaultBuilder()
               .ConfigureWebHostDefaults(
                fun webHostBuilder ->
                    webHostBuilder

                        .Configure(Action<IApplicationBuilder> configureApp)
                        .ConfigureServices(configureServices)
                        .ConfigureLogging(fun x ->
                            x.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider> ("", LogLevel.Information) |> ignore
                        )

                        .UseUrls([|"http://0.0.0.0:8085"; "https://0.0.0.0:443" |])
                        .UseWebRoot("public")
                        |> ignore)
            .Build()
            .Run()

     0