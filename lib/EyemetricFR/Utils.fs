namespace Eyemetric.FR

open System
open Eyemetric.FR.Enrollment
open Paravision.Identifier
open TPass.Client.Service
open Safr.Types.TPass
open Safr.Types.Paravision.Identification

module Utils =

    let map_async mapper asnc =
      async {
        let! a = asnc
        return mapper a
     }

    let bind_async binder asnc =
      async {
        let! value = asnc
        return! binder value
      }

    let map_result_async mapper asnc =
      async {
        let! value = asnc
        return!
          match value with
          | Success s ->
             s |> mapper
          | _  ->  async { return [||] }
           //failwith "boom" //throws Generic Exception
      }

    let do_enroll (enroll_agent: EnrollmentAgent) (enroll_infos: Result<EnrollmentInfo,string> []) = async {
       printfn "ENROLL: preparing local data store....."
       let enroll_client (enroll_info: EnrollmentInfo) = enroll_info |> enroll_agent.enroll
       let res = enroll_infos
                 |> Array.map(fun x ->
                     match x with
                     | Ok en -> en |> enroll_client |> Some
                     | _     -> None
                     )
                 |> Array.filter(fun x -> x.IsSome)
                 |> Array.map (fun x-> x.Value)
       return res
    }

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

        //let combine_with_image_hack (tpass_agent: TPassAgent) (client: TPassClient [])  =
        let combine_with_image_swap (tpass_agent: TPassAgent) (clients: TPassClient []) = async {

                let merge_image (client: TPassClient) (uri: Uri) = async {
                  //TODO: uri hack. REMOVE THIS ASAP!

                  let! img = uri |> TPass.Utils.swap_img_uri |> tpass_agent.get_client_image
                  let image =
                    match img with
                    | Success im -> Some im
                    | _ -> None
                  return { client = client; image = image }
                }

                return!
                  clients
                  |> Seq.filter (fun x ->
                      let y = "fun!"
                      (x |> TPassClient.image_url).Length > 1)
                  |> Seq.map(fun x -> (x, Uri (x |> TPassClient.image_url)) ||> merge_image)
                  |> Async.Parallel

            }

        let combine_with_image (tpass_agent: TPassAgent) (clients: TPassClient []) = async {


                let merge_image (client: TPassClient) (url: string) = async {
                  //TODO: uri hack. REMOVE THIS ASAP!

                  let image =
                      match url.Length with //the dreaded empty
                      | 0 ->
                         None

                      | _ ->
                          let uri = Uri url
                          let img = uri |> tpass_agent.get_client_image |> Async.RunSynchronously
                          match img with
                          | Success im -> Some im
                          | _ -> None


                  return { client = client; image = image }
                }


                return!
                  clients
                //  |> Seq.filter (fun x -> (x |> TPassClient.image_url).Length > 1)
                  |> Seq.map(fun x -> (x, (x |> TPassClient.image_url)) ||> merge_image)
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
                      printfn "Couldn't create identity for %A" client.client
                      return Error ex //None

                | None -> return Error (sprintf "could not create identity. No image exists for:   %A" client)

            }


        let create_enrollments (id_agent: FaceIdentification) (clients: TPassClientWithImage seq) = async {
            return! clients |> Seq.map(fun x ->  (id_agent, x) ||> create_enrollment) |> Async.Parallel
        }


    //===================================================================
    //P2: Batch Enrollment process File based.
    //===================================================================
    //- Load CSV file of info (name, ccode, image_name)  apprx columns
    //- write to local enrollmant db
    //- foreach ccode
    //--
    module GeneralEnrollment =
        open System.IO
        let filter_image_types (files: string seq) =

           let is_image_file (x: string) =
             if x.Contains(".") then
                 let ext = x.[x.IndexOf(".")+1..].ToLower()
                 match ext with | "jpg" | "jpeg" | "png" | "gif" -> true | _ -> false
             else false

           files |> Seq.filter(fun x -> x |> is_image_file)

        let create_general_info_seq (files: string seq) = async {

              let fi_to_gi (f_info: FileInfo) (delim: char) =
                  let sp_name = f_info.Name.Split([| delim |] , StringSplitOptions.None)
                  //let sp_name = (delim, f_info.Name) ||> String.split
                  match sp_name.Length with
                    | 3 ->
                      let fname = sp_name.[2]
                      let fname = fname.[..fname.IndexOf(".")-1]
                      { last_name = sp_name.[1]; first_name = fname; file_path = f_info.FullName } |> Some
                    | _ -> None

              return files
                 |> filter_image_types
                 |> Seq.map (fun x -> x |> FileInfo)
                 |> Seq.map(fun x -> (x, '_') ||> fi_to_gi)
                 |> Seq.filter(fun x -> x.IsSome) //jettison the shit
                 |> Seq.map(fun x -> x.Value)

        }
        let get_image_file (gi: GeneralInfo) = async {
            return { info = gi; image = File.ReadAllBytes(gi.file_path) |> Some }
        }

        let combine_with_image (general_infos: GeneralInfo seq) =
              general_infos |> Seq.map(fun gi -> gi |> get_image_file)

        let combine_with_image_async (general_infos: Async<GeneralInfo seq>) = async {
            let! general_infos = general_infos
            return! general_infos |> combine_with_image |> Async.Parallel
        }

        let create_enrollment (id_agent: FaceIdentification) (candidate: GeneralInfoWithImage) = async {
            let gi = candidate.info
             //Identity creation process.
             //TODO:
             // - 1. check if image matches an existing identity
             // - 2. if so, is it an identical image?
             // -      - if so, replace or skip?
             // - 3. if matches existing with N confidence
             //        - add face to ident or replace.

            match candidate.image with
            | Some im ->
                let! id_results = (Binary im) |> id_agent.create_identity

                match id_results with
                  | Ok id ->
                        let gen_info = sprintf """{ "first_name": "%s", "last_name": "%s"}""" gi.first_name gi.last_name
                        return { EnrollmentInfo.tpass_client= None ; face = (Binary im); identity = id; general_info = gen_info |> Some } |> Ok
                  | Error ex ->
                       printfn "Couldn't create identity for %s: %s" gi.last_name ex
                       return Error ex

            | None -> return Error (sprintf "could not create identity. No image found for candidate: %A" gi)
        }

        let create_enrollments (id_agent: FaceIdentification) (candidates: Async<GeneralInfoWithImage []>) = async  {
             let! candidates = candidates
             return! candidates |> Seq.map (fun (x:GeneralInfoWithImage) -> (id_agent, x) ||> create_enrollment) |> Async.Parallel
         }

