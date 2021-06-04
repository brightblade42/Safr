namespace Eyemetric.FR
open Safr.Types.TPass
open Safr.Types.Paravision.Identification

[<AutoOpen>]
module Types =


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


    type GeneralInfo = {
      last_name: string
      first_name: string
      file_path: string
    }

    type GeneralInfoWithImage = {
      info: GeneralInfo
      image: byte array option
    }
    type TPassClientWithImage = {
      client: TPassClient
      image: byte array option
    }
    type EnrolledIdentity = {
        id: string
        pv_img: byte []
    }

    //all the data we need to record a local enrollment
    type EnrollmentInfo = {
      identity: Identity //from paravison
      face: FaceImage
      tpass_client: TPassClient option
      general_info: string option //enrollment not necessarily generated from known tpass data.
    }


    type MatchedFace = {
      ID: string
      Name: string
      Cam: string
      Confidence: float
      TimeStamp: string
      Image: byte []
      Status: string
    }


