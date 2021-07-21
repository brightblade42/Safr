namespace EyemetricFR

open System
//open EyemetricFR.TPassApi //Http
open EyemetricFR.HTTPApi
open EyemetricFR.HTTPApi.Auth
open EyemetricFR.HTTPApi.TPass
open EyemetricFR.TPass.Types   //NOTE: types override any types with same name from earlier defined modules
type TPassService (url: string, cred: Credential, cert_check: bool) =

    let error_evt = Event<string>()
    let mutable token_pair: TokenPair option = None
    let to_tpass_result_async (sr: Async<Result<string, string>>) = async {
       let! s = sr
       return
           match s with
           | Ok res -> Success res
           | Error e -> TPassError (Exception e) //is that what we really want?
    }

    let client =
        match cert_check with
        | true -> create_client None
        | false -> create_client (Some disable_cert_validation)

    let make_url = url |> create_url


    let (|IsVisitor|IsStudent|IsEmployee|IsVolunteer|IsParent|IsUnknown|) (input:string) =
        let line = input.ToLower()
        match line with
        | line when  line.Contains("visitor") -> IsVisitor
        | line when  line.Contains("student") -> IsStudent
        | line when  line.Contains("employee") -> IsEmployee
        | line when  line.Contains("volunteer") -> IsVolunteer
        | line when  line.Contains("parent") -> IsParent
        | _ -> IsUnknown

      ///match against line to find out what type of TPassClient it is and return it's string name
    let grp_client_types (line:string): string =
        match line with
        | IsVisitor  -> "Visitor"
        | IsStudent  -> "Student"
        | IsEmployee -> "EmployeeOrUser"
        | IsVolunteer -> "Volunteer"
        | IsParent -> "Parent"
        | IsUnknown -> "Unknown"

      ///Empty result is no results. Get em outa here! Also skips over any Errored Searches. This may not be great.
    let filter_empty_results (tpr: TPassResult<string>) =
        match tpr with | Success s -> s.Length <> 0 | _ -> false

      ///search results return array of json objects that represent different types
      ///and automatic parsing doesn't quite work. We need to help things along.
      ///The first step is splitting each object at it's close bracket.
    let split_json_obj (tpr: TPassResult<string>)  =
        match tpr with | Success s -> s.Split([|'}'|], StringSplitOptions.None)  | _ -> [||]

      ///convert to an array of TPassClients
      ///if any conversion is empty or malformed, we
      ///return item as None from match,.
      ///we filter out any items that are None and
      ///return the values out of the option type.
    let to_clients (s_res: (string * string []) []) =
          s_res |> Array.map (fun x ->
             match (fst x) with
             | "Visitor" ->
                (snd x) |> Array.map (fun x ->
                     match (Visitor.from x) with
                     | Ok v -> Visitor v |> Some
                     | Error e ->
                       printfn $"Visit Error %s{e}"
                       None )
             | "Student" ->
                (snd x) |> Array.map (fun x ->
                     match (Student.from x) with
                     | Ok s -> Student s |> Some
                     | Error e ->
                       printfn $"Student Error %s{e}"

                       None )
             | "EmployeeOrUser" ->
                (snd x) |> Array.map (fun x ->
                     match (EmployeeOrUser.from x) with
                     | Ok emp -> EmployeeOrUser emp |> Some
                     | Error e ->
                       printfn $"Student Error %s{e}"

                       None )
             | _ -> [|None|]
            )
           |> Array.collect id
           |> Array.filter (fun x -> x.IsSome)
           |> Array.map (fun x -> x.Value)

      //takes and array of TPassResult<string> which represents
      //a sequence of search results.
    let parse_search_results (sr: TPassResult<string> []) =
         //printfn "RES: %A" (sr |> Array.truncate 100)
         sr
         |> Array.filter filter_empty_results
         |> Array.map split_json_obj
         |> Array.collect id
         |> Array.filter (fun x -> x.Length > 1)
         |> Array.map (fun x -> x.TrimStart([|'[';','|])) //fixes funky format created by split
         |> Array.map (fun x -> x + "}")
         |> Array.groupBy grp_client_types
         |> to_clients


    let try_search_client_single (req: SearchReq) = async {

         return!
            match token_pair with
            | Some tok ->
                try
                    let (id, typ, comp_id) = req
                    search_client client tok make_url id typ comp_id
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }

    let try_search_client (req: SearchReq list) = async {

       let search (req: SearchReq list)=
            req
            |> List.map try_search_client_single
            |> List.map (to_tpass_result_async) //Convert each Result to a TPassResult
            |> Async.Parallel

       let! search_results = search req

       return parse_search_results search_results
    }

    let try_checkin_client (ch_in: CheckInRecord) = async {

       return!
            match token_pair with
            | Some tok ->
                try
                    check_in_student client tok make_url ch_in
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }
    let try_get_recent_checkin  (ccode: bigint) (compid: int) (date: DateTime) = async {

        let cc = string ccode
        let comp = string compid

        return!
            match token_pair with
            | Some tok ->
                try
                    get_last_checkin_record client tok make_url cc comp date
                with
                | e -> async {return Error e.Message}
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }


    let try_checkout_client (ch_out: CheckOutRecord) = async {

       return!
            match token_pair with
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

             //match (json |> to_visitor_reply) with
             match (Visitor.from json ) with
             | Ok v -> v |> Visitor |> Some
             | Error e ->
                 printfn $"Parse Error: %s{e}"
                 None

        elif json.ToLower().Contains("student") then

            match (Student.from json) with
            | Ok s -> s |> Student  |> Some
            | Error e ->
                printfn $"Parse Error: %s{e}"
                None //failwith "could not parse"

        elif json.ToLower().Contains("employee") then

            match (EmployeeOrUser.from json) with
            | Ok emp -> emp |> EmployeeOrUser |> Some
            | Error e ->
                printfn $"Parse Error: %s{e}"
                None //failwith "could not parse"
        else  None

    let try_get_pv_client (id: PVID) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    get_client_by_pv_id client tok make_url id
                with
                | e -> async { return Error e.Message }
            | None ->  async { return Error "Need a valid token to make TPass calls." }
    }

    let try_get_client_by_ccode (ccode: CCode) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    let (CCode code) = ccode //get the string thang
                    get_client_by_ccode client tok make_url code
                with
                | e -> async {return Error e.Message}
            | None -> async { return Error "Need a valid token to make TPass calls." }
    }


    let try_register_pv_id (ccode: string) (pv_id: string) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    register_pv_id client tok make_url ccode pv_id
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls." }

    }

    let try_update_pv_id  (ccode: string) (pv_id: string) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    update_pv_id client tok make_url ccode pv_id
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }

    let p_log (item: 'T) (label: string) =
        printfn "======================================="
        printfn $"============||  %s{label}  || ==============="
        printfn $"%A{item}"
        printfn "======================================="

    member self.initialize () = async {

        try
            printfn "==== Retrieving auth token ==== "
            let! tok =  get_token client cred make_url
            token_pair <- Some tok
            return Success true

        with
        | e ->
            printfn $"==== unable to get token ==== %s{e.Message}"
            e.Message |> error_evt.Trigger
            return TPassError e
    }

    member self.validate_user (cred: Credential) = async {
        try
            printfn "==== Retrieving token for USER ==== "
            let! tok =  get_token client cred make_url
            return Success true
        with
        | e ->
            printfn $"==== unable to get user  token ==== %s{e.Message}"
            e.Message |> error_evt.Trigger
            return TPassError e
    }
    member self.get_pv_client (id: PVID) = async {

           let! client_res = try_get_pv_client id
           return
               match client_res with
               | Ok c when c = "" ->
                   PVNotRegisteredError id
               | Ok c ->
                   let tp_client = c |> to_tpass_client
                   Success tp_client.Value

               | Error e -> TPassError (Exception e)

    }

    member self.get_client_by_ccode (ccode: CCode) = async {

           let! client_res =  try_get_client_by_ccode ccode
           let (CCode code) = ccode

           return
               match client_res with
               | Ok c when c = "" ->
                   ClientNotFound code
               | Ok c ->
                   let tp_client = c |> to_tpass_client
                   match tp_client with
                   | Some client ->
                       Success client
                   | None ->
                       ClientNotFound code
               | Error e -> TPassError (Exception e)
    }


    member self.search_client (search_req:  SearchReq list) = async {

       let! search_results =  (try_search_client search_req) |> Async.Catch

       return
           match search_results with
           | Choice1Of2 search -> Success search
           | Choice2Of2 exn    -> TPassError exn
    }

    member self.get_client_image(uri: Uri) = async {

           let! image_res =  uri.ToString() |> get_image
           return
               match image_res with
               | Ok bytes -> Success bytes
               | Error e -> TPassError (Exception e)

    }
    member self.checkin_student (ch_rec: CheckInRecord) = async {

           let! res = try_checkin_client ch_rec
           (res, "try_checkin_client") ||> p_log
           return
               match res with
               | Ok r -> Success r
               | Error e -> TPassError (Exception e)

    }
    member self.checkout_student (ch_rec: CheckOutRecord) = async  {

           let! recent_rec = (try_get_recent_checkin ch_rec.ccode ch_rec.compId ch_rec.date)
           (recent_rec, "recent_checkin") ||> p_log

           let CMatch (record:string) = async {
               match (CheckInRecord.from record) with
               | Ok r ->
                   let ch_rec = {ch_rec with pkid = r.pkid}
                   let! checkout_res = try_checkout_client ch_rec
                   (checkout_res, "try_checkout_client") ||> p_log
                   match checkout_res with
                   | Ok res -> return Success res
                   | Error e -> return TPassError (Exception e)

               | Error e -> return TPassError (Exception e)
           }

           return!
               match recent_rec with
               | Ok recent when recent = "" -> async { return NotCheckedInError }
               | Ok recent -> CMatch(recent)
               | Error e -> async { return TPassError (Exception e) }
    }

    member self.register_pv (ccode: string) (pv_id: string) = async {

           let! reg_res =  try_register_pv_id ccode pv_id

           return
               match reg_res with
               | Ok reg ->
                   (reg, "try_register_pv_id") ||> p_log
                   Success reg
               | Error e -> TPassError (Exception e)
    }

    member self.update_pv (ccode: string) (pv_id: string) = async {

           let! reg_res = try_update_pv_id ccode pv_id

           return
               match reg_res with
               | Ok reg ->
                   (reg, "try_update_pv_id") ||> p_log
                   Success reg
               | Error e -> TPassError (Exception e)
    }




















