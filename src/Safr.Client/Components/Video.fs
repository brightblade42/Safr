module Safr.Client.Components.Video

open Browser
open Fable.Core
open Fable.Core.JS
open Fable.Core.JsInterop

open Feliz


[<ReactComponent(import="AVideo", from="../src/avideo.jsx")>]
let Video  (props: {| hostname: string; camname: string; doit: unit->unit |}) = React.imported()


[<ReactComponent>]
let AVid (props: {| hostname: string; camname: string  |}) =
        let printme () =
            printfn "hello sunshine"
            ()

        let pp = {| hostname=props.hostname; camname=props.camname; doit=printme |}
        Video pp

