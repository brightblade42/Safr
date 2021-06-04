namespace Paravision
open System.Data
open System.Threading
open API
open API.Identification
open Safr.Types.Paravision.Identification
module Identification =

    type private Agent<'T> = MailboxProcessor<'T>

    type private AgentMsg =
        | CreateIdentity of (FaceImage * AsyncReplyChannel<Result<Identity, string>>) //should success ret be a string?
        | GetIdentities of AsyncReplyChannel<Result<Identity list,string>>
        | GetIdentity of (GetIdentityReq * AsyncReplyChannel<Result<Identity, string>>)
        | DeleteIdentity of (string * AsyncReplyChannel<Result<Identity, string>>)
        | DetectIdentity of (FaceImage * AsyncReplyChannel<Result<PossibleMatch, string>>)
        | DetectIdentityP of (FaceImage) //fire and forget version. P suffix for "Post". not ideal, naming shit amirite?!
        //TODO: implement face level api
        | GetFaces of (string * AsyncReplyChannel<Result<FaceID list, string>>)
        | AddFace of (AddFaceReq * AsyncReplyChannel<Result<FaceID, string>>)
        | DeleteFace of (DeleteFaceReq * AsyncReplyChannel<Result<FaceID, string>>) //identity id and face id

    let private to_bytes str = str |> System.Convert.FromBase64String

    type IdentificationAgent(url: string, ?eventContext: SynchronizationContext) =
        let client = create_client None

        //NOTE: Partial function application. pass in just some arguments and ret new func.
        let make_url = url |> create_url
        let get_identity' = (client, make_url) ||> get_identity
        let get_identities' = (client, make_url) ||> get_identities
        let create_identity' = (client, make_url) ||> create_identity
        let delete_identity' = (client, make_url) ||> delete_identity
        let detect_identity' = (client, make_url) ||> detect_identity
        ///wraps an event to run in a synchronization context, if provided in constructor
        /// This is particularly useful when running from a GUI Thread
        let event_with_context (evt:Event<'T>) =
           fun state ->
                match eventContext with
                | None ->
                    evt.Trigger(state)
                | Some ctx ->
                    ctx.Post((fun _ -> evt.Trigger(state)), null)

        let map_api_res  (res: APIResult<string>) =
            match res with
            | APIResult.Success s -> Ok s
            | APIResult.TimedOutError t -> Error t
            | APIResult.UnhandledError e -> Error e.Message
            | APIResult.HTTPResponseError e -> Error e

        let handle_identity_return (res: APIResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> to_identity
            | Error e -> Error e

        let handle_identities_return (res: APIResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> to_identities
            | Error e -> Error e

        let handle_possible_match_result (res: APIResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> to_possible_identity
            | Error e -> Error e

        let handle_face_result (res: APIResult<string>) =
            match (res |> map_api_res) with
            | Ok s -> s |> FaceID.from
            | Error e -> Error e

        let face_identified_event = new Event<Result<PossibleMatch, string>> () //string opt is the expanded image, which we won't have here.
        let fire_face_identified = face_identified_event |> event_with_context //satisfy the thread gods
        let agent = Agent.Start(fun inbox ->
            let rec loop (state) =
                async {
                    let! msg = inbox.Receive()

                    match msg with
                    | GetIdentity (req, ch) ->
                        let! x = req |> get_identity'
                        let id_res = handle_identity_return x
                        ch.Reply(id_res)
                        return! loop []

                    | GetIdentities ch ->
                        let! x =  get_identities'
                        let id_res = handle_identities_return x
                        ch.Reply(id_res)
                        return! loop []

                    | CreateIdentity (face, ch) ->
                        //TODO: I think this was to accomodate a conf threshold for rejection. come back
                        //let id_req = { Image = face; Confidence = None; Groups = None}

                        let! id_res =
                            match face with
                            | Binary bin -> bin |> create_identity'
                            | B64Encoding str -> str |> to_bytes |> create_identity'
                            | _ -> failwith "currently unsupported FaceImageFormat"

                        printfn "In CREATE_IDENTITY MSG: created ident %A" id_res
                        let ident = id_res |> handle_identity_return
                        ch.Reply(ident)

                        return! loop []

                    | DeleteIdentity (id, ch) ->
                        let! res = id |> delete_identity'
                        let ident = res |> handle_identity_return
                        printfn "deleted id: %A" id
                        ch.Reply(ident)
                        return! loop []


                    | DetectIdentity (face, ch) ->
                        printfn "IDENT AGENT: IN MSG: DetectIdentity"
                        let! res  = face |> detect_identity'
                        let poss_ident = res |> handle_possible_match_result
                        //let poss_ident = res |> Result.bind (fun id -> id |> to_possible_identity)
                        poss_ident |> fire_face_identified
                        poss_ident |> ch.Reply
                        return! loop []

                    | DetectIdentityP (face) ->
                        let! res = face |> detect_identity'
                        let poss_ident = res |> handle_possible_match_result
                        //let poss_ident = res |> Result.bind (fun id -> id |> to_possible_identity)
                        poss_ident |> fire_face_identified
                        return! loop []

                    | GetFaces (id, ch) ->
                        //printfn "Notimplemented yet"
                       // let! res =  get_faces client make_url id
                        //let faces_res = res |> handle_faces_result
                        return! loop []

                    | AddFace (req, ch) ->
                        let! res = add_face_to_identity client make_url req
                        let face_res = res |> handle_face_result
                        face_res |> ch.Reply
                        return! loop []

                    | DeleteFace (req, ch) ->
                        let! res = delete_face_from_identity client make_url req
                        let face_res = res |> handle_face_result
                        face_res |> ch.Reply
                        return! loop []

                }

            loop [])

        member self.get_identity (req: GetIdentityReq) =
            agent.PostAndAsyncReply(fun rc -> GetIdentity (req, rc))

        member self.get_identities =
            agent.PostAndAsyncReply(GetIdentities)


        member self.create_identity (face: FaceImage) =
            agent.PostAndAsyncReply(fun rc -> CreateIdentity (face, rc))

        member self.delete_identity (id: string) =
            agent.PostAndAsyncReply(fun rc -> DeleteIdentity (id, rc ))

        member self.get_faces (id: string ) =
            agent.PostAndAsyncReply(fun rc -> GetFaces (id, rc))

        //member self.add_face (id: string) (face: FaceImage) =
        member self.add_face (req: AddFaceReq) =
            //agent.PostAndAsyncReply(fun rc-> AddFace ((id, face), rc))
            agent.PostAndAsyncReply(fun rc-> AddFace (req, rc))

        member self.delete_face (req: DeleteFaceReq) = //(id: string) (face_id: int) =
            agent.PostAndAsyncReply(fun rc -> DeleteFace (req, rc))

        member self.detect_identity (face: FaceImage) =
            agent.PostAndAsyncReply(fun rc -> DetectIdentity (face, rc))

        member self.fire_detect_identity (face: FaceImage) =
            agent.Post (DetectIdentityP face)