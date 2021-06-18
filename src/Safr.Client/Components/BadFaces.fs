module Safr.Client.Components.BadFaces

open Safr.Client.AppState
open EyemetricFR.Shared
open Feliz
open Elmish


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

let private to_facemodel (face: IdentifiedFace): FaceModel =
        {
            ID = face.ID
            Name =  face.Name
            Cam = face.Cam
            Confidence = format_conf face.Confidence
            TimeStamp = face.TimeStamp
            Frame = System.Convert.ToBase64String(face.Frame)
            Status = "Watch!"//short_status face.Status
            Mask = format_mask_prop face.Mask
        }

[<ReactComponent(import="BadFaces", from="../src/badface.jsx")>]
let private BadFaces' (props: {| faces: FaceModel []; |}) = React.imported()

let BadFaces (props: {| m: Model; dispatch: Dispatch<Msg> |}) =
        BadFaces' {| faces= props.m.FRWatchList |> List.map(to_facemodel) |> List.toArray |}

