module Safr.Client.Components.CameraSettings

open Fable.Core
open Fable.Core.Experimental
open Feliz
open Feliz.UseElmish
open Elmish
open Safr.Client.State
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
    Rows: Row seq
    Columns: Column seq
}
[<ReactComponent(import="CameraSettings", from="../src/camerasettings.jsx")>]
let private CameraSettingsGrid' (props: {| model: GModel |}) = React.imported()

let CameraSettingsGrid (props: {| model: GModel |}) =
    CameraSettingsGrid' props

[<ReactComponent>]
let private CameraSettings' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>; |}) =
//let private CameraSettings' (props: {| name: string |}) = //(props: {| m: Model; dispatch: Dispatch<Msg> |}) =

    let rows = [|
        {
            name = "Main Entrance1 "
            address = "eyemetric.camera1.com"
            direction = 1 //"Check in"
            enabled =  true
            confidence = 98.0
        }
        {
            name = "Library Entrance 1"
            address = "eyemetric.camera2.com"
            direction = 1 //"Check in"
            enabled =  true
            confidence = 98.0
        }
        {
            name = "Bay Door 1"
            address = "eyemetric.camera3.com"
            direction = 0 //"Check out"
            enabled =  false
            confidence = 98.0
        }
        {
            name = "Back Exit 1"
            address = "eyemetric.camera1.com"
            direction = 0 //"Check in"
            enabled =  true
            confidence = 98.0
        }
         |]

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

        ]
        //prop.text "Cool CAMERA SETTINGS PLACEHOLDER"

        prop.children [
            CameraSettingsGrid {| model=pp |}
        ]

    ]

let CameraSettings content = CameraSettings' content
