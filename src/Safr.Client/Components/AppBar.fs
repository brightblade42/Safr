module Safr.Client.Components.AppBar
open Safr.Client
open Safr.Client.AppState
open Feliz
open Elmish
open Router


[<ReactComponent(import="AppBar", from="../src/appbar.jsx")>]
let private AppBar' (props: {| model: Model; onNav: string->unit |}) = React.imported()

let AppBar (props: {| m:Model; disp: Dispatch<Msg> |}) =

    let on_nav (goto:string) =
        match goto with
        | "index"    -> Router.navigatePage  Index
        | "about"    -> Router.navigatePage  About
        | "settings" -> ToggleCamSelectionModal |> props.disp
        | "logout"   -> Logout |> props.disp
        | _          -> Router.navigatePage Index
    ()

    AppBar' {| model= props.m; onNav=on_nav |}