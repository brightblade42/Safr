module Safr.Client.App

open System
open Feliz
open Browser.Dom
open Safr.Client.Components
open Safr.Client.State
open Feliz.UseElmish
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared //TODO: from EyemetricFR to Safr
open EyemetricFR.Shared.FRHub



[<ReactComponent>]
let App () =

    let model,dispatch = React.useElmish(init, update, [|  |])

    let login_status =
        match model.LoginStatus with
        | LoggedIn ->
            printfn "LOGGED IN"
            true
        | _ ->
            printfn "NOT LOGGED IN"
            false



    let hub = React.useSignalR<Action, Response> (fun hub ->

        //TODO : Use a dev/prod check. (until snowpack proxies our shit correctly
        hub.withUrl("http://localhost:8085/socket/fr")
        //hub.withUrl(Endpoints.Root)

            .withAutomaticReconnect()
            .configureLogging(LogLevel.Debug)
            .onMessage <|
                function
                | Response.Face face ->
                    UpdateFace face |> dispatch
                | Response.AvailableCameras cams ->
                    UpdateAvailableCameras cams |> dispatch
                | Response.StreamsStarting ->
                    printfn "STREAMS ARE STARTING NOTIFICATION"
                    true |> UpdateStreamsLoading |> dispatch
                | Response.StreamsStopping ->
                    true |> UpdateStreamsLoading |> dispatch
                    printfn "STREAMS ARE STOPPING NOTIFICATION"
                | Response.CameraStreamHealthy _ -> () //TODO: implement
                | Response.StreamStarting _ -> ()
                | Response.StreamStopping _ -> ()
                | Response.Noop -> ()
        )


    //TODO: this loads, regardless of login status which may not be what we want.

    let on_loaded () =
        let cb _ =
            printfn "get the available camera"
            hub.current.sendNow Action.GetAvailableCameras
            ()

        window.addEventListener("load", cb)
        { new IDisposable with member this.Dispose() = window.removeEventListener("load", cb) }

    React.useEffect((fun _ -> on_loaded) [|  |])

    if login_status then
        View.AppView {| m=model; dispatch=dispatch |}
    else
        Login.Login {| m=model; dispatch=dispatch |}








//ReactDOM.render(View.AppView, document.getElementById("safer-app"))