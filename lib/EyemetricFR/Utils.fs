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
   module Enrollment =

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

        let create_enrollment_info (id_agent: FaceIdentification) (client: TPassClientWithImage) = async {

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
            return! clients |> Seq.map(create_enrollment_info id_agent) |> Async.Parallel
        }
