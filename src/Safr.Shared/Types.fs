namespace EyemetricFR
#if FABLE_COMPILER
open Thoth.Json

#else
open Thoth.Json.Net
#endif
open Safr.Types.Paravision.Streaming
open Safr.Types.Eyemetric

(*
module Shared =

    type IdentifiedFace = {

        ID: string
        Name: string
        Cam: string
        Confidence: float
        TimeStamp: string
        Image: byte []
        Frame: byte []
        Status: string
        Mask: float
    }

    type CameraInfo = {
        available_cams: CameraStream list
        streams: Result<StreamState, string>
    }
*)