module Safr.Client.Components.FRLog

open Feliz
open Elmish
open Safr.Client.State

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
}
[<ReactComponent(import="FRHistoryGrid", from="../src/frhistorygrid.jsx")>]
let private FRHistoryGrid' (props: {| model: GModel |}) = React.imported()
//let private FRHistoryGrid' (props: {| model: Model |}) = React.imported()

[<ReactComponent>]
let FRHistoryGrid (props: {| model: Model; dispatch: Dispatch<Msg>; |}) =
    //we wrap this for when we need extra things from parents without mucking up our component

    let rows = Seq.toArray props.model.FRLogs

    //Seq.map

    let pp = { Rows = rows; Columns=[] }
    //FRHistoryGrid' {| model=props.model |}
    FRHistoryGrid' {| model=pp |}




