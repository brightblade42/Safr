module Safr.Client.App

open Feliz
open Elmish
open Router
open Feliz.UseElmish
open Safr.Client.AppState
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub

[<ReactComponent>]
let AppView (props: {| m: AppState; dispatch:Dispatch<Msg>; |}) = // hub: Hub<Action,Response>; |}) =

    let dispatch = props.dispatch
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
    let navigation =
         Html.div [
             prop.children [
                Components.AppBar {| m=props.m; disp=props.dispatch |}
            ]
         ]

    let render =
        Html.div [
           prop.className ["mt-16"]
           prop.children [
                match props.m.CurrentPage with
                | Page.HomePage -> Pages.HomePage {| m=props.m; dispatch=dispatch; hub=hub; |}
                | Page.FRHistoryPage -> Pages.FRHistoryPage {| dispatch=props.dispatch; m=props.m |}
                | Page.ScratchPage -> Pages.ScratchPage {| dispatch=props.dispatch; m=props.m |}

                if props.m.CamSelectionModal then
                    Components.CameraSettings {| m=props.m; dispatch=dispatch; hub=hub; |}
           ]
        ]


    React.router [
        router.pathMode
        router.onUrlChanged (Page.parseFromUrlSegments >> UrlChanged >> props.dispatch)
        router.children [ navigation; render ]
    ]


[<ReactComponent>]
let App () =

    let model,dispatch = React.useElmish(init, update, [|  |])

    match model.LoginStatus with
    | LoggedIn ->
        AppView {| m=model; dispatch=dispatch; |}
    | _ ->
        printfn "NOT LOGGED IN"
        Components.Login {| m=model; dispatch=dispatch |}

