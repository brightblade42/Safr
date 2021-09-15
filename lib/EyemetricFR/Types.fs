namespace EyemetricFR
open Thoth.Json
open Thoth.Json.Net


[<AutoOpen>]
module Types =

    type DateRange =
        {
          start_date: string
          end_date: string
        }
        static member Decoder: Decoder<DateRange> =
            Decode.object (fun get -> {
                start_date  = get.Required.At ["start_date"]  Decode.string
                end_date  = get.Required.At ["end_date"]  Decode.string
            })

        static member from (json: string) =
          Decode.fromString DateRange.Decoder json

    type FRError =
        {
            error: string
            msg: string
            timestamp: string
        }

    [<CLIMutable>]
    type FRLog =
            {

            identity: string
            detected_img: string //option //image from a camera
            matched_face: string //option  //image used as an enrollment.
            name: string
            confidence: float
            matched_on: string
            status: string
            location: string

            }

             static member Decoder: Decoder<FRLog> =
                Decode.object (fun get -> {
                    identity       = get.Required.At ["identity"]  Decode.string
                    detected_img  = get.Optional.At ["detected_img"]  Decode.string |> Option.defaultValue ""
                    matched_face   = get.Optional.At ["matched_face"] Decode.string |> Option.defaultValue ""
                    name           = get.Required.At ["name"]   Decode.string
                    confidence     = get.Required.At ["confidence"]   Decode.float
                    matched_on    = get.Required.At ["matched_on"]   Decode.string
                    status         = get.Required.At ["status"]   Decode.string
                    location       = get.Required.At ["location"]   Decode.string

            })

            static member from (json:string) = Decode.fromString FRLog.Decoder json
    type EnrollLog  = {
            ccode: string
            name: string
            typ: string
            pv_id: string
            result: string
            conf: float
            msg: string
            client: string
      }

    [<CLIMutable>]
    type Configuration = {
          identity_cache_expiry: int
          vid_streaming_addr: string
          detection_socket_addr: string
          pv_api_addr: string
          min_identity_confidence: float
          tpass_api_addr: string
          tpass_user: string
          tpass_pwd: string
          modified_on: string

    }


