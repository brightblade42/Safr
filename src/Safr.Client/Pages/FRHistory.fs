module Safr.Client.Pages.FRHistory

open Safr.Client.Components.FRLog //CameraSettings
open System
open Browser.Types
//open Fable.MaterialUI
//open Feliz.MaterialUI

open Feliz
open Elmish
open Safr.Client.State
open Fable.SignalR
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub

type GItem = {
    img_path: String
    title: String
    status: String

}

(*let useStyles = Styles.makeStyles (fun styles theme ->
        {|
            root = styles.create [
                style.display.flex
                style.flexWrap.wrap
                style.justifyContent.spaceAround
                style.overflow.hidden
                style.backgroundColor theme.palette.background.paper
            ]

            gridList = styles.create [
                style.flexWrap.nowrap
                style.transform.translateZ 0
            ]

            title = styles.create [
                style.color theme.palette.primary.light
            ]

            titleBar = styles.create [
                style.backgroundImage "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
            ]

        |}

    )
*)
[<ReactComponent>]
let FRLogView' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    let dispatch = props.dispatch
    let isLoading, setLoading = React.useState(false)
    let content, setContent = React.useState("")
    let userId, setUserId = React.useState(0)
    let textColor, setTextColor = React.useState(color.red)
   // let c = useStyles()

    Html.div [
       prop.children [
           Html.div [ prop.text "FR History" ]
           Html.button [
              prop.text  "Load Logs"
              prop.onClick(fun _ -> GetFRLogs |> dispatch)
           ]
       ]

    ]

    (*
    Mui.paper [
       prop.style [
           style.marginTop 50
       ]
       prop.children [
          FRLog {| dispatch = dispatch; m=props.m; hub=props.hub |}

          Mui.button [
              button.variant.contained
              button.color.primary
              prop.style [
                  style.left 5
              ]
              prop.text "Load Logs"
              prop.onClick(fun x -> GetFRLogs |> dispatch)
          ]
       ]
    ] *)



let FRLogView content = FRLogView' content



