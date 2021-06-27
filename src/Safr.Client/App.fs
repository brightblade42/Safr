module Safr.Client.App

open System
open Feliz
open Elmish
open Router
open Browser.Dom
open Feliz.UseElmish
open Safr.Client.AppState
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub

[<ReactComponent>]
let AppView (props: {| m: AppState; dispatch:Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    let navigation =
         Html.div [
             //prop.className ["fixed z-10 top-0 right-0 left-0"]
             prop.children [
                Components.AppBar {| m=props.m; disp=props.dispatch |}
            ]
         ]

    let render =
        Html.div [
           prop.className ["mt-16"]
           prop.children [
                match props.m.CurrentPage with
                | Page.HomePage -> Pages.HomePage props
                | Page.FRHistoryPage -> Pages.FRHistoryPage {| dispatch=props.dispatch; m=props.m |}
                | Page.ScratchPage -> Pages.ScratchPage {| dispatch=props.dispatch; m=props.m |}

                if props.m.CamSelectionModal then
                    Components.CameraSettings props
           ]
        ]


    React.router [
        router.pathMode
        //router.onUrlChanged (Page.parseFromUrlSegments >> setPage)
        router.onUrlChanged (Page.parseFromUrlSegments >> UrlChanged >> props.dispatch)
        router.children [ navigation; render ]
        //router.children [ render ]
    ]


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
                    //true |> UpdateStreamsLoading |> dispatch
                    true |> StartingAllStreams |> dispatch
                | Response.StreamsStopping ->
                    true |> StoppingAllStreams |> dispatch
                    printfn "STREAMS ARE STOPPING NOTIFICATION"
                | Response.CameraStreamHealthy _ -> () //TODO: implement
                | Response.StreamStarting _ -> ()
                | Response.StreamStopping _ -> ()
                | Response.Noop -> ()
        )


    if login_status then
        //should I do the service here?
        AppView {| m=model; dispatch=dispatch; hub=hub; |}
    else
        Components.Login {| m=model; dispatch=dispatch |}
