module Safr.Client.Components.CameraSettings

open Feliz
open Feliz.UseElmish
open Elmish
open Safr.Client.AppState
open Fable.SignalR.Feliz
open Safr.Types.Paravision.Streaming

open EyemetricFR.Shared.FRHub

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
let private CameraSettingsGrid (props: {| model: GModel; funcs: Funcs  |}) = React.imported()


let CameraSettings (props: {| m: Model; dispatch: Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    let rows = props.m.AvailableCameras |> Array.ofList

    let pp = { Rows = rows; Columns = [] }

    let funcs = {
        start_all_streams = (fun () -> props.hub.current.sendNow(Action.StartAllStreams))
        stop_all_streams = (fun () -> props.hub.current.sendNow(Action.StopAllStreams))
    }

    CameraSettingsGrid {| model=pp; funcs = funcs |}

