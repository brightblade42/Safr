module Safr.Client.Components.BadFaces

open Safr.Client.AppState
open EyemetricFR.Shared
open Feliz
open Elmish

module BadFaces =

    let private format_conf = function
           | x when x >= 1. -> "100%"
           | x -> (sprintf "%.2f%%" (x * 100.))

    let private format_mask_prop = function
           | x when x >= 1. -> "100%"
           | x when x < 0.8 -> "No Mask"
           | x -> (sprintf "%.1f%%" (x * 100.))

    let private short_status (status: string)  =
        match status with
        | x when x.ToLower() = "checked in" -> "in"
        | _ -> "out"


    type FaceModel = {

        ID: string
        Name: string
        Cam: string
        Confidence: string //float
        TimeStamp: string
        //Image: string
        Frame: string
        Status: string
        Mask: string
    }

    [<ReactComponent(import="BadFace", from="../src/badface.jsx")>]
    let private BadFace' (props: {| model: Model; face: FaceModel |}) = React.imported()

    let BadFace (props: {| model: Model; face: IdentifiedFace |}) =
        //we wrap this for when we need extra things from parents without mucking up our component
        let face = props.face
        let fmodel = {
            ID = face.ID
            Name =  face.Name
            Cam = face.Cam
            Confidence = format_conf face.Confidence
            TimeStamp = face.TimeStamp
            Frame = System.Convert.ToBase64String(face.Frame)
            Status = "Watch!"//short_status face.Status
            Mask = format_mask_prop face.Mask
        }
        BadFace' {| model = props.model; face = fmodel |}

    [<ReactComponent>]
    let private BadFaces' (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
                    let model = props.m
                    Html.div [
                        prop.className ["flex overflow-x-scroll bg-wgray-100 pt-2 pb-6 mt-0 space-x-4"]
                        prop.children [

                            for face in model.FRWatchList do
                                BadFace {| model=props.m; face=face |}

                        ]
                    ]



    let BadFaces content = BadFaces' content



