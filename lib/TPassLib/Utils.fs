﻿namespace TPass

open System
//open TPass
//open TPass.Types
open Safr.Types.TPass
module Utils =

    let swap_img_uri_old (client: TPassClient) (uri: Uri) =
        //TODO: This is hacky bullshit.
        let env_swap = Environment.GetEnvironmentVariable("IMG_URL_TYPE")
        match env_swap with
        //match swap with
        | "internal" ->

            let photo_type =
                match client with
                | Student _ -> "Students"
                | _ ->  "Others"

            let host = uri.Host
            if host = "173.220.177.75" then
               let img = uri.Segments |> Array.last
               Uri ((sprintf "https://192.168.3.12/tpassk12v2/Images/Photos/%s/%s" photo_type img))
            else
               uri
        | _ ->
            uri

    let swap_img_uri (uri: Uri) =
        //TODO: This is hacky bullshit.
        let env_swap = Environment.GetEnvironmentVariable("IMG_URL_TYPE")
        match env_swap with
        //| "internal" ->
        | "internal" ->
             let ext_url = uri.ToString()
             ext_url.Replace("173.220.177.75", "192.168.3.12") |> Uri
        | _ ->
            uri
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
