module Safr.Client.Components

open EyemetricFR.Shared.FRHub
open Fable.SignalR
open Feliz
open Elmish
open Feliz.UseDeferred
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
    | x when x.ToLower().Contains("fr")  -> "watch!"
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


    type Column = {
        name: string
        title: string
    }

    type GModel = {
        //Rows: Row seq
        Rows: CameraStream seq
        Columns: Column seq
    }
    type UpdateCamAction = {
            id: int
            name: string
            address: string
            direction: int
            enabled: bool
    }


    type Funcs = {
        start_all_streams: unit->unit
        stop_all_streams: unit->unit
        update_camera: CameraStream->unit
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
        Rows: FRLog seq
        Columns: Column seq
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

//all of our actual UI is in jsx/tsx. I don't like the F# dsl.
type JSX =

    [<ReactComponent(import="OKDialog", from="./src/dialogs.tsx")>]
    static member OKDialog (props: {| model: AppState; |})  = React.imported()

    [<ReactComponent(import="OKCancelDialog", from="./src/dialogs.tsx")>]
    static member OKCancelDialog (props: {| model: AppState; |})  = React.imported()

    [<ReactComponent(import="GoodFaces", from="./src/goodface.tsx")>]
    static member GoodFaces (props: {| faces: FaceModel [] |}) = React.imported()

    [<ReactComponent(import="BadFaces", from="./src/badface.tsx")>]
    static member BadFaces (props: {| faces: FaceModel [] |}) = React.imported()

    [<ReactComponent(import="CameraSettings", from="./src/camerasettings.tsx")>]
    static member CameraSettingsGrid (props: {| model: AppState; gmodel: CamSettings.GModel; funcs: CamSettings.Funcs |}) = React.imported()

    [<ReactComponent(import="LoginComponent", from="./src/login.tsx")>]
    static member Login (props: {| model: AppState; onLogin: string->string->unit; |})  = React.imported()

    [<ReactComponent(import="FRHistoryGrid", from="./src/frhistorygrid.tsx")>]
    static member FRHistoryGrid (props: {| model: FRHistory.GModel; onLoad: unit->unit |}) = React.imported()

    [<ReactComponent(import="VideoList", from="./src/axvideo.jsx")>]
    static member VideoList (props: {| model: AppState; available_cams: CameraStream [] |}) = React.imported()

    [<ReactComponent(import="AppBar", from="./src/appbar.tsx")>]
    static member AppBar (props: {| model: AppState; onNav: string->unit |}) = React.imported()


let GoodFaces (props: {| m: AppState; dispatch: Dispatch<Msg> |}) =
        let props = {| faces=props.m.MatchedFaces |> List.map(to_facemodel) |> List.toArray |}
        JSX.GoodFaces props

let BadFaces (props: {| m: AppState; dispatch: Dispatch<Msg> |}) =
        let props = {| faces=props.m.FRWatchList |> List.map(to_facemodel) |> List.toArray |}
        JSX.BadFaces props

[<ReactComponent>]
let CameraSettings (props: {| m: AppState; dispatch: Dispatch<Msg>; hub: Hub<Action,Response>; |}) =

    let rows = props.m.AvailableCameras |> Array.ofList

    let update_camera (cam: CameraStream) =
        printfn $"CAM ACTION: %A{cam}"
        //printfn $"CAM ACTION: %A{cam.direction}"
        props.hub.current.sendNow(Action.UpdateCamera cam)
        ()

    let gmodel: CamSettings.GModel = { Rows = rows; Columns = [] }
    let funcs: CamSettings.Funcs = {
        start_all_streams = (fun () -> props.hub.current.sendNow(Action.StartAllStreams))
        stop_all_streams = (fun () -> props.hub.current.sendNow(Action.StopAllStreams))
        update_camera = update_camera
    }

    let nprops = {| model=props.m; gmodel=gmodel; funcs=funcs |}

    JSX.CameraSettingsGrid  nprops //{| gmodel=model; funcs=funcs |}


[<ReactComponent>]
let Login (props: {|m: AppState; dispatch: Dispatch<Msg> |})  =

    let onLogin (user:string) (password:string) =
        printfn "In the F# login function"
        (user,password) |> Login |> props.dispatch

    JSX.Login {| model=props.m; onLogin=onLogin |}


[<ReactComponent>]
let FRHistoryGrid (props: {| model: AppState; dispatch: Dispatch<Msg>; |}) =

    let rows = Seq.toArray props.model.FRLogs
    let model: FRHistory.GModel = { Rows = rows; Columns=[];  }
    let on_load () = GetFRLogs |> props.dispatch

    JSX.FRHistoryGrid  {| model=model; onLoad=on_load |}

[<ReactComponent>]
let VideoList (props: {| m: AppState; dispatch: Dispatch<Msg> |}) =
        //Lists don't translate to JS very well, so we have some dupe bs here.
        JSX.VideoList  {| model=props.m; available_cams = props.m.AvailableCameras |>  List.toArray |}

[<ReactComponent>]
let AppBar (props: {| m:AppState; disp: Dispatch<Msg> |}) =

    let on_nav (goto:string) =
        printfn $"GOTO: %s{goto}"
        match goto with
        | "index"    -> Router.navigatePage  HomePage
        | "frhistory"    -> Router.navigatePage  FRHistoryPage
        | "scratch"    -> Router.navigatePage  ScratchPage
        | "settings" -> ToggleCamSelectionModal |> props.disp
        | "logout"   -> Logout |> props.disp
        | _          -> Router.navigatePage HomePage
    ()

    JSX.AppBar {| model= props.m; onNav=on_nav |}

[<ReactComponent>]
let OKDialog (props: {| m:AppState; dispatch: Dispatch<Msg> |}) =
    //JSX.OKCancelDialog {| model= props.m; |}
    JSX.OKDialog {| model= props.m; |}
