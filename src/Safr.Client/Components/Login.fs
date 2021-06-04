module Safr.Client.Components.Login

open Safr.Client.State
open Feliz
open Elmish


[<ReactComponent>]
let private login' (props: {|m: Model; dispatch: Dispatch<Msg> |})  =
    let model = props.m
    let dispatch = props.dispatch
    let user, setUser = React.useState("admin")
    let pwd, setPwd = React.useState("admin")

    let invalid_login  = user.Length = 0 || pwd.Length = 0 //very simple validation.

    let log_msg =
        match model.LoginStatus with
        | Failed msg -> msg
        | _ -> " "


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


    (*
    Bulma.container [
        prop.style [
           style.marginTop 150
        ]
        prop.children [

            Html.figure [
                prop.style [
                    style.marginLeft 120
                    style.marginBottom 25
                ]
                prop.className [""]
                prop.children [
                    Html.img [
                        prop.src "images/eye_logo.png"
                    ]
                ]
            ]

            Html.div [
                prop.style [
                    style.backgroundColor  (color.rgb (60, 111, 188)) //eyemetric blue
                ]
                prop.className [
                    "notification"
                    "is-primary"
                ]
                prop.children [
                    Bulma.input.text [
                        prop.id "username"
                        prop.name "username"
                        prop.placeholder "User"
                        prop.value user
                        prop.onChange(setUser)
                        prop.style [
                            style.marginBottom 20
                        ]
                    ]
                    Bulma.input.password [
                        prop.id "password"
                        prop.name  "password"
                        prop.placeholder "Password"
                        prop.value pwd
                        prop.onChange(setPwd)
                    ]

                    Html.div [
                        Html.span [
                            prop.style [
                                style.fontWeight 900
                            ]
                            prop.text $"%A{log_msg}"
                        ]
                    ]
                    Html.div [
                        prop.style [
                           style.display.flex
                           style.marginTop 20
                        ]
                        prop.children [
                            Bulma.button.button [
                               prop.style [
                                   style.marginLeft length.auto
                               ]
                               prop.disabled invalid_login
                               prop.onClick(fun _ ->
                                   setUser("")
                                   setPwd("")
                                   (user, pwd) |> Login |> dispatch)
                               prop.text "Login"
                            ]

                        ]
                   ]
                ]
            ]
        ]
    ]
    *)
let Login content = login' content

