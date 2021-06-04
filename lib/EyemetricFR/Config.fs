namespace Eyemetric.FR

open System
open System.Data.SQLite

module Queries = Eyemetric.FR.Queries.Config

module Config =

    type Agent<'T> = MailboxProcessor<'T>
    type Msg =
        | Get of AsyncReplyChannel<Configuration option>
        | Update of (Configuration * AsyncReplyChannel<Result<int, exn>>)
        | ValidateUser of string * string * AsyncReplyChannel<bool>
    let private open_conn (db_path: string) =
        //TODO: replace with real error handling
        try
            let conn = new SQLiteConnection(sprintf "Data Source=%s;Version=3" db_path)
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn "couldn't connect to config data store: %s" ex.Message
            None
    let def_config_db = System.IO.Path.Combine(AppContext.BaseDirectory, "data/config.sqlite")

    let private update_config conn conf = (conn, conf) ||> Queries.update_config
    type ConfigAgent(?db_path: string) =
        let db_path' = (db_path, def_config_db) ||> defaultArg
        let conn = (open_conn db_path').Value
        let get_config () =
            let conf = conn |> Queries.get_latest_config
            match conf with
            | Ok c -> c
            | Error e -> printfn "could not retrieve a good config. %s" e.Message; None


        let validate_user' user pass =
            let r = (conn, user) ||> Queries.get_pwd
            match r with
            | Ok(Some(p)) -> if p = pass then true else false
            | _ -> false

        //not doing much with the state at the moment.
        let agent = Agent.Start(fun inbox ->
                let rec loop (state: Configuration option) =
                    async {
                        let! msg = inbox.Receive()

                        match msg with
                        | Get ch ->
                            let conf = get_config ()
                            ch.Reply(conf)
                            return! loop conf

                        | Update (conf, ch) ->
                           let upd = (conn, conf) ||> update_config
                           ch.Reply(upd)
                           return! conf |> Some |> loop

                        | ValidateUser (user, pass, ch) ->
                            let is_valid = (user, pass) ||> validate_user'
                            ch.Reply(is_valid)
                            return! loop state
                    }

                loop (get_config ())
                )

        member self.get_latest_config () =
            agent.PostAndReply(Get)

        member self.update_config conf =
            agent.PostAndReply (fun ch -> Update (conf, ch))


        member self.validate_user user pwd  =
            agent.PostAndReply(fun ch -> ValidateUser (user, pwd, ch))


