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


type private RowData = {
    name: string
    address: string
    //direction: string
    direction: int
    enabled: bool
    confidence: float
}


[<ReactComponent>]
let private CameraSettings' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>; |}) =
//let private CameraSettings' (props: {| name: string |}) = //(props: {| m: Model; dispatch: Dispatch<Msg> |}) =
    let state , setState =
        [
            {
                name = "Main Entrance"
                address = "eyemetric.camera1.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Side Entrance"
                address = "eyemetric.camera2.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Main Exit"
                address = "eyemetric.camera3.com"
                direction = 0 //"Check out"
                enabled =  false
                confidence = 98.0
            }
            {
                name = "Main Entrance 2"
                address = "eyemetric.camera1.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Side Entrance 2"
                address = "eyemetric.camera2.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Main Exit 3"
                address = "eyemetric.camera3.com"
                direction =  0 //"Check out"
                enabled =  false
                confidence = 98.0
            }
             ] |> React.useState


    Html.div [
        prop.text "CAMERA SETTINGS PLACEHOLDER"
    ]

let CameraSettings content = CameraSettings' content
