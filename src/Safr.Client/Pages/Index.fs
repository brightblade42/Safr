module Safr.Client.Pages.Index

open Feliz
open Elmish
open Feliz.UseDeferred
open Safr.Client
open Safr.Client.Components
open Safr.Client.State

[<ReactComponent>]
let IndexView' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =

    let model, dispatch =  (props.m, props.dispatch)

    Html.div [

        prop.className ["flex  flex-col"]
        prop.children [

           Html.div [
               Safr.Client.Components.VideoList.VideoList props
               //prop.text "I am video"
           ]

           Html.div [
                Safr.Client.Components.GoodFaces.GoodFaces.GoodFaces props
           ]

           Html.div [
               Safr.Client.Components.BadFaces.BadFaces.BadFaces props
           ]
        ]
    ]


    //let callReq,setCallReq = React.useState(Deferred.HasNotStartedYet)
    //let call = React.useDeferredCallback((fun _ -> RemoteApi.service.GetMessage()), setCallReq)
    (*
    let title =
        match callReq with
        | Deferred.HasNotStartedYet -> "Click me!"
        | Deferred.InProgress -> "...loading"
        | Deferred.Resolved m -> m
        | Deferred.Failed err -> err.Message

    Html.button [
        prop.className ["mt-5 ml-5 text-blue-800 text-2xl"]
        prop.text title
        prop.onClick call
    ]
    *)

let IndexView content  = IndexView' content