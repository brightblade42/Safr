module Safr.Client.Components.Login

open Safr.Client.AppState
open Feliz
open Elmish


[<ReactComponent(import="LoginComponent", from="../src/login.jsx")>]
let private Login' (props: {|m: Model; onLogin: string->string->unit |})  = React.imported()

let  Login (props: {|m: Model; dispatch: Dispatch<Msg> |})  =

    let on_login (user:string) (password:string) = (user,password) |> Login |> props.dispatch
    Login' {| m=props.m; onLogin=on_login |}



