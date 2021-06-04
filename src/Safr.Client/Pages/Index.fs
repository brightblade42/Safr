module Safr.Client.Pages.Index

open Feliz
open Elmish
open Feliz.UseDeferred
open Safr.Client
open Safr.Client.Components
open Safr.Client.State

[<ReactComponent>]
let IndexView' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =

    Html.div [
        prop.className ["flex flex-col"]
        prop.children [
           VideoList.VideoList props   //TOOD: fix these ridiculous namespaces/modules
           GoodFaces.GoodFaces.GoodFaces props
           BadFaces.BadFaces.BadFaces props
        ]
    ]

let IndexView content  = IndexView' content