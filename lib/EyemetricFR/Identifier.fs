namespace EyemetricFR

open EyemetricFR.Paravision.Types.Identification
open HTTPApi
open HTTPApi.Paravision

module Identifier =

    let private to_bytes str = str |> System.Convert.FromBase64String

    type FaceIdentification(url: string) =
        let client = create_client None

        //NOTE: Partial function application. pass in just some arguments and ret new func, less those args.
        //For the functional newbie, we can "partially apply" functions.. in other words call a function
        //with less arguments than it requires and a new function is returned that we can call later by
        //passing in the remaining argument(s).
        let make_url = url |> create_url
        let get_identity' = (client, make_url) ||> get_identity
        let get_identities' = (client, make_url) ||> get_identities
        let create_identity' = (client, make_url) ||> create_identity
        let delete_identity' = (client, make_url) ||> delete_identity
        let detect_identity' = (client, make_url) ||> detect_identity

        //map APIResult to standard Result type Ok | Error
        let map_api_res  (res: HttpApiResult<string>) =
            match res with
            | HttpApiResult.Success s -> Ok s
            | HttpApiResult.TimedOutError t -> Error t
            | HttpApiResult.UnhandledError e -> Error e.Message
            | HttpApiResult.HTTPResponseError e -> Error e

        let handle_identity_return (res: HttpApiResult<string>) =
            match (res |> map_api_res) with
           // | Ok s -> s |> to_identity
            | Ok s -> Identity.from s
            | Error e -> Error e

        let handle_identities_return (res: HttpApiResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> to_identities
            | Error e -> Error e

        let handle_possible_match_result (res: HttpApiResult<string>) =
            match (res |> map_api_res) with
            | Ok json_str -> PossibleMatch.from json_str
            //| Ok s -> s |> to_possible_identity
            | Error e -> Error e

        let handle_face_result (res: HttpApiResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> FaceID.from
            | Error e -> Error e


        let face_identified_event = Event<Result<PossibleMatch, string>> ()

        member self.get_identity (req: GetIdentityReq) = async {
            let! ident_res = req |> get_identity'
            let id_res = handle_identity_return ident_res
            return id_res
        }

        member self.get_identities() = async {
            let! x =  get_identities'
            let id_res = handle_identities_return x
            return id_res
        }

        member self.create_identity (face: FaceImage) = async {

            let! id_res =
                match face with
                | Binary bin -> bin |> create_identity'
                | B64Encoding str -> str |> to_bytes |> create_identity'
                | _ -> failwith "currently unsupported FaceImageFormat"

            printfn "In CREATE_IDENTITY MSG: created ident %A" id_res
            let ident = id_res |> handle_identity_return
            return ident
        }

        member self.delete_identity (id: string)  = async {
            let! res = id |> delete_identity'
            let ident = res |> handle_identity_return
            printfn "deleted id: %A" id
            return ident
        }

        member self.add_face (req: AddFaceReq) = async {

            let! res = add_face_to_identity client make_url req
            let face_res = res |> handle_face_result
            return face_res
        }
        member self.delete_face (req: DeleteFaceReq) = async {

            let! res = delete_face_from_identity client make_url req
            let face_res = res |> handle_face_result
            return face_res
        }

        member self.detect_identity (face: FaceImage) = async {

            printfn "IDENT AGENT: IN MSG: DetectIdentity"
            let! res  = face |> detect_identity'
            let poss_ident = res |> handle_possible_match_result
            poss_ident |> face_identified_event.Trigger
            return poss_ident
        }
