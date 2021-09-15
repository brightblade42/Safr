namespace EyemetricFR

open System
open HTTPApi
open Auth
open EyemetricFR.TPass.Types   //NOTE: types override any types with same name from earlier defined modules

module REST = TPass

module SearchHelper =

     //=================================================================================================== ===========
     //We get our results as a series of Success or Error cases where each Success contains a string repr.
     //of json array of objects.  The series of Success or Failure cases is the aggregation of a
     //a Fork-join parallel function of all the search requests we've passed to it.

     //The json results may represent a variation of TPassClients. Visitors, Student, Employees etc.
     //The json parser can't really figure out which types to convert these into at this point and so we must
     //prepare the data first by lending a hand with some parsing.
     //=================================================================================================== ===========
     //Parsing steps.
     // Split the string by its end } bracket which denotes the end of an object.
     // This gives us an array of json objects repr as strings,at this point the obj format is not correct so we fix that
     // See parse_search_result_function.
     // After the array of json strings is in proper object format we examine each one and convert it into a proper
     // TPassClient object.
     // We then Group the TPass client objects into their respective Types and return a grouped result for further processing

    ///match against contents of line input and return the corresponding Tag.
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
         sr
         |> Array.filter filter_empty_results
         |> Array.map split_json_obj
         |> Array.collect id
         |> Array.filter (fun x -> x.Length > 1)
         |> Array.map (fun x -> x.TrimStart([|'[';','|])) //fixes funky format created by split
         |> Array.map (fun x -> x + "}")
         |> Array.groupBy grp_client_types
         |> to_clients


type TPassService (url: string, cred: Credential, cert_check: bool) =

    let mutable token_pair: TokenPair option = None

    let error_evt = Event<string>()

    let to_tpass_result_async (sr: Async<Result<string, string>>) = async {
       let! s = sr
       return
           match s with
           | Ok res -> Success res
           | Error e -> TPassError (Exception e) //is that what we really want?
    }

    let client =
        match cert_check with
        | true  -> create_client None
        | false -> create_client (Some disable_cert_validation)

    let make_url = create_url url

    let try_search_client_single (req: SearchReq) = async {
         return!
            match token_pair with
            | Some tok ->
                try
                    let id, typ, comp_id = req
                    REST.search_client client tok make_url id typ comp_id
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
       return SearchHelper.parse_search_results search_results
    }

    let try_checkin_client (ch_in: CheckInRecord) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    REST.check_in_student client tok make_url ch_in
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }
    let try_get_recent_checkin  (ccode: bigint) (compid: int) (date: DateTime) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    REST.get_last_checkin_record client tok make_url (string ccode) (string compid) date
                with
                | e -> async {return Error e.Message}
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }


    let try_checkout_client (ch_out: CheckOutRecord) = async {
       return!
            match token_pair with
            | Some tok ->
               try
                    REST.check_out_student client tok make_url ch_out
               with
               | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls" }
    }

    let get_image (url: string) = async {
        try
            let! x = REST.download_image client url
            return Ok x
        with
        | e -> return Error e.Message
    }

    //TODO: this is a little hackey, is there a better way then a string match?
    let to_tpass_client (json: string)  =
        if  json.ToLower().Contains("visitor") then
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
            | Ok emp -> Some (EmployeeOrUser emp)
            | Error e ->
                printfn $"Parse Error: %s{e}"
                None //failwith "could not parse"
        else  None

    let try_get_pv_client (id: PVID) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    REST.get_client_by_pv_id client tok make_url id
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
                    REST.get_client_by_ccode client tok make_url code
                with
                | e -> async {return Error e.Message}
            | None -> async { return Error "Need a valid token to make TPass calls." }
    }


    let try_register_pv_id (ccode: string) (pv_id: string) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    REST.register_pv_id client tok make_url ccode pv_id
                with
                | e -> async { return Error e.Message }
            | None -> async { return Error "Need a valid token to make TPass calls." }

    }

    let try_update_pv_id  (ccode: string) (pv_id: string) = async {
        return!
            match token_pair with
            | Some tok ->
                try
                    REST.update_pv_id client tok make_url ccode pv_id
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
            let! tok =  REST.get_token client cred make_url
            token_pair <- Some tok
            return Success true

        with
        | e ->
            printfn $"==== unable to get token ==== %s{e.Message}"
            error_evt.Trigger e.Message
            return TPassError e
    }

    member self.validate_user (cred: Credential) = async {
        try
            printfn "==== Retrieving token for USER ==== "
            let! tok =  REST.get_token client cred make_url
            let _,jwt = tok
            return
                match jwt with
                | Some (Ok jtok) -> Success jtok
                | Some (Error e) ->
                    error_evt.Trigger e
                    TPassError (Exception e) //this is funky should we be making Exceptions?
                | _ ->
                    error_evt.Trigger "could not get token"
                    TPassError (Exception "could not get token")
        with
        | e ->
            printfn $"==== unable to get user  token ==== %s{e.Message}"
            error_evt.Trigger e.Message
            return TPassError e
    }
    member self.get_pv_client (id: PVID) = async {
           let! client_res = try_get_pv_client id
           return
               match client_res with
               | Ok c when c = "" -> PVNotRegisteredError id
               | Ok c -> Success (to_tpass_client c).Value
               | Error e -> TPassError (Exception e)

    }

    member self.get_client_by_ccode (ccode: CCode) = async {
           let! client_res =  try_get_client_by_ccode ccode
           let (CCode code) = ccode

           return
               match client_res with
               | Ok c when c = "" -> ClientNotFound code
               | Ok c ->
                   match (to_tpass_client c) with
                   | Some client -> Success client
                   | None -> ClientNotFound code
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
           let! image_res = get_image (uri.ToString())
           return
               match image_res with
               | Ok bytes -> Success bytes
               | Error e  -> TPassError (Exception e)

    }
    member self.checkin_student (ch_rec: CheckInRecord) = async {
           let! res = try_checkin_client ch_rec
           //p_log res "try_checkin_client"
           return
               match res with
               | Ok r    -> Success r
               | Error e -> TPassError (Exception e)

    }
    member self.checkout_student (ch_rec: CheckOutRecord) = async  {
           let! recent_rec = (try_get_recent_checkin ch_rec.ccode ch_rec.compId ch_rec.date)
           //p_log recent_rec "recent_checkin"

           let CMatch (record:string) = async {
               match (CheckInRecord.from record) with
               | Ok r ->
                   let ch_rec = {ch_rec with pkid = r.pkid}
                   let! checkout_res = try_checkout_client ch_rec
                   //p_log checkout_res "try_checkout_client"
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
                   p_log reg "try_register_pv_id"
                   Success reg
               | Error e -> TPassError (Exception e)
    }

    member self.update_pv (ccode: string) (pv_id: string) = async {
           let! reg_res = try_update_pv_id ccode pv_id
           return
               match reg_res with
               | Ok reg ->
                   p_log reg "try_update_pv_id"
                   Success reg
               | Error e -> TPassError (Exception e)
    }




















