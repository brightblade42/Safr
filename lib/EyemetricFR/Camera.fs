namespace Eyemetric.FR

open System
open FSharp.Collections
open System.Data.SQLite
open Safr.Types.Paravision.Streaming
module Queries = Eyemetric.FR.Queries.Camera

module Camera =

    type Agent<'T> = MailboxProcessor<'T>

    let open_conn (dbPath: string) =
        //TODO: replace with real error handling

        try
            let conn = new SQLiteConnection(sprintf "Data Source=%s;Version=3" dbPath)
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn "no bueno connection: %s" ex.Message
            None
    let close_conn (conn: SQLiteConnection) =
        conn.Close()
        conn.Dispose()

    type AgentMsg =
        | GetCameras of (bool option * AsyncReplyChannel<Result<seq<CameraStream>, exn>>)
        | GetCamera of (CameraID * AsyncReplyChannel<Result<CameraStream option, exn>>)
        | SaveCamera of (CameraStream * AsyncReplyChannel<Result<int, exn>>)
        | UpdateCamera of (CameraStream * AsyncReplyChannel<Result<int, exn>>)
        | DeleteCamera of (CameraID * AsyncReplyChannel<Result<int, exn>>)

    let def_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/config.sqlite")

    type CameraAgent(?dbPath: string) =
        let db_path = (dbPath, def_db_path) ||> defaultArg
        let conn = (open_conn db_path).Value //not sure about this here
        let get_cam    = conn |> Queries.get_camera
        let get_cams   = conn |> Queries.get_cameras
        let del_cam    = conn |> Queries.delete_camera
        let save_cam   = conn |> Queries.save_camera
        let update_cam = conn |> Queries.update_camera

        let agent = Agent.Start(fun inbox ->
            let rec loop (state) =
               async {
                   let! msg = inbox.Receive()
                   match msg with
                   | GetCameras (enabled, reply_chan) ->
                      let cams = get_cams enabled
                      reply_chan.Reply(cams)
                      return! loop [] //not managing state atm but we will, yes we will.
                   | GetCamera (id, reply_chan) ->
                       let cam = get_cam id
                       reply_chan.Reply(cam)
                       return! loop []
                   | SaveCamera (camera, reply_chan) ->
                       let res = save_cam camera
                       reply_chan.Reply(res)
                       return! loop []
                   | UpdateCamera (camera, reply_chan) ->
                       let res = update_cam camera
                       reply_chan.Reply(res)
                       return! loop []
                   | DeleteCamera (id, reply_chan) ->
                       let res = del_cam id
                       reply_chan.Reply(res)
                       return! loop []

            }
            loop [])

        member self.get_cameras (enabled: bool option) =
            agent.PostAndAsyncReply(fun rc -> GetCameras (enabled, rc))

        member self.get_camera (id: CameraID) =
            agent.PostAndAsyncReply(fun rc -> GetCamera (id, rc))

        member self.save_camera (c: CameraStream) =
            agent.PostAndAsyncReply(fun rc -> SaveCamera (c, rc))


        member self.delete_camera (id: CameraID) =
            agent.PostAndAsyncReply(fun rc -> DeleteCamera (id, rc))

        member self.update_camera (c: CameraStream) =
            agent.PostAndAsyncReply(fun rc -> UpdateCamera (c, rc))
