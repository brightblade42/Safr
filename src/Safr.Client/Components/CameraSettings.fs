module Safr.Client.Components.CameraSettings

open Fable.Core
open Fable.Core.Experimental
open Feliz
open Feliz.UseElmish
open Elmish
open Safr.Client.AppState
open Fable.SignalR.Feliz
open Safr.Types.Paravision.Streaming

open EyemetricFR.Shared.FRHub
//open Feliz.MaterialUI
//open Feliz.MaterialUI.MaterialTable


type  Row = {
    name: string
    address: string
    //direction: string
    direction: int
    enabled: bool
    confidence: float
}

type Column = {
    name: string
    title: string
}

type GModel = {
    //Rows: Row seq
    Rows: CameraStream seq
    Columns: Column seq
}
type Funcs = {
    start_all_streams: unit->unit
    stop_all_streams: unit->unit
}
[<ReactComponent(import="CameraSettings", from="../src/camerasettings.jsx")>]
let private CameraSettingsGrid' (props: {| model: GModel; funcs: Funcs  |}) = React.imported()

let CameraSettingsGrid (props: {| model: GModel; funcs: Funcs |}) =
    CameraSettingsGrid' props

[<ReactComponent>]
let private CameraSettings' (props: {| m: Model; dispatch: Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    let rows = props.m.AvailableCameras |> Array.ofList

    let pp = { Rows = rows; Columns = [] }
    Html.div [
        prop.style [
            style.position.absolute
            //style.height (length.percent 100)
            style.top 460
            //style.width  (length.percent 90)
            //fstyle.marginLeft  100
            //style.marginRight 50d
            style.minHeight 600
            //style.height 800

        ]
        //prop.text "Cool CAMERA SETTINGS PLACEHOLDER"

        //let start_streams () =
        //    props.hub.current.sendNow (Action.StartAllStreams)

        let funcs = {
            start_all_streams = (fun () -> props.hub.current.sendNow(Action.StartAllStreams))
            stop_all_streams = (fun () -> props.hub.current.sendNow(Action.StopAllStreams))
        }

        prop.children [
            CameraSettingsGrid {| model=pp; funcs = funcs |}
        ]

    ]

let CameraSettings content = CameraSettings' content
