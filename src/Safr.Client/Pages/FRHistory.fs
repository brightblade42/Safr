module Safr.Client.Pages.FRHistory

open Safr.Client.Components.FRHistory
open System

open Feliz
open Elmish
open Safr.Client.AppState
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub


[<ReactComponent>]
let FRHistoryView (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    FRHistoryGrid  {| model=props.m; dispatch=props.dispatch |}





