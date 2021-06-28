namespace EyemetricFR


module FRHub =

    open Fable.SignalR
    open FSharp.Control.Tasks.V2
    open Shared.FRHub

    let create_cam_info (fr: IFR) =
        //fr.initialize_cameras() |> Async.RunSynchronously |> ignore //if not already
        let cam_info = fr.get_cam_info () |> Async.RunSynchronously
        cam_info

    //TODO: bring CameraStream type to shared so we don't have to do this dumb conversion.
    let update (msg: Action) (hubContext: FableHub) =

        let fr = hubContext.Services.GetService(typeof<FRService>) :?> IFR
        match msg with
        | Action.GetAvailableCameras ->

            let ci = create_cam_info fr
            Response.AvailableCameras ci
            //Response.AvailableCameras (fr.get_cams())

        | Action.AddCamera cam ->

            printfn "Adding a camera"
            //TODO: should be a result type so we can take action for errors.
            let res = cam |>  fr.add_camera |> Async.RunSynchronously
            //let ci = create_cam_info fr
            printfn "FROM ADD CAMERA"
            Response.Noop//AvailableCameras ci
            //Response.AvailableCameras (fr.get_cams())

        | Action.RemoveCamera cam_id ->

            let res = cam_id |> fr.remove_camera |> Async.RunSynchronously
            //let ci = create_cam_info fr
            Response.Noop
            //Response.AvailableCameras ci
            //Response.AvailableCameras (fr.get_cams ())

        | Action.UpdateCamera cam ->

            printfn $"CAM TO UPDATE : %A{cam}"
            //let res = cam |> fr.update_camera  |> Async.RunSynchronously
            cam |> fr.update_camera  |> Async.Ignore |> Async.Start //Async.RunSynchronously
            Response.Noop //Actual response is a broadcast in fr object

        | Action.StartAllStreams ->
            fr.start_streams () |> Async.Ignore |> Async.Start
            Response.Noop

        | Action.StopAllStreams ->
            fr.stop_streams () |> Async.Ignore |> Async.Start
            Response.Noop

        | Action.StartStream cam ->
            fr.start_stream cam |> Async.Ignore |> Async.Start
            Response.Noop

        | Action.StopStream cam ->
            fr.stop_stream cam |> Async.Ignore |> Async.Start
            Response.Noop

    let invoke (msg: Action) (hubContext: FableHub) = task { return update msg hubContext  }


    let send (msg: Action) (hubContext: FableHub<Action, Response>) =

        (msg , hubContext) ||> update |> hubContext.Clients.Caller.Send




