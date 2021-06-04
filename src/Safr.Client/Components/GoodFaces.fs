module Safr.Client.Components.GoodFaces

open Safr.Client.State
open EyemetricFR.Shared
open Feliz
open Elmish

module GoodFaces =

    let private format_conf = function
           | x when x >= 1. -> "100%"
           | x -> (sprintf "%.3f%%" (x * 100.))


    let private short_status (status: string)  =
        match status with
        | x when x.ToLower() = "checked in" -> "in"
        | _ -> "out"



    [<ReactComponent(import="GoodFace", from="../src/goodface.jsx")>]
    let private GoodFace' (props: {| model: Model |}) = React.imported()

    let GoodFace (props: {| model: Model |}) =
        //we wrap this for when we need extra things from parents without mucking up our component
        GoodFace' props

    [<ReactComponent>]
    let private GoodFaces' (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
                    let x= "gool"
                    let model = props.m

                    Html.div [
                        prop.className ["flex overflow-x-scroll bg-bgray-100 pt-2 pb-6 px-4 mt-4 space-x-4"]
                        prop.children [
                            GoodFace {| model=props.m |}
                            GoodFace {| model=props.m |}
                            GoodFace {| model=props.m |}
                            GoodFace {| model=props.m |}

                           (*
                            for face in model.MatchedFaces do

                                let f_img  =
                                   match model.DisplayDetectedImage with
                                   | true -> face.Frame
                                   | false -> face.Image

                                GoodFace {| model=props.m |}
                            *)

                        ]
                    ]



    let GoodFaces content = GoodFaces' content
