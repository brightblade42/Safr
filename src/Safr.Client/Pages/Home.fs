module Safr.Client.Pages.Index

open Feliz
open Elmish
open Feliz.UseDeferred
open Safr.Client
open Safr.Client.Components.VideoList
open Safr.Client.Components.GoodFaces
open Safr.Client.Components.BadFaces
open Safr.Client.AppState

[<ReactComponent>]
let HomeView (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =

    Html.div [
        prop.className ["flex flex-col"]
        prop.children [
           VideoList props
           GoodFaces props
           BadFaces props
        ]
    ]
