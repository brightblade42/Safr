namespace EyemetricFR
#if FABLE_COMPILER
open Thoth.Json

#else
open Thoth.Json.Net
#endif
open Safr.Types.Paravision.Streaming
open Safr.Types.Eyemetric
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


    module FRHub =

        [<RequireQualifiedAccess>]
        type Action =
            | GetAvailableCameras
            | AddCamera       of CameraStream
            | RemoveCamera    of int //camname but not sure about this
            | UpdateCamera    of CameraStream
            //| StartStream     of string
            //| StopStream      of string  //We'd rather this be the CameraStream type
            | StartStream     of CameraStream
            | StopStream      of CameraStream
            | StartAllStreams
            | StopAllStreams


        [<RequireQualifiedAccess>]
        type Response =
            | Face                of IdentifiedFace
            | AvailableCameras    of CameraInfo
            | CameraStreamHealthy of bool
            | StreamStarting      of int
            | StreamStopping      of int
            | StreamsStarting //magic in progress
            | StreamsStopping
            | Noop //kind of a hak


    module Endpoints =
        let [<Literal>] Root = "socket/fr"


    //not used as much but, keep around
    module Remoting =

        type Service = {
            Recognize : unit -> Async<string>
            GetMessage : unit -> Async<string>
            Login: string * string -> Async<bool>
            GetLatestLog: Option<int> -> Async<Result<seq<FRLog>,exn>> //Some/None or Err?
        }
        with
            static member RouteBuilder _ m = $"/api/fr/%s{m}"

