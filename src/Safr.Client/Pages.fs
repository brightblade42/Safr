module Safr.Client.Pages
open System
open Feliz
open Browser.Dom
open Elmish
open Feliz.UseDeferred
open Safr.Client.Components
open Safr.Client.AppState

open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub


[<ReactComponent>]
let HomePage (props: {| m: AppState; dispatch: Dispatch<Msg>; hub: Hub<Action,Response>;  |}) =

    let load_camera_info () = promise {
        console.log  "alert:  Getting Available Cameras."
        //set loading Camera State...?
        props.hub.current.sendNow Action.GetAvailableCameras
    }

    let tp = (fun ex -> console.log "FAIL: couldn't GetAvailableCameras"; ()) |> Promise.tryStart
    let try_promise = load_camera_info >> tp
    React.useEffect(try_promise, [|  |])

    let base_props = {| m =props.m; dispatch=props.dispatch |}

    Html.div [
        prop.className ["flex flex-col" ]
        prop.children [
           VideoList base_props
           GoodFaces base_props
           BadFaces base_props
        ]
    ]



[<ReactComponent>]
let FRHistoryPage (props: {| m: AppState; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    FRHistoryGrid  {| model=props.m; dispatch=props.dispatch |}

[<ReactComponent>]
let ScratchPage (props: {| m: AppState; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    OKDialog props

