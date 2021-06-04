namespace Paravision

open System
//I really like Mailboxes
//should utils move to its own independant project?
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
