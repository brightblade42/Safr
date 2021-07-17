namespace EyemetricFR

open EyemetricFR.Server.Types
open Microsoft.AspNetCore.SignalR
open Safr.Types.Paravision.Streaming

type FRHub() =
    inherit Hub()

    //need to get the Context so we can get the FRService

    member self.SendMessageToAll(message:string) =
        printfn $"Sending %s{message} to All the boys and girls."
        self.Clients.All.SendAsync("ReceiveMessage", message) |> Async.AwaitTask |> Async.RunSynchronously

    member self.GetAvailableCameras() =
        printfn $"Retrieving available cameras"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        let cam_info  = fr.get_cam_info () |> Async.RunSynchronously
        printfn $"%A{cam_info}"
        self.Clients.All.SendAsync("AvailableCameras", cam_info ) |> Async.AwaitTask |> Async.StartImmediate

    member self.StartAllStreams() =
        printfn "Starting ALL the Streams! Anybody want a peanut?"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        fr.start_streams() |>  Async.Ignore |>  Async.Start
        ()

    member self.StopAllStreams() =
        printfn "Stop ALL the Streams! I MEAN IT"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        fr.stop_streams() |>  Async.Ignore |>  Async.Start
        ()
    member self.SendIdentifiedFace(face: IdentifiedFace) =
        printfn "sending a face"
        self.Clients.All.SendAsync("FaceIdentified", face) |> Async.AwaitTask |> Async.StartImmediate


    member self.StartStream(cam:CameraStream) =
        printfn "starting a single stream"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        cam |> fr.start_stream |> Async.Ignore |> Async.Start

    member self.StopStream(cam:CameraStream) =
        printfn "stopping a single stream"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        cam |> fr.stop_stream |> Async.Ignore |> Async.Start

    member self.UpdateCamera(cam:CameraStream) =
        printfn $"Updating camera : %s{cam.name}"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        cam |> fr.update_camera  |> Async.Ignore |> Async.Start //Async.RunSynchronously

    member self.AddCamera(cam: CameraStream) =
        printfn "Adding a new camera"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        cam |> fr.add_camera |> Async.Ignore |> Async.Start

    member self.RemoveCamera(cam_id: int) =
        printfn "removing a camera"
        let fr = self.Context.GetHttpContext().GetService<FRService>() :> IFR //not se this is the right place.
        cam_id |> fr.remove_camera |> Async.Ignore |> Async.Start

