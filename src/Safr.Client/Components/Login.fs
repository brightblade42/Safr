module Safr.Client.Components.Login

open Safr.Client.AppState
open Feliz
open Elmish


[<ReactComponent(import="LoginComponent", from="../src/login.jsx")>]
let private Login' (props: {|m: Model; onLogin: unit->unit |})  = React.imported()

    (*
    Html.div [
        prop.children [
            Html.div [ prop.text "LOGIN!" ]
            Html.button [
                prop.text  "Very Secure"

                prop.onClick(fun _ ->
                   setUser("")
                   setPwd("")
                   (user, pwd) |> Login |> dispatch)
            ]
        ]
    ]
    *)


let  Login (props: {|m: Model; dispatch: Dispatch<Msg> |})  =

    let model = props.m
    let dispatch = props.dispatch
    //let user, setUser = React.useState("admin")
    //let pwd, setPwd = React.useState("admin")

    //let invalid_login  = user.Length = 0 || pwd.Length = 0 //very simple validation.

    let log_msg =
        match model.LoginStatus with
        | Failed msg -> msg
        | _ -> " "

    let on_login () =

        printfn "I'm supposed to log this shit in man"
        //setUser("")
        //setPwd("")
        ("admin", "admin") |> Login |> dispatch
        ()

    let lprops = {| m=props.m; onLogin=on_login |}

    Login' lprops


