module Safr.Client.Components

open EyemetricFR.Shared.FRHub
open Fable.SignalR
open Feliz
open Elmish
open Safr.Client
open Router
open Safr.Client.AppState
open EyemetricFR.Shared
open Safr.Types.Eyemetric
open Safr.Types.Paravision.Streaming

let private format_conf = function
   | x when x >= 1. -> "100%"
   | x -> (sprintf "%.2f%%" (x * 100.))


let private format_mask_prop = function
   | x when x >= 1. -> "100%"
   | x when x < 0.8 -> "No Mask"
   | x -> (sprintf "%.1f%%" (x * 100.))
let private short_status (status: string)  =
    match status with
    | x when x.ToLower() = "checked in" -> "in"
    | _ -> "out"


type FaceModel = {

    ID: string
    Name: string
    Cam: string
    Confidence: string //float
    TimeStamp: string
    //Image: string
    Frame: string
    Status: string
    Mask: string
}

module CamSettings =

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


module FRHistory =

    type Row = {
        id: int
        product: string
        owner: string
    }

    type Column = {
        name: string
        title: string
    }

    type GModel = {
        //Rows: Row seq
        Rows: FRLog seq
        Columns: Column seq
        on_load: unit -> unit
    }


let private to_facemodel (face: IdentifiedFace): FaceModel =
        {
            ID = face.ID
            Name =  face.Name
            Cam = face.Cam
            Confidence = format_conf face.Confidence
            TimeStamp = face.TimeStamp
            Frame = System.Convert.ToBase64String(face.Frame)
            Status = short_status face.Status
            Mask = format_mask_prop face.Mask
        }


type JSX =
    [<ReactComponent(import="GoodFaces", from="./src/goodface.jsx")>]
    static member GoodFaces (props: {| faces: FaceModel []; |}) = React.imported()

    [<ReactComponent(import="BadFaces", from="./src/badface.jsx")>]
    static member BadFaces (props: {| faces: FaceModel []; |}) = React.imported()

    [<ReactComponent(import="CameraSettings", from="./src/camerasettings.jsx")>]
    static member CameraSettingsGrid (props: {| model: CamSettings.GModel; funcs: CamSettings.Funcs  |}) = React.imported()

    [<ReactComponent(import="LoginComponent", from="./src/login.jsx")>]
    static member Login (props: {|m: Model; onLogin: string->string->unit |})  = React.imported()

    [<ReactComponent(import="FRHistoryGrid", from="./src/frhistorygrid.jsx")>]
    static member FRHistoryGrid (props: {| model: FRHistory.GModel |}) = React.imported()

    [<ReactComponent(import="VideoList", from="./src/axvideo.jsx")>]
    static member VideoList (props: {| available_cams: CameraStream [] |}) = React.imported()

    [<ReactComponent(import="AppBar", from="./src/appbar.jsx")>]
    static member AppBar (props: {| model: Model; onNav: string->unit |}) = React.imported()

let GoodFaces (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
        JSX.GoodFaces {| faces= props.m.MatchedFaces |> List.map(to_facemodel) |> List.toArray |}

let BadFaces (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
        JSX.BadFaces {| faces= props.m.FRWatchList |> List.map(to_facemodel) |> List.toArray |}

let CameraSettings (props: {| m: Model; dispatch: Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    let rows = props.m.AvailableCameras |> Array.ofList

    let pp: CamSettings.GModel = { Rows = rows; Columns = [] }

    let funcs: CamSettings.Funcs = {
        start_all_streams = (fun () -> props.hub.current.sendNow(Action.StartAllStreams))
        stop_all_streams = (fun () -> props.hub.current.sendNow(Action.StopAllStreams))
    }

    JSX.CameraSettingsGrid {| model=pp; funcs = funcs |}

let Login (props: {|m: Model; dispatch: Dispatch<Msg> |})  =

    let on_login (user:string) (password:string) = (user,password) |> Login |> props.dispatch
    JSX.Login {| m=props.m; onLogin=on_login |}


let FRHistoryGrid (props: {| model: Model; dispatch: Dispatch<Msg>; |}) =

    let rows = Seq.toArray props.model.FRLogs
    let on_load () = GetFRLogs |> props.dispatch

    let model: FRHistory.GModel = { Rows = rows; Columns=[]; on_load=on_load }
    JSX.FRHistoryGrid {| model=model |}

let VideoList (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
        JSX.VideoList {| available_cams = props.m.AvailableCameras |>  List.toArray |}

let AppBar (props: {| m:Model; disp: Dispatch<Msg> |}) =

    let on_nav (goto:string) =
        match goto with
        | "index"    -> Router.navigatePage  HomePage
        | "frhistory"    -> Router.navigatePage  FRHistoryPage
        | "settings" -> ToggleCamSelectionModal |> props.disp
        | "logout"   -> Logout |> props.disp
        | _          -> Router.navigatePage HomePage
    ()

    JSX.AppBar {| model= props.m; onNav=on_nav |}
