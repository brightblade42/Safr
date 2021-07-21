namespace EyemetricFR

open EyemetricFR.Paravision.Types.Identification
open HTTPApi
open HTTPApi.Paravision

module Identifier =

    let private to_bytes str = System.Convert.FromBase64String str

    type FaceIdentification(url: string) =
        let client = create_client None

        let make_url = create_url url
        let to_result  (res: HttpResult<string>) =
            match res with
            | HttpResult.Success s           -> Ok s
            | HttpResult.TimedOutError t     -> Error t
            | HttpResult.UnhandledError e    -> Error e.Message
            | HttpResult.HTTPResponseError e -> Error e
            | _ -> failwith "unhandled HttpApiResult"

        let to_identity (res: HttpResult<string>) =
            match (to_result res) with
            | Ok s -> Identity.from s
            | Error e -> Error e

        let to_identities (res: HttpResult<string>) =
            match (to_result res) with
            | Ok s -> Identity.from_many s
            | Error e -> Error e

        let to_possible_match (res: HttpResult<string>) =
            match (to_result res) with
            | Ok json_str -> PossibleMatch.from json_str
            | Error e -> Error e

        let to_face_id (res: HttpResult<string>) =
            match (to_result res) with
            | Ok x -> FaceID.from x
            | Error e -> Error e


        let face_identified_event = Event<Result<PossibleMatch, string>> ()

        member self.get_identity (req: GetIdentityReq) = async {
            let! res = get_identity client make_url req
            return to_identity res
        }

        member self.get_identities() = async {
            let! idents = get_identities client make_url
            return to_identities idents
        }

        member self.create_identity (face: FaceImage) = async {

            let! res =
                match face with
                | Binary bin ->  create_identity client make_url bin
                | B64Encoding str -> str |> to_bytes |> create_identity client make_url
                | _ -> failwith "currently unsupported FaceImageFormat"

            printfn $"In CREATE_IDENTITY MSG: created ident %A{res}"
            return  to_identity res
        }

        member self.delete_identity (id: string)  = async {
            let! res = delete_identity client make_url id
            printfn $"deleted id: %A{id}"
            return to_identity res
        }

        member self.add_face (req: AddFaceReq) = async {
            let! res = add_face_to_identity client make_url req
            let face_res = to_face_id res
            return face_res
        }
        member self.delete_face (req: DeleteFaceReq) = async {

            let! res = delete_face_from_identity client make_url req
            let face_res = to_face_id res
            return face_res
        }

        member self.detect_identity (face: FaceImage) = async {
            printfn "IDENTIFIER: identifying face"
            let! res  = detect_identity client make_url face
            let poss_ident = to_possible_match res
            face_identified_event.Trigger poss_ident
            return poss_ident
        }
