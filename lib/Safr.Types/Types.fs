namespace Safr.Types
open System
#if FABLE_COMPILER
open Thoth.Json
#else
open Thoth.Json.Net
open FSharp.Data
open FSharp.Data.JsonExtensions
#endif

module Eyemetric =

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

module TPass =

    type CompID =  string
    type IDOrName = string  //a code or a name fragment for TPAss to use as a look up.
    //type SearchType = | Student | All
    type PVID =  string //TODO: should really be a proper GUID
    type CCode = CCode of string //perhaps an int
    type SearchType = string
    type SearchReq = (IDOrName * SearchType * CompID)
    type Credential = | UserPass of (string * string)
    type AuthToken = string

    type JWToken =
        {
            name: string
            role: string
            ccode: string
            exp: bigint
            iss: string
            aud: string
        }
         static member Decoder: Decoder<JWToken> =
            Decode.object (fun get -> {
                name  = get.Required.At ["Name"]  Decode.string
                role  = get.Required.At ["Role"]  Decode.string
                ccode = get.Required.At ["CCode"] Decode.string
                exp   = get.Required.At ["exp"]   Decode.bigint
                iss   = get.Required.At ["iss"]   Decode.string
                aud   = get.Required.At ["aud"]   Decode.string

        })

        static member parse (json:string) = Decode.fromString JWToken.Decoder json

    type TokenResponse =
        { token: string }
        static member Decoder: Decoder<TokenResponse> =
            Decode.object (fun get -> {
                token = get.Required.At ["token"] Decode.string
            })

        static member parse (json:string) =
            Decode.fromString TokenResponse.Decoder json

    type SearchKind = Student | All
    type SearchTerm = SearchTerm of string

    type EmployeeOrUser =
            {
                ccode: int
                compId: int
                clntTid: int
                sttsId: int
                idnumber: string
                lName: string
                fName: string
                mName: string
                name: string
                typ: string
                status: string
                address: string
                street1: string
                street2: string
                city: string
                zipcode: string
                cntryIso: string
                state: string
                company: string
                imgUrl: string
                imageFile: string
                amPkId: int
                aptmnId: int

            }
            static member Decoder: Decoder<EmployeeOrUser> =
              Decode.object (fun get -> {
                  ccode      = get.Required.At ["ccode"]       Decode.int
                  compId     = get.Optional.At ["compId"]      Decode.int     |> Option.defaultValue -1
                  clntTid    = get.Optional.At ["clntTid"]     Decode.int     |> Option.defaultValue -1
                  sttsId     = get.Optional.At [ "sttsId" ]    Decode.int     |> Option.defaultValue -1
                  idnumber   = get.Optional.At [ "idnumber" ]  Decode.string  |> Option.defaultValue ""
                  lName      = get.Optional.At [ "lName" ]     Decode.string  |> Option.defaultValue ""
                  fName      = get.Optional.At [ "fName" ]     Decode.string  |> Option.defaultValue ""
                  mName      = get.Optional.At [ "mName" ]     Decode.string  |> Option.defaultValue ""
                  name       = get.Required.At [ "name" ]      Decode.string
                  typ        = get.Required.At [ "type" ]      Decode.string
                  status     = get.Optional.At [ "status" ]    Decode.string  |> Option.defaultValue ""
                  address    = get.Optional.At [ "address" ]   Decode.string  |> Option.defaultValue ""
                  street1    = get.Optional.At [ "street1" ]   Decode.string  |> Option.defaultValue ""
                  street2    = get.Optional.At [ "street2" ]   Decode.string  |> Option.defaultValue ""
                  city       = get.Optional.At [ "city" ]      Decode.string  |> Option.defaultValue ""
                  zipcode    = get.Optional.At [ "zipcode" ]   Decode.string  |> Option.defaultValue ""
                  cntryIso   = get.Optional.At [ "cntryIso" ]  Decode.string  |> Option.defaultValue ""
                  state      = get.Optional.At [ "state" ]     Decode.string  |> Option.defaultValue ""
                  company    = get.Optional.At [ "company" ]   Decode.string  |> Option.defaultValue ""
                  imgUrl     = get.Optional.At [ "imgUrl" ]    Decode.string  |> Option.defaultValue ""
                  imageFile  = get.Optional.At [ "imageFile" ] Decode.string  |> Option.defaultValue ""
                  amPkId     = get.Optional.At [ "amPkId" ]    Decode.int     |> Option.defaultValue -1
                  aptmnId    = get.Optional.At [ "aptmnId" ]   Decode.int     |> Option.defaultValue -1

              })


            static member from (json: string) =
              Decode.fromString EmployeeOrUser.Decoder json



    type Visitor =
        {
            ccode: int
            clntTid: int
            sttsId: int
            lName: string
            fName: string
            name: string
            typ: string
            status: string
            address: string
            cntryIso: string
            state: string
            imgUrl: string
            imageFile: string
            amPkId: int
            aptmnId: int
        }
        static member Decoder: Decoder<Visitor> =
          Decode.object (fun get -> {
              ccode     = get.Required.At ["ccode"]       Decode.int
              clntTid   = get.Required.At ["clntTid"]     Decode.int
              sttsId    = get.Required.At [ "sttsId" ]    Decode.int
              lName     = get.Required.At [ "lName" ]     Decode.string
              fName     = get.Required.At [ "fName" ]     Decode.string
              name      = get.Required.At [ "name" ]      Decode.string
              typ       = get.Required.At [ "type" ]      Decode.string
              status    = get.Required.At [ "status" ]    Decode.string
              address   = get.Optional.At [ "address" ]   Decode.string |> Option.defaultValue ""
              cntryIso  = get.Optional.At [ "cntryIso" ]  Decode.string |> Option.defaultValue ""
              state     = get.Optional.At [ "state" ]     Decode.string |> Option.defaultValue ""
              imgUrl    = get.Optional.At [ "imgUrl" ]    Decode.string |> Option.defaultValue ""
              imageFile = get.Optional.At [ "imageFile" ] Decode.string |> Option.defaultValue ""
              amPkId    = get.Optional.At [ "amPkId" ]    Decode.int    |> Option.defaultValue -1
              aptmnId   = get.Optional.At [ "aptmnId" ]   Decode.int    |> Option.defaultValue -1

              })

    type Student =
      {
          compId      :int
          sndCompId   :int
          ccode       :int
          clntTid     :int
          sttsId      :int
          actId       :int
          idnumber    :string
          proxCardId  :string
          lName       :string
          fName       :string
          mName       :string
          name        :string
          bdate       :DateTime
          typ         :string
          status      :string
          remarks     :string
          canUseKiosk :bool
          address     :string
          street1     :string
          city        :string
          zipcode     :string
          cntryIso    :string
          state       :string
          company     :string
          imgUrl      :string
          imageFile   :string
          grade       :string
          healthFlag  :bool
          amPkId      :int
          aptmnId     :int
      }
      static member Decoder: Decoder<Student> =
           Decode.object ( fun get -> {
             compId      = get.Optional.At [ "compId" ]        Decode.int        |> Option.defaultValue -1
             sndCompId   = get.Optional.At [ "sndCompId" ]     Decode.int        |> Option.defaultValue -1
             ccode       = get.Required.At [ "ccode" ]         Decode.int
             clntTid     = get.Required.At [ "clntTid" ]       Decode.int
             sttsId      = get.Required.At [ "sttsId" ]        Decode.int
             actId       = get.Optional.At [ "actId" ]         Decode.int        |> Option.defaultValue -1
             idnumber    = get.Optional.At [ "idnumber" ]      Decode.string     |> Option.defaultValue ""
             proxCardId  = get.Optional.At [ "proxCardId" ]    Decode.string     |> Option.defaultValue ""
             lName       = get.Required.At [ "lName" ]         Decode.string
             fName       = get.Required.At [ "fName" ]         Decode.string
             mName       = get.Optional.At [ "mName" ]         Decode.string     |> Option.defaultValue ""
             name        = get.Required.At [ "name" ]          Decode.string
             bdate       = get.Optional.At ["bdate"]           Decode.datetime   |> Option.defaultValue DateTime.Now
             typ         = get.Required.At [ "type" ]          Decode.string
             status      = get.Optional.At [ "status" ]        Decode.string     |> Option.defaultValue ""
             remarks     = get.Optional.At [ "remarks" ]       Decode.string     |> Option.defaultValue ""
             canUseKiosk = get.Optional.At [ "canUseKiosk" ]   Decode.bool       |> Option.defaultValue false
             address     = get.Optional.At [ "address" ]       Decode.string     |> Option.defaultValue ""
             street1     = get.Optional.At [ "street1" ]       Decode.string     |> Option.defaultValue ""
             city        = get.Optional.At [ "city" ]          Decode.string     |> Option.defaultValue ""
             zipcode     = get.Optional.At [ "zipcode" ]       Decode.string     |> Option.defaultValue ""
             cntryIso    = get.Optional.At [ "cntryIso" ]      Decode.string     |> Option.defaultValue ""
             state       = get.Optional.At [ "state" ]         Decode.string     |> Option.defaultValue ""
             company     = get.Optional.At [ "company" ]       Decode.string     |> Option.defaultValue ""
             imgUrl      = get.Optional.At [ "imgUrl" ]        Decode.string     |> Option.defaultValue ""
             imageFile   = get.Optional.At [ "imageFile" ]     Decode.string     |> Option.defaultValue ""
             grade       = get.Optional.At [ "grade" ]         Decode.string     |> Option.defaultValue ""
             healthFlag  = get.Optional.At [ "healthFlag" ]    Decode.bool       |> Option.defaultValue false
             amPkId      = get.Optional.At [ "amPkId" ]        Decode.int        |> Option.defaultValue -1
             aptmnId     = get.Optional.At [ "aptmnId" ]       Decode.int        |> Option.defaultValue -1

           })
      static member from (json: string) = Decode.fromString Student.Decoder json

    let to_student_reply (json: string) = Decode.fromString Student.Decoder json

    let to_visitor_reply (json: string) = Decode.fromString Visitor.Decoder json

    let to_employee_or_user_reply (json: string) = Decode.fromString EmployeeOrUser.Decoder json

    type TPassClient =
        | Student of Student
        | Visitor of Visitor
        | EmployeeOrUser of EmployeeOrUser

        static member to_str (tc: TPassClient) =
            match tc with
            | Student s -> Encode.Auto.toString(4, s)
            | Visitor v -> Encode.Auto.toString(4, v)
            | EmployeeOrUser emp -> Encode.Auto.toString(4, emp)
            | _ -> ""

        static member image_url (tc: TPassClient) =
            match tc with
            | Student s -> s.imgUrl
            | Visitor v -> v.imgUrl
            | EmployeeOrUser emp -> emp.imgUrl


        static member status (tc: TPassClient) =
            match tc with
            | Student s -> s.status
            | Visitor v -> v.status
            | EmployeeOrUser emp -> emp.status

        static member ccode (tc: TPassClient) =
            match tc with
            | Student s -> s.ccode
            | Visitor v -> v.ccode
            | EmployeeOrUser emp -> emp.ccode

    type CheckInRecord =
       {
         pkid: int
         ccode: bigint
         compId: int
         flag: string
         date: DateTime
         timeIn: DateTime
       }
       static member create(pkid: int, ccode: bigint, compId: int, flag: string, date: DateTime, timeIn: DateTime) =
           { pkid=pkid; ccode=ccode; compId=compId; flag=flag; date=date; timeIn=timeIn }
       static member Decoder: Decoder<CheckInRecord> =
         Decode.object ( fun get -> {
           pkid   = get.Required.At ["pkid"]   Decode.int
           ccode  = get.Required.At ["ccode"]  Decode.bigint
           compId = get.Required.At ["compId"] Decode.int
           flag   = get.Required.At ["flag"]   Decode.string
           date   = get.Required.At ["date"]   Decode.datetime
           timeIn = get.Required.At ["timeIn"] Decode.datetime
         })

       static member from (json: string) =
          Decode.fromString CheckInRecord.Decoder json

       static member to_str (ch_rec: CheckInRecord) =
         let enc =  Encode.object [
              "pkid",   Encode.int  ch_rec.pkid
              "compId", Encode.int ch_rec.compId
              "ccode",  Encode.bigint ch_rec.ccode
              "flag",   Encode.string ch_rec.flag
              "date",   Encode.datetime ch_rec.date
              "timeIn", Encode.datetime ch_rec.timeIn
         ]
         enc.ToString()


    //currently exactly the same as CheckInRecord
    type CheckOutRecord =
       {
         pkid: int
         ccode: bigint
         compId: int
         flag: string
         date: DateTime
         timeOut: DateTime
       }
       static member create(pkid: int, ccode: bigint, compId: int, flag: string, date: DateTime, timeOut: DateTime) =
           { pkid=pkid; ccode=ccode; compId=compId; flag=flag; date=date; timeOut=timeOut }
       static member Decoder: Decoder<CheckOutRecord> =
         Decode.object ( fun get -> {
            pkid    = get.Required.At ["pkid"]    Decode.int
            ccode   = get.Required.At ["ccode"]   Decode.bigint
            compId  = get.Required.At ["compId"]  Decode.int
            flag    = get.Required.At ["flag"]    Decode.string
            date    = get.Required.At ["date"]    Decode.datetime
            timeOut = get.Required.At ["timeOut"] Decode.datetime
         })

       static member from (json: string) = Decode.fromString CheckOutRecord.Decoder json

       static member to_str (ch_rec: CheckOutRecord) =
         let enc = Encode.object [
             "pkid",    Encode.int      ch_rec.pkid
             "compId",  Encode.int      ch_rec.compId
             "ccode",   Encode.bigint   ch_rec.ccode
             "flag",    Encode.string   ch_rec.flag
             "date",    Encode.datetime ch_rec.date
             "timeOut", Encode.datetime ch_rec.timeOut
         ]
         enc.ToString()

    type TPassResult<'a> =
       | Success  of 'a
       | DownloadError of Exception  //TODO: Make more specific exception. Expect Http related exceptions
       | ConnectionError of Exception //TODO: Make more specific exception
       | InvalidTokenError
       | NotCheckedInError
       | PVNotRegisteredError of string
       | ClientNotFound of string
   //    | AuthTokenError of string
       | JSonParseError //sometimes we get junk json or no json...
       | TPassError of Exception //a generic TPass error. kind of a place holder atm.


module Paravision =

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
          })
        static member from (json: string) = Decode.fromString CameraStream.Decoder json

    //TODO: consideration for a later feature where we use more than one server/service to process face data
    type CameraGroup = {

        name:     string
        address:  string //machine address that handles the decoding of a set of camera streams.
        streams:  CameraStream  list

    }

    //MessageTypes representing json structures returned from Paravision api.
    type StartDecodeReply =
        { message: string; name: string; source: string; success: bool }

        static member Decoder : Decoder<StartDecodeReply> =
          Decode.object (fun get -> {
            message = get.Optional.At ["message"] Decode.string |> Option.defaultValue "no message"
            name    = get.Optional.At ["name"]    Decode.string |> Option.defaultValue "no name"
            source  = get.Optional.At ["source"]  Decode.string |> Option.defaultValue "no source"
            success = get.Optional.At ["success"] Decode.bool   |> Option.defaultValue false
          })

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
          //detect_mask
          enable_tracking: bool
          skip_identical_frames: bool;
          latest_activity: DateTime   //TODO: are we sure this belongs here?
          metadata: StreamInfoMeta
        }

        static member Decoder : Decoder<StreamInfo> =
            Decode.object (fun get -> {
                detect_frame_rate = get.Required.At [ "detect_frame_rate" ] Decode.int
                enable_tracking = get.Required.At [ "enable_tracking"  ] Decode.bool
                expanded_image_scale = get.Required.At [ "expanded_image_scale" ] Decode.float
                latest_activity = get.Required.At ["latest_activity"] Decode.datetime
                metadata = get.Required.At ["metadata"] StreamInfoMeta.Decoder
                name = get.Required.At [ "name" ] Decode.string
                rotation = get.Required.At [ "rotation" ] Decode.int ;
                skip_identical_frames = get.Required.At [ "skip_identical_frames" ] Decode.bool;
                source = get.Required.At ["source"] Decode.string
                tracking_duration = get.Required.At ["tracking_duration"] Decode.int
            })

    type StreamState =
        { message:string; streams: StreamInfo list }

        static member Decoder: Decoder<StreamState> =
            Decode.object ( fun get -> {
               message = get.Required.At ["message"] Decode.string
               streams = get.Required.At ["streams"] (Decode.list StreamInfo.Decoder)

            })


    type Coord =
      { x: float; y: float }

      static member Decoder: Decoder<Coord> =
        Decode.object (fun get -> {
          x = get.Required.At ["x"] Decode.float
          y = get.Required.At ["y"] Decode.float
        })
    (*
    type Coord =
      { x: int; y: int }

      static member Decoder: Decoder<Coord> =
        Decode.object (fun get -> {
          x = get.Required.At ["x"] Decode.int
          y = get.Required.At ["y"] Decode.int
        })
*)
    type BoundingBox =
      { top_left: Coord; bottom_right: Coord }

      static member Decoder: Decoder<BoundingBox> =
        Decode.object (fun get -> {
          top_left = get.Required.At ["top_left"]  Coord.Decoder
          bottom_right = get.Required.At ["bottom_right"] Coord.Decoder
        })


    type Landmarks =
      { left_eye: Coord; right_eye: Coord; nose: Coord; left_mouth: Coord; right_mouth: Coord; }

      static member Decoder: Decoder<Landmarks> =
        Decode.object (fun get -> {
          left_eye = get.Required.At ["left_eye"] Coord.Decoder
          right_eye = get.Required.At ["right_eye"] Coord.Decoder
          nose = get.Required.At ["nose"] Coord.Decoder
          left_mouth = get.Required.At ["left_mouth"] Coord.Decoder
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

    type FrameData =
        {
            data: DetectedFacesReply
        }
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
    let to_stream_state (json:string) =
      Decode.fromString StreamState.Decoder json

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
           // bounding_box: BBox
            created_at: DateTime; updated_at: DateTime
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
            //  bounding_box = get.Required.At ["bounding_box"] BBox.Decoder
             // quality = get.Required.At ["quality"] Decode.float
             // acceptable = get.Required.At ["acceptable"] Decode.bool
             // acceptability = get.Required.At ["acceptability"] Decode.float

            })

        //type representing what is returned from Paravision.
        //We call this a possible identity because we receive results based on confidence level
        //which indicates the likelyhood that the matched person IS that person. Nothing is ever 100%
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
        let to_possible_identity (json: string) =
          Decode.fromString PossibleMatch.Decoder json




