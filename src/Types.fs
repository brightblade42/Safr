namespace Safr
open EyemetricFR.Paravision.Types.Streaming
open Thoth.Json.Net

type IdentifiedFace = {

    ID: string
    CCode: int
    CompId: int
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


//HTTP API types.
type DeleteEnrollmentRequest =
    {
        fr_ids: string list
    }
    static member Decoder: Decoder<DeleteEnrollmentRequest> =
        Decode.object (fun get -> {
            fr_ids = get.Required.At ["fr_ids"] (Decode.list  Decode.string)
          })

    static member from json = Decode.fromString DeleteEnrollmentRequest.Decoder json



type DeleteProfileRequest =
    {
        ccode: string
        pv_id: string
    }

    static member Decoder: Decoder<DeleteProfileRequest> =
        Decode.object(fun get -> {
            ccode = get.Required.At ["ccode"] Decode.string
            pv_id = get.Required.At ["pv_id"] Decode.string
        })

    static member from json = Decode.fromString DeleteProfileRequest.Decoder json



type EnrollCandidate =
    {
        id_or_name: string
        typ: string
        ccode: string
        comp_id: string
        confidence: float
    }

    static member Decoder: Decoder<EnrollCandidate> =
        Decode.object (fun get -> {
            ccode = get.Optional.At ["ccode"] Decode.string |> Option.defaultValue ""
            id_or_name = get.Optional.At ["id_or_name"] Decode.string |> Option.defaultValue ""
            typ = get.Required.At ["typ"] Decode.string
            comp_id = get.Optional.At ["comp_id"] Decode.string |> Option.defaultValue ""
            confidence = get.Optional.At ["confidence"] Decode.float |> Option.defaultValue 0.0
            })

    static member from json = Decode.fromString EnrollCandidate.Decoder json

type EnrollRequest  =
    {
    command: string
    candidates: EnrollCandidate list
    }

    static member Decoder: Decoder<EnrollRequest> =
        Decode.object (fun get -> {
            command = get.Required.At ["command"] Decode.string
            candidates = get.Required.At["candidates"] (Decode.list EnrollCandidate.Decoder)
            })

    static member from json = Decode.fromString EnrollRequest.Decoder json

type GetIdentityRequest =
    {
        fr_id: string
    }
    static member Decoder: Decoder<GetIdentityRequest> =
        Decode.object (fun get -> {
           fr_id = get.Required.Field "fr_id" Decode.string
            })
    static member from json = Decode.fromString GetIdentityRequest.Decoder json


type UpdateCameraRequest =
    {
        camera: CameraStream
    }
    static member Decoder: Decoder<UpdateCameraRequest> =
      Decode.object (fun get -> {
         camera = get.Required.Field "camera" CameraStream.Decoder

      })

    static member from json = Decode.fromString UpdateCameraRequest.Decoder json

type RemoveCameraRequest =
    {
        cam_id: int
    }

    static member Decoder: Decoder<RemoveCameraRequest> =
        Decode.object (fun get -> {
            cam_id = get.Required.At ["cam_id"] Decode.int
            })

    static member from (json: string) =
        Decode.fromString RemoveCameraRequest.Decoder json


type AddFaceRequest =
    {
        fr_id: string
    }

    static member Decoder: Decoder<AddFaceRequest> =
        Decode.object (fun get -> {
            fr_id = get.Required.At ["fr_id"] Decode.string
          })

    static member from json = Decode.fromString AddFaceRequest.Decoder json

type DeleteFaceRequest =
    {
        fr_id: string
        face_id: int
    }
    static member Decoder: Decoder<DeleteFaceRequest> =
        Decode.object (fun get -> {
            fr_id = get.Required.At ["fr_id"] Decode.string
            face_id = get.Required.At ["face_id"] Decode.int
          })

    static member from json = Decode.fromString DeleteFaceRequest.Decoder json
