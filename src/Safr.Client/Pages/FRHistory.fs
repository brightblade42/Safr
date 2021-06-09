module Safr.Client.Pages.FRHistory

open Safr.Client.Components.FRHistory //CameraSettings
open System
open Browser.Types
//open Fable.MaterialUI
//open Feliz.MaterialUI

open Feliz
open Elmish
open Safr.Client.Pages
open Safr.Client.State
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub

type GItem = {
    img_path: String
    title: String
    status: String

}

[<ReactComponent>]
let FRHistoryView' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    let dispatch = props.dispatch

    Html.div [
       prop.children [
           FRHistoryGrid  {| model=props.m; dispatch=props.dispatch |}
           Html.button [
              prop.className [ "btn-indigo mt-4 ml-2" ]
              prop.text  "Load Logs"
              prop.onClick(fun _ -> GetFRLogs |> dispatch)
           ]
       ]

    ]



let FRHistoryView content = FRHistoryView' content



