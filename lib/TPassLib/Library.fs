namespace TPass

open System
open Safr.Types.TPass
open TPass.API

module Client =


    //TODO: Service is not a great name for this module. Alas the naming struggle is real
    module Service =

       type private Agent<'T> = MailboxProcessor<'T>
       //exception TokenInvalidException of string
       type private TPassReplyChan<'T> = AsyncReplyChannel<TPassResult<'T>>
       type private AgentState = {

           version: string
           token_pair: TokenPair  option
           companies: string option

       }
       type private Msg =
           | GetToken of TPassReplyChan<bool>
           | GetVersion
           | SearchClient of (SearchReq list * TPassReplyChan<TPassClient []>)
           | GetClientImage of (Uri * TPassReplyChan<byte array>)
           | GetClient of (PVID * TPassReplyChan<TPassClient>)
           | GetClientByCCode of (CCode * TPassReplyChan<TPassClient>)
           | CheckInClient of (CheckInRecord * TPassReplyChan<string>)
           | CheckOutClient of (CheckOutRecord * TPassReplyChan<string>)
           | RegisterPV of ((string * string) * TPassReplyChan<string>)
           | UpdatePV of ((string * string) * TPassReplyChan<string>)
           | GetState of TPassReplyChan<AgentState>

       //TODO: Error Helper bits that maybe belong in a seperate Utils module or project.
       let error_evt = Event<string>()


       let private to_tpass_result_async (sr: Async<Result<string, string>>) = async {
           let! s = sr
           return
               match s with
               | Ok res -> Success res
               | Error e -> TPassError (Exception e) //is that what we really want?
       }


       type TPassAgent (url: string, cred: Credential, cert_check: bool) =
            let client =
                match cert_check with
                | true -> create_client None
                | false -> create_client (Some disable_cert_validation)

            let make_url = url |> create_url

            let try_search_client_single (state: AgentState) (req: SearchReq) = async {
                 return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            let (id, typ, comp_id) = req
                            search_client client tok make_url id typ comp_id
                        with
                        | e -> async { return Error e.Message }
                    | None -> async { return Error "Need a valid token to make TPass calls" }
            }

            let try_search_client (state: AgentState) (req: SearchReq list) = async {

               let search_fun (req: SearchReq list)=
                    req
                    |> List.map (try_search_client_single state)
                    |> List.map (to_tpass_result_async) //Convert each Result to a TPassResult
                    |> Async.Parallel

               let! search_results = (search_fun req)

               return search_results |> Search.parse_search_results
            }

            let try_checkin_client (state: AgentState) (ch_in: CheckInRecord) = async {

               return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            check_in_student client tok make_url ch_in
                        with
                        | e -> async { return Error e.Message }
                    | None -> async { return Error "Need a valid token to make TPass calls" }

            }
            let try_get_recent_checkin (state: AgentState) (ccode: bigint) (compid: int) (date: DateTime) = async {

                let cc = string ccode
                let comp = string compid

                return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            get_last_checkin_record client tok make_url cc comp date
                        with
                        | e -> async {return Error e.Message}
                    | None -> async { return Error "Need a valid token to make TPass calls" }

            }


            let try_checkout_client (state: AgentState) (ch_out: CheckOutRecord) = async {
               return!
                    match state.token_pair with
                    | Some tok ->
                       try
                            check_out_student client tok make_url ch_out
                       with
                       | e -> async { return Error e.Message }
                    | None -> async { return Error "Need a valid token to make TPass calls" }
            }

            let get_image (url: string) = async {
                    try
                        let! x = download_image client url
                        return Ok x
                    with
                    | e ->
                        return Error e.Message
            }

            //TODO: this is a little hackey, is there a better way then a string match?
            let to_tpass_client (json: string)  =
                if  json.ToLower().Contains("visitor") then

                     match (json |> to_visitor_reply) with
                     | Ok v -> v |> Visitor |> Some
                     | Error e ->
                         printfn "Parse Error: %s" e
                         None

                elif json.ToLower().Contains("student") then

                    match (json |> to_student_reply) with
                    | Ok s -> s |> Student  |> Some
                    | Error e ->
                        printfn "Parse Error: %s" e
                        None //failwith "could not parse"

                elif json.ToLower().Contains("employee") then

                    match (json |> to_employee_or_user_reply) with
                    | Ok emp -> emp |> EmployeeOrUser |> Some
                    | Error e ->
                        printfn "Parse Error: %s" e
                        None //failwith "could not parse"
                else  None

            let try_get_pv_client (state: AgentState) (id: PVID) = async {
                return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            get_client_by_pv_id client tok make_url id
                        with
                        | e -> async { return Error e.Message }
                    | None ->  async { return Error "Need a valid token to make TPass calls." }
            }

            let try_get_client_by_ccode (state: AgentState) (ccode: CCode) = async {
                return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            let (CCode code) = ccode //get the string thang
                            get_client_by_ccode client tok make_url code
                        with
                        | e -> async {return Error e.Message}
                    | None -> async { return Error "Need a valid token to make TPass calls." }
            }


            let try_register_pv_id (state: AgentState) (ccode: string) (pv_id: string) = async {
                return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            register_pv_id client tok make_url ccode pv_id
                        with
                        | e -> async { return Error e.Message }
                    | None -> async { return Error "Need a valid token to make TPass calls." }

            }

            let try_update_pv_id (state: AgentState) (ccode: string) (pv_id: string) = async {
                return!
                    match state.token_pair with
                    | Some tok ->
                        try
                            update_pv_id client tok make_url ccode pv_id
                        with
                        | e -> async { return Error e.Message }
                    | None -> async { return Error "Need a valid token to make TPass calls" }
            }

            let get_img_url (c: TPassClient option) =
               ("", c) ||> Option.fold(fun _ c ->
                match c with
                | Visitor vr ->  vr.imgUrl
                | Student sr -> sr.imgUrl
                | EmployeeOrUser emp -> emp.imgUrl)

            let client_img = get_img_url >> get_image

            let p_log (item: 'T) (label: string) =
                printfn "======================================="
                printfn "============||  %s  || ===============" label
                printfn "%A" item
                printfn "======================================="

            let agent = Agent.Start(fun inbox ->
               let rec loop (state: AgentState) =
                   async {
                       let! msg = inbox.Receive()
                       match msg with
                       | GetToken ch ->
                            try
                                printfn "==== Retrieving auth token ==== "
                                let! tok =  API.get_token client cred make_url
                                //let! tok_choice = (state |> try_get_token)
                                ch.Reply(Success true) //does it make sense to return the token? it's already internal state.
                                return! { state with token_pair = Some tok } |> loop
                            with
                            | e ->
                                printfn "==== unable to get token ==== %s" e.Message
                                ch.Reply(TPassError e)
                                e.Message |> error_evt.Trigger
                                return! state |> loop

                       | GetVersion ->
                           //This isn't really useful as far as I can tell. It's part of TPASS API
                           let! version_res = API.get_version client make_url
                           match version_res with
                           | Ok ver -> return! { state with version = ver } |> loop
                           | Error e -> return! state |> loop


                       | SearchClient (req, ch ) ->

                           //TODO: look at whether this needs an Async.Catch. I believe all the
                           //Errors are handled forl search request in the parallel loop.
                           let! search_results = (state, req) ||> try_search_client |> Async.Catch

                           match search_results with
                           | Choice1Of2 search -> ch.Reply(Success search)
                           | Choice2Of2 exn -> ch.Reply(TPassError exn)

                           return! state |> loop //think about keeping these puppies alive?


                       | GetClientByCCode (ccode, ch) ->
                           let! client_res = (state, ccode) ||> try_get_client_by_ccode
                           let (CCode code) = ccode

                           match client_res with
                           | Ok c when c = "" ->
                               ch.Reply(ClientNotFound code)
                           | Ok c ->
                               let tp_client = c |> to_tpass_client
                               match tp_client with
                               | Some client ->
                                   ch.Reply((Success client))
                               | None ->
                                   ch.Reply(ClientNotFound code)
                           | Error e -> ch.Reply(TPassError (Exception e))

                           return! state |> loop


                       | GetClient (pv_id, ch) ->

                           let! client_res = (state, pv_id) ||> try_get_pv_client

                           match client_res with
                           | Ok c when c = "" ->
                               ch.Reply(PVNotRegisteredError pv_id)
                           | Ok c ->
                               let tp_client = c |> to_tpass_client
                               ch.Reply(Success tp_client.Value)

                           | Error e -> ch.Reply(TPassError (Exception e))

                           return! state |> loop

                       | GetClientImage (uri , ch) ->

                           let! image_res =  uri.ToString() |> get_image
                           match image_res with
                           | Ok bytes -> ch.Reply(Success bytes)
                           | Error e -> ch.Reply(TPassError (Exception e))

                           return! state |> loop //think about keeping these puppies alive?
                       | CheckInClient (ch_rec, ch) ->

                           let! res = (state, ch_rec) ||> try_checkin_client
                           (res, "try_checkin_client") ||> p_log
                           match res with
                           | Ok r -> ch.Reply (Success r)
                           | Error e -> ch.Reply(TPassError (Exception e))

                           return! state |> loop

                       | CheckOutClient (ch_rec, ch) ->

                           let! recent_rec = (try_get_recent_checkin state ch_rec.ccode ch_rec.compId ch_rec.date)
                           (recent_rec, "recent_checkin") ||> p_log

                           match recent_rec with
                           | Ok recent when recent = "" -> ch.Reply(NotCheckedInError)
                           | Ok recent ->
                               match (CheckInRecord.from recent) with
                               | Ok r ->
                                   let ch_rec = {ch_rec with pkid = r.pkid}
                                   let! checkout_res = (state, ch_rec) ||> try_checkout_client
                                   (checkout_res, "try_checkout_client") ||> p_log
                                   match checkout_res with
                                   | Ok res -> ch.Reply(Success res)
                                   | Error e -> ch.Reply(TPassError (Exception e))

                               | Error e -> ch.Reply(TPassError (Exception e))
                           | Error e -> ch.Reply(TPassError (Exception e))

                           return! state |> loop

                       | RegisterPV (data, ch) ->

                           let (ccode, pv_id) = data
                           let! reg_res = (state, ccode, pv_id) |||> try_register_pv_id

                           let res =
                               match reg_res with
                               | Ok reg ->
                                   (reg, "try_register_pv_id") ||> p_log
                                   Success reg
                               | Error e -> TPassError (Exception e)

                           ch.Reply(res)
                           return! state |> loop

                       | UpdatePV (data, ch) ->

                           let (ccode, pv_id) = data
                           let! reg_res = (state, ccode, pv_id) |||> try_update_pv_id

                           let res =
                               match reg_res with
                               | Ok reg ->
                                   (reg, "try_update_pv_id") ||> p_log
                                   Success reg
                               | Error e -> TPassError (Exception e)

                           ch.Reply(res)
                           return! state |> loop


                       | GetState ch ->
                           ch.Reply (Success state)
                           return! state |> loop


                   }
               loop  { version = ""; token_pair = None; companies = None })

            member self.initialize () =
               agent.PostAndAsyncReply(GetToken)
            member self.get_pv_client (id: PVID) =
                agent.PostAndAsyncReply(fun ch -> GetClient (id, ch))

            member self.get_client_by_ccode (ccode: CCode) =
                agent.PostAndAsyncReply(fun ch -> GetClientByCCode(ccode, ch))


            member self.search_client (search_req:  SearchReq list) =
                agent.PostAndAsyncReply(fun ch -> SearchClient (search_req, ch))

            member self.get_client_image(uri: Uri) =
                agent.PostAndAsyncReply(fun ch -> GetClientImage (uri, ch))
            member self.checkin_student (ch_rec: CheckInRecord) =
                agent.PostAndAsyncReply(fun ch -> CheckInClient (ch_rec, ch))
            member self.checkout_student (ch_rec: CheckOutRecord) =
                agent.PostAndAsyncReply(fun ch -> CheckOutClient (ch_rec, ch))

            member self.register_pv (ccode: string) (pv_id: string) =
                agent.PostAndAsyncReply(fun ch -> RegisterPV ((ccode, pv_id), ch))

            member self.update_pv (ccode: string) (pv_id: string) =
                agent.PostAndAsyncReply(fun ch -> UpdatePV ((ccode, pv_id), ch))
            member self.error = agent.Error




















