module Safr.Client.Components.BadFaces


open Safr.Client.State
open EyemetricFR.Shared
open Feliz
open Elmish

module BadFaces =

    let private format_conf = function
           | x when x >= 1. -> "100%"
           | x -> (sprintf "%.3f%%" (x * 100.))


    let private short_status (status: string)  =
        match status with
        | x when x.ToLower() = "checked in" -> "in"
        | _ -> "out"


    [<ReactComponent(import="BadFace", from="../src/badface.jsx")>]
    let private BadFace' (props: {| model: Model |}) = React.imported()

    let BadFace (props: {| model: Model |}) =
        //we wrap this for when we need extra things from parents without mucking up our component
        BadFace' props

    [<ReactComponent>]
    let private BadFaces' (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
                    let model = props.m
                    Html.div [
                        prop.className ["flex overflow-x-scroll bg-wgray-100 pt-2 pb-6 mt-4 space-x-4"]
                        prop.children [
                            BadFace {| model=props.m |}
                            BadFace {| model=props.m |}
                          //  BadFace {| model=props.m |}
                          //  BadFace {| model=props.m |}

                           (*
                            //for face in model.FRWatchList do
                            for face in model.MatchedFaces do

                                let f_img  =
                                   match model.DisplayDetectedImage with
                                   | true -> face.Frame
                                   | false -> face.Image

                                BadFace {| model=props.m |}
                            *)

                        ]
                    ]



    let BadFaces content = BadFaces' content



