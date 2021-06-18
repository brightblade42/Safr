module Safr.Client.View

open Feliz
open Elmish
open Router
open Safr.Client.AppState
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub
open Safr.Client.Components
[<ReactComponent>]
let AppView' (props: {| m: Model; dispatch:Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    //in our old version, we got rid of this...
    let navigation =
         AppBar {| m=props.m; disp=props.dispatch |}

    let render =
        Html.div [
           prop.children [
                match props.m.CurrentPage with
                | Page.HomePage -> Safr.Client.Pages.Index.HomeView {| dispatch=props.dispatch; m=props.m; |} // hub=hub |}
                | Page.FRHistoryPage -> Safr.Client.Pages.FRHistory.FRHistoryView {| dispatch=props.dispatch; m=props.m |}

                if props.m.CamSelectionModal then
                    CameraSettings props
           ]
        ]


    React.router [
        router.pathMode
        //router.onUrlChanged (Page.parseFromUrlSegments >> setPage)
        router.onUrlChanged (Page.parseFromUrlSegments >> UrlChanged >> props.dispatch)
        router.children [ navigation; render ]
        //router.children [ render ]
    ]

let AppView content = AppView' content
