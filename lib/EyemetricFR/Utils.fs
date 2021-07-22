namespace EyemetricFR

open System
open EyemetricFR.Paravision.Types.Identification
open EyemetricFR.Identifier
open EyemetricFR.TPass.Types

module Utils =

   type Agent<'T> = MailboxProcessor<'T>

   type CacheMsg<'a,'b> =
   | Get of 'a * AsyncReplyChannel<'b option>
   | Set of 'a * 'b
   | SetExpiration of int
   | GetExpiration of AsyncReplyChannel<TimeSpan>


   ///A basic cache with expiration.
   type CacheMap(timeout: int) =

      let mutable expiry = TimeSpan.FromMilliseconds (float timeout)

      let (|CacheHit|_|) (exp_ts:TimeSpan) key map =
          match (Map.tryFind key map) with
          | Some (value, dt) when DateTime.Now - dt < exp_ts -> Some value
          | _ -> None

      let exp = Map.filter (fun _ (_, dt) -> DateTime.Now-dt >= expiry)
      let new_value k v = Map.add k (v, DateTime.Now)
      let agent = Agent.Start(fun inbox ->
         let rec loop map =
            async {
               let! msg = inbox.TryReceive timeout
               match msg with
               | Some (Get (key, channel)) ->
                  match map with
                  | CacheHit expiry key ret_value ->
                     channel.Reply (Some ret_value)
                     return! loop map
                  | _ ->
                     channel.Reply None
                     return! loop (Map.remove key map)
               | Some (Set (key, value)) ->
                  return! loop (new_value key value map)
               | Some (SetExpiration ms) ->
                  expiry <- TimeSpan.FromMilliseconds (float ms)
                  return! loop (exp map)
               | Some (GetExpiration ch) ->
                  ch.Reply expiry
                  return! loop (exp map)
               | None ->
                  return! loop (exp map)
            }
         loop Map.empty
      )

      member self.get (k: IComparable)  =
         agent.PostAndReply(fun ch -> Get (k, ch))

      member self.set (k: IComparable) (v: string) =
         agent.Post (Set (k, v))

      member self.set_expiration (ms: int) =
         agent.Post(SetExpiration ms)

      member self.get_expiration =
         agent.PostAndReply(GetExpiration)



   //we don't need no stinking .NET timers.
   type SimpleTimer(interval:int, callback:unit-> Async<unit>) =
       let agent = new Agent<bool>(fun inbox ->
               async {
                   let mutable stop = false
                   while not stop do
                       // Sleep for our interval time
                       do! Async.Sleep interval

                       // Timers raise on threadpool threads - mimic that behavior here
                       do! Async.SwitchToThreadPool() //may not be neeeded for out purposes
                       do! callback ()

                       // Check for our stop message
                       let! msg = inbox.TryReceive(1)
                       stop <- defaultArg msg false
               })

       member self.start() = agent.Start()
       member self.stop() = agent.Post true

   let swap_img_uri (uri: Uri) =
        //TODO: This is hacky bullshit.
        match Environment.GetEnvironmentVariable("IMG_URL_TYPE") with
        //| "internal" ->
        | "internal" ->
             let ext_url = uri.ToString()
             ext_url.Replace("173.220.177.75", "192.168.3.12") |> Uri
        | _ ->
            uri


    //===================================================================
    //P1:   Batch Enrollment process Search based.
    //===================================================================

    //- search the tpass.
    //- get the images from the tpass from search result urls.
    //- write to local enrollment db,
    //-- for each ccode
      //- create paravision identity.
          //-- v2  check if image matches existing enrollment.
          //       if yes ... add face to id or replace?
      //- update db with pv code
      //- register pv,ccode with tpass

    //===================================================================
    //we can only enroll people with valid images, duh That's the point.
    //if the search result doesn't contain an image url then there is no image,
    //filter em out. NOTE: this doesn't validate the url, just that the url field contains something..
   module TPassEnrollment =

        let combine_with_image_swap (tpass: TPassService) (clients: TPassClient []) = async {

                let merge_image (client: TPassClient) (uri: Uri) = async {
                  //TODO: uri hack. REMOVE THIS ASAP!

                  let! img = uri |> swap_img_uri |> tpass.get_client_image
                  let image =
                    match img with
                    | Success im -> Some im
                    | _ -> None
                  return { client = client; image = image }
                }

                return!
                  clients
                  |> Seq.filter (fun x -> (x |> TPassClient.image_url).Length > 1)
                  |> Seq.map(fun x -> (x, Uri (x |> TPassClient.image_url)) ||> merge_image)
                  |> Async.Parallel

            }

        let combine_with_image (tpass: TPassService) (clients: TPassClient []) = async {

                let merge_image (client: TPassClient) (url: string) = async {
                  //TODO: uri hack. REMOVE THIS ASAP!

                  let image =
                      match url.Length with //the dreaded empty
                      | 0 -> None
                      | _ ->
                          let uri = Uri url
                          let img = uri |> tpass.get_client_image |> Async.RunSynchronously
                          match img with
                          | Success im -> Some im
                          | _ -> None

                  return { client = client; image = image }
                }

                return!
                  clients
                  |> Seq.map(fun x -> merge_image x (TPassClient.image_url x))
                  |> Async.Parallel
        }

        let create_enrollment (id_agent: FaceIdentification) (client: TPassClientWithImage) = async {

              //TODO: add special Error type for when Duplicates are detected.
              //we might want to say.. hey..an identity very much like this one exists
              //should we replace? add face to existing? skip?

              match client.image with
                | Some im ->
                  let! id_result = (Binary im) |> id_agent.create_identity

                  match id_result with
                  | Ok id -> return { tpass_client= client.client |> Some; face = (Binary im); identity = id; general_info = None } |> Ok
                  | Error ex ->
                      printfn $"Couldn't create identity for %A{client.client}"
                      return Error ex //None

                | None -> return Error $"could not create identity. No image exists for:   %A{client}"

            }

        let create_enrollments (id_agent: FaceIdentification) (clients: TPassClientWithImage seq) = async {
            return! clients |> Seq.map(create_enrollment id_agent) |> Async.Parallel
        }

(*
   module Search =

      //This module helps us take a prepare a json result set of search results and parse them into useable objects.

     //=================================================================================================== ===========
     //We get out results as a series of Succes or Error cases where each Success contains a string repr.
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
      ///

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

      //TODO: Error Logging

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
                     match (to_visitor_reply x) with
                     | Ok v -> Visitor v |> Some
                     | Error e ->
                       printfn "Visit Error %s" e
                       None )
             | "Student" ->
                (snd x) |> Array.map (fun x ->
                     match (to_student_reply x) with
                     | Ok s -> Student s |> Some
                     | Error e ->
                       printfn "Student Error %s" e

                       None )
             | "EmployeeOrUser" ->
                (snd x) |> Array.map (fun x ->
                     match (to_employee_or_user_reply x) with
                     | Ok emp -> EmployeeOrUser emp |> Some
                     | Error e ->
                       printfn "Student Error %s" e

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


      let split_search_results (search_results: TPassClient seq) =

        let is_student (x: TPassClient)  = match x with | Student s -> true | _ -> false
        let is_visitor (x: TPassClient)  = match x with | Visitor v -> true | _ -> false
        let is_employee (x: TPassClient)  = match x with | EmployeeOrUser _ -> true | _ -> false
        //separate into distinct Client types
        let students = search_results |> Seq.filter is_student |> Seq.map(fun (Student x) -> x)
        let visitors = search_results |> Seq.filter is_visitor |> Seq.map(fun (Visitor x) -> x)
        let employees = search_results |> Seq.filter is_employee |> Seq.map(fun (EmployeeOrUser x) -> x)

        (students, visitors, employees)
 *)