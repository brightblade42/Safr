namespace EyemetricFR.Paravision.Types
open System
open Thoth.Json.Net
open FSharp.Data
open FSharp.Data.JsonExtensions

module Streaming =

    type CameraID = CameraID of int

    [<CLIMutable>]
    type CameraStream =
        {
          id: int
          ipaddress: string
          connection: string
          name: string
          enabled: bool
          user: string
          password: string
          direction: int
          streaming: bool
          detect_frame_rate: int
          secure: bool
          updating: bool
        }
        static member Decoder: Decoder<CameraStream> =
          Decode.object (fun get -> {
                id                 = get.Required.Field "id"         Decode.int
                ipaddress          = get.Required.Field "ipaddress"  Decode.string
                connection         = get.Required.Field "connection" Decode.string
                name               = get.Required.Field "name"       Decode.string
                enabled            = get.Required.Field "enabled"    Decode.bool
                user               = get.Required.Field "user"       Decode.string
                password           = get.Required.Field "password"   Decode.string
                direction          = get.Required.Field "direction"  Decode.int
                streaming          = get.Optional.Field "streaming"  Decode.bool |> Option.defaultValue false
                detect_frame_rate  = get.Optional.Field "detect_frame_rate"  Decode.int |> Option.defaultValue 1
                secure             = get.Optional.Field "enabled"    Decode.bool |> Option.defaultValue false
                updating           = get.Optional.Field "updating"    Decode.bool |> Option.defaultValue false
          })
        static member from json = Decode.fromString CameraStream.Decoder json


    //MessageTypes representing json structures returned from Paravision api.
    ///Return from PV with info about out our request to Start a Camera stream
    type StartDecodeReply =
        { message: string; name: string; source: string; success: bool }

        static member Decoder : Decoder<StartDecodeReply> =
          Decode.object (fun get -> {
            message = get.Optional.At ["message"] Decode.string |> Option.defaultValue "no message"
            name    = get.Optional.At ["name"]    Decode.string |> Option.defaultValue "no name"
            source  = get.Optional.At ["source"]  Decode.string |> Option.defaultValue "no source"
            success = get.Optional.At ["success"] Decode.bool   |> Option.defaultValue false
          })

    ///Return from PV with info about out our request to Start a Camera stream
    type StopDecodeReply =
      { message: string; success: bool }

      static member Decoder : Decoder<StopDecodeReply> =
        Decode.object (fun get -> {
              message = get.Optional.At ["message"] Decode.string |> Option.defaultValue "no message"
              success = get.Optional.At ["success"] Decode.bool   |> Option.defaultValue false
          })

    type StreamInfoMeta =
        { codec: string; frame_rate: string; height: int; width: int }

        static member Decoder : Decoder<StreamInfoMeta> =
            Decode.object (fun get -> {
                codec = get.Required.At [ "codec" ] Decode.string
                frame_rate = get.Required.At [ "frame_rate" ] Decode.string
                height = get.Required.At [ "height" ] Decode.int
                width = get.Required.At [ "width" ] Decode.int
            })

    type StreamInfo =
        {
          name: string
          source: string
          detect_frame_rate: int
          expanded_image_scale: float;
          tracking_duration: int
          rotation: int
          enable_tracking: bool
          skip_identical_frames: bool;
          latest_activity: DateTime   //TODO: are we sure this belongs here?
          metadata: StreamInfoMeta
        }

        static member Decoder : Decoder<StreamInfo> =
            Decode.object (fun get -> {
                detect_frame_rate      = get.Required.At [ "detect_frame_rate" ]     Decode.int
                enable_tracking        = get.Required.At [ "enable_tracking"  ]      Decode.bool
                expanded_image_scale   = get.Required.At [ "expanded_image_scale" ]  Decode.float
                latest_activity        = get.Required.At ["latest_activity"]         Decode.datetime
                metadata               = get.Required.At ["metadata"]                StreamInfoMeta.Decoder
                name                   = get.Required.At [ "name" ]                  Decode.string
                rotation               = get.Required.At [ "rotation" ]              Decode.int ;
                skip_identical_frames  = get.Required.At [ "skip_identical_frames" ] Decode.bool;
                source                 = get.Required.At ["source"]                  Decode.string
                tracking_duration      = get.Required.At ["tracking_duration"]       Decode.int
            })

    type StreamState =
        { message:string; streams: StreamInfo list }

        static member Decoder: Decoder<StreamState> =
            Decode.object ( fun get -> {
               message = get.Required.At ["message"] Decode.string
               streams = get.Required.At ["streams"] (Decode.list StreamInfo.Decoder)

            })

        static member from json = Decode.fromString StreamState.Decoder json

    type Coord =
      { x: float; y: float }

      static member Decoder: Decoder<Coord> =
        Decode.object (fun get -> {
          x = get.Required.At ["x"] Decode.float
          y = get.Required.At ["y"] Decode.float
        })
    type BoundingBox =
      { top_left: Coord; bottom_right: Coord }

      static member Decoder: Decoder<BoundingBox> =
        Decode.object (fun get -> {
          top_left     = get.Required.At ["top_left"]     Coord.Decoder
          bottom_right = get.Required.At ["bottom_right"] Coord.Decoder
        })


    type Landmarks =
      { left_eye: Coord; right_eye: Coord; nose: Coord; left_mouth: Coord; right_mouth: Coord; }

      static member Decoder: Decoder<Landmarks> =
        Decode.object (fun get -> {
          left_eye    = get.Required.At ["left_eye"]    Coord.Decoder
          right_eye   = get.Required.At ["right_eye"]   Coord.Decoder
          nose        = get.Required.At ["nose"]        Coord.Decoder
          left_mouth  = get.Required.At ["left_mouth"]  Coord.Decoder
          right_mouth = get.Required.At ["right_mouth"] Coord.Decoder
        })

    type B64Images =
        { cropped: string option; expanded: string option   }

        static member Decoder: Decoder<B64Images> =
          Decode.object (fun get -> {
            cropped = get.Optional.At ["cropped"] Decode.string
            expanded = get.Optional.At ["expanded"] Decode.string
          })


    type Face =
          {
            bounding_box: BoundingBox
            landmarks: Landmarks
            acceptability: float
            quality: float
            pitch: float
            yaw: float
            roll: float
            tracking_id: string //Todo: maybe a guid
            images: B64Images
            mask_probability: float
          }

          static member Decoder: Decoder<Face> =
            Decode.object (fun get -> {
              bounding_box = get.Required.At ["bounding_box"]  BoundingBox.Decoder
              landmarks = get.Required.At ["landmarks"] Landmarks.Decoder
              acceptability = get.Required.At ["acceptability"] Decode.float
              quality = get.Required.At ["quality"] Decode.float
              pitch = get.Required.At ["pitch"] Decode.float
              yaw = get.Required.At ["yaw"] Decode.float
              roll = get.Required.At ["roll"] Decode.float
              tracking_id = get.Optional.At ["tracking_id"] Decode.string |> Option.defaultValue ""
              images = get.Required.At ["images"]  B64Images.Decoder
              mask_probability = get.Optional.At["mask_probability"] Decode.float |> Option.defaultValue 0.0
            })


    type DetectedFacesReply =
      { faces: Face list; metadata: StreamInfoMeta; timestamp: DateTime }

      static member Decoder: Decoder<DetectedFacesReply> =
        Decode.object (fun get -> {
          faces = get.Required.At ["faces"] (Decode.list Face.Decoder)
          metadata = get.Required.At ["metadata"] StreamInfoMeta.Decoder
          timestamp = get.Required.At ["timestamp"] Decode.datetime
        })

    type FrameData = { data: DetectedFacesReply }

    type InnerMessage =
      { message: string }

      static member Decoder: Decoder<InnerMessage> =
        Decode.object (fun get -> {
          message = get.Required.At ["message"] Decode.string
        })

    type StreamHealth =
      { message: InnerMessage; success: bool }

      static member Decoder: Decoder<StreamHealth> =
        Decode.object (fun get -> {
          message = get.Required.At ["message"] InnerMessage.Decoder
          success = get.Required.At ["success"] Decode.bool
        })


    (* Helper methods to converting from json string to Record type *)
    let to_stream_state (json:string) = Decode.fromString StreamState.Decoder json

    let to_stop_decode_reply (json: string) =
      Decode.fromString StopDecodeReply.Decoder json

    let to_start_decode_reply (json: string) =
      try
        Decode.fromString StartDecodeReply.Decoder json
      with
      | ex -> Error "could not parse json"

    let to_detected_faces_reply (json: string) =
      #if FABLE_COMPILER
        Error "not supported by fable"   //TODO: get rid of this dynamic ? value shit.
      #else
          //TODO: find a better solution, so we don't need compiler flags
          let jobj = json |> FSharp.Data.JsonValue.Parse
          let jobj = jobj.[1]?data //Todo: this could be problematic if it fails
          Decode.fromString DetectedFacesReply.Decoder (jobj.ToString())
      #endif

    let to_stream_health (json: string) =
      Decode.fromString StreamHealth.Decoder json

module Identification =

    type FaceImage = | B64Encoding of string | Binary of byte array | File of string
    type IdentRequest = {
        Image: FaceImage
        Confidence: float option
        Groups: int array option
    }

    type AddFaceReq =
        {
        id: string
        image: FaceImage
        confidence: float option
        }

    type DeleteFaceReq = {
        id : string
        face_id: int
    }

    type GetIdentityReq = {
        id: string
    }

    ///Types built from json objects returned from paravision api.
    ///It's nice to use real types
    type FaceID =
      { created_at: DateTime; id: int }
      static member to_str (face_id: FaceID) = Encode.Auto.toString(2, face_id)
      static member from (json: string) = Decode.fromString FaceID.Decoder json

      static member Decoder: Decoder<FaceID> =
        Decode.object (fun get -> {
          created_at = get.Required.At ["created_at"] Decode.datetime
          id = get.Required.At ["id"] Decode.int //guid
        })

    type Identity=
      { created_at: DateTime; id: string; faces: FaceID list; group_ids: int array option; updated_at: DateTime }

      static member Decoder: Decoder<Identity> =
        Decode.object (fun get -> {
         created_at = get.Required.At ["created_at"] Decode.datetime
         id = get.Required.At ["id"] Decode.string
         faces = get.Optional.At ["faces"] (Decode.list FaceID.Decoder) |> Option.defaultValue List.Empty
         group_ids = get.Optional.At ["group_ids"] (Decode.array Decode.int)
         updated_at = get.Required.At ["updated_at"] Decode.datetime
        })

      static member to_str (ident: Identity) = Encode.Auto.toString(2, ident)
      static member from (json: string) = Decode.fromString Identity.Decoder json
      static member from_many (json: string) = Decode.fromString (Decode.list Identity.Decoder) json


    let to_identities json = Decode.fromString (Decode.list Identity.Decoder) json
    let to_identity json = Decode.fromString Identity.Decoder json

    let from_identity (indent: int) (id: Identity) = Encode.Auto.toString(indent, id)

    type BBox =
      { height: int; width: int; x: int; y: int }
      static member Decoder: Decoder<BBox> =
        Decode.object (fun get -> {
          height = get.Required.At ["height"] Decode.int
          width = get.Required.At ["width"] Decode.int
          x = get.Required.At ["x"] Decode.int
          y = get.Required.At ["y"] Decode.int
        })
    type IdentityItem =
      { id: string
        bounding_box: BBox
        created_at: DateTime
        updated_at: DateTime
        confidence: float;
        //quality: float; acceptable: bool; acceptability: float
      }
      static member Decoder: Decoder<IdentityItem> =
        Decode.object (fun get -> {
          id = get.Required.At ["id"] Decode.string
          created_at = get.Required.At ["created_at"] Decode.datetime
          updated_at = get.Required.At ["updated_at"] Decode.datetime
          confidence = get.Required.At ["confidence"] Decode.float
        //TODO: find out why there's a discrependcy in the PV docs that list the following
        //attributes as being returned from an Ident match.
          bounding_box = get.Optional.At ["bounding_box"] BBox.Decoder |> Option.defaultValue {height=0;width=0;x=0;y=0}
         // quality = get.Required.At ["quality"] Decode.float
         // acceptable = get.Required.At ["acceptable"] Decode.bool
         // acceptability = get.Required.At ["acceptability"] Decode.float

        })

    ///type representing what is returned from Paravision.
    ///We call this a possible match because we receive results based on confidence level
    ///which indicates the likelyhood that the matched person IS that person. Nothing is ever 100%
    type PossibleMatch =
      {
      face_count: int
      identities: IdentityItem list
      }
      static member Decoder: Decoder<PossibleMatch> =
        Decode.object(fun get -> {
          face_count = get.Required.At ["face_count"] Decode.int
          identities = get.Required.At ["identities"] (Decode.list IdentityItem.Decoder)

        })


      static member to_str (pm: PossibleMatch) = Encode.Auto.toString(2, pm)
      static member from json = Decode.fromString PossibleMatch.Decoder json

