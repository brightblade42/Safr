module Safr.Client.Pages

open Feliz
open Elmish
open Feliz.UseDeferred
open Safr.Client.Components
open Safr.Client.AppState


[<ReactComponent>]
let HomePage (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =

    Html.div [
        prop.className ["flex flex-col"]
        prop.children [
           VideoList props
           GoodFaces props
           BadFaces props
        ]
    ]



[<ReactComponent>]
let FRHistoryPage (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    FRHistoryGrid  {| model=props.m; dispatch=props.dispatch |}
