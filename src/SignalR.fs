namespace Safr
//open EyemetricFR.Server.Types
open Microsoft.AspNetCore.SignalR
open EyemetricFR.Paravision.Types.Streaming

type Arg = | FaceArg of IdentifiedFace | CameraArg of CameraInfo

type FRHub() =
    inherit Hub()

    member private self.get_svc() = self.Context.GetHttpContext().GetService<FRService>()

    member private self.send_all (command: string, arg: Arg) =
        match arg with
        | FaceArg f   -> self.Clients.All.SendAsync(command, f) |> Async.AwaitTask |> Async.Start
        | CameraArg c -> self.Clients.All.SendAsync(command, c) |> Async.AwaitTask |> Async.Start

    member self.GetAvailableCameras() =
        printfn $"Retrieving available cameras"
        let fr = self.get_svc()
        let cam_info  = fr.get_camera_info () |> Async.RunSynchronously
        printfn $"%A{cam_info}"
        self.send_all("AvailableCameras", CameraArg cam_info)

    member self.SendIdentifiedFace(face: IdentifiedFace) = self.send_all("FaceIdentified", FaceArg face)

    member self.StartAllStreams() =
        printfn "Starting ALL the Streams! Anybody want a peanut?"
        let fr = self.get_svc()
        fr.start_streams() |>  Async.Ignore |>  Async.Start
        ()

    member self.StopAllStreams() =
        printfn "Stop ALL the Streams! I MEAN IT"
        let fr = self.get_svc()
        fr.stop_streams() |>  Async.Ignore |>  Async.Start
        ()

    member self.StartStream(cam:CameraStream) =
        printfn "starting a single stream"
        let fr = self.get_svc()
        cam |> fr.start_stream |> Async.Ignore |> Async.Start

    member self.StopStream(cam:CameraStream) =
        printfn "stopping a single stream"
        let fr = self.get_svc()
        cam |> fr.stop_stream |> Async.Ignore |> Async.Start

    member self.UpdateCamera(cam:CameraStream) =
        printfn $"Updating camera : %s{cam.name}"
        let fr = self.get_svc()
        cam |> fr.update_camera  |> Async.Ignore |> Async.Start

    member self.AddCamera(cam: CameraStream) =
        printfn "Adding a new camera"
        let fr = self.get_svc()
        cam |> fr.add_camera |> Async.Ignore |> Async.Start

    member self.RemoveCamera(cam_id: int) =
        printfn "removing a camera"
        let fr = self.get_svc()
        cam_id |> fr.remove_camera |> Async.Ignore |> Async.Start

