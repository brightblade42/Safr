module Safr.Client.Components.FRHistory

open Feliz
open Elmish
open Safr.Client.AppState
open Safr.Types.Eyemetric
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub


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
[<ReactComponent(import="FRHistoryGrid", from="../src/frhistorygrid.jsx")>]
let private FRHistoryGrid' (props: {| model: GModel |}) = React.imported()

[<ReactComponent>]
let FRHistoryGrid (props: {| model: Model; dispatch: Dispatch<Msg>; |}) =
    //we wrap this for when we need extra things from parents without mucking up our component

    let rows = Seq.toArray props.model.FRLogs
    let on_load () = GetFRLogs |> props.dispatch

    let pp = { Rows = rows; Columns=[]; on_load=on_load }
    FRHistoryGrid' {| model=pp |}




