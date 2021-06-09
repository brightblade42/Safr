module Safr.Client.View

open Feliz
open Elmish
open Feliz.UseElmish
open Router
open SharedView
open Safr.Client.State

open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub
(*
type Model = {
    Count: int
}

type Msg = | GetCount
let init () = { Count = 0 }, Cmd.none
let update (msg:Msg) (model:Model) : Model * Cmd<Msg> =
    match msg with
    | GetCount -> { model with Count = 1; }, Cmd.none
*)
open Safr.Client.Components.AppBar
[<ReactComponent>]
let AppView' (props: {| m: Model; dispatch:Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    //in our old version, we got rid of this...
    let navigation =
         AppBar {| m=props.m; disp=props.dispatch |}

    let render =
        Html.div [
           prop.children [
                match props.m.CurrentPage with
                | Page.Index -> Safr.Client.Pages.Index.IndexView {| dispatch=props.dispatch; m=props.m; |} // hub=hub |}
                | Page.About -> Safr.Client.Pages.FRHistory.FRHistoryView {| dispatch=props.dispatch; m=props.m |}
                    //Html.text "Very nice, all of us in the same device"

                if props.m.CamSelectionModal then
                    Safr.Client.Components.CameraSettings.CameraSettings props
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
