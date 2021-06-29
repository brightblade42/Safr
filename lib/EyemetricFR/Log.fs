namespace Eyemetric.FR
open System
open System.Data.SQLite
open Types
open Safr.Types.Eyemetric
module Logging  =

    type Agent<'T> = MailboxProcessor<'T>

    type Msg =
        | Log of FRLog
        | GetLogs
        | GetTop of (Option<int> * AsyncReplyChannel<Result<seq<FRLog>,exn>>)
        | GetByDateRange of (Option<string> * Option<string> * AsyncReplyChannel<Result<seq<FRLog>,exn>>)
        | PurgeLogs

    let open_conn (dbPath: string) =
        //TODO: replace with real error handling
        try
            printfn "opening data connection for FR Logging"
            let conn = new SQLiteConnection$"Data Source=%s{dbPath};Version=3"
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn $"no bueno moreno connection: %s{ex.Message}"
            None

    let log_fr conn (item: FRLog ) =
        printfn "logging fr identification!"
        let x = Queries.Logging.log_fr conn item
        ()
    let get_top_fr conn (count: Option<int>) =
        printfn "getting latest fr log"
        let cnt = count |> Option.defaultValue 100
        let res = Queries.Logging.get_fr_top conn cnt
        res

    let get_frlog_by_date conn (startdate: Option<string>) (enddate: Option<string>) =
        printfn "getting latest fr log by date ranger"
        let startdate = startdate |> Option.defaultValue "2021-06-28"
        let enddate = enddate |> Option.defaultValue "2021-06-29"
        let res = Queries.Logging.get_frlog_by_date conn startdate enddate
        res
    let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/frlog.sqlite")
    type FRLogAgent(?dbPath: string) =
        let db_path = (dbPath, default_db_path) ||> defaultArg
        let conn = (open_conn db_path).Value
        let agent = Agent.Start(fun inbox ->
                let rec loop (state: string list) =
                    async {
                         let! msg = inbox.Receive()
                         match msg with
                         | Log item ->
                             log_fr conn item
                             return! loop []
                         | GetLogs ->
                             return! loop []
                         | GetTop (count, ch) ->
                             let r = get_top_fr conn count
                             ch.Reply(r)

                             return! loop []
                         | GetByDateRange (startdate, enddate, ch) ->
                             let r = get_frlog_by_date conn startdate enddate
                             ch.Reply(r)
                             return! loop []
                         | PurgeLogs ->
                             return! loop []
                    }

                loop [])


        member self.log (item:  FRLog) =
            agent.Post(Log item)

        member self.get_top(count: Option<int>) =
            agent.PostAndAsyncReply(fun ch -> GetTop (count, ch))


        member self.get_by_daterange (startdate: Option<string>) (enddate: Option<string>) =
            agent.PostAndAsyncReply(fun ch -> GetByDateRange (startdate,enddate, ch))

    module Enrollment =
        type private Agent<'T> = MailboxProcessor<'T>

        type private Msg =
            | Log of (EnrollLog * AsyncReplyChannel<Result<int, string>>)
            | GetLogs
            | PurgeLogs

        let private open_conn (dbPath: string) =
            //TODO: replace with real error handling
            try
                printfn "opening data connection for Enroll Logging"
                let conn = new SQLiteConnection$"Data Source=%s{dbPath};Version=3"
                conn.Open()
                Some conn
            with
            | :? System.Exception as ex ->
                printfn $"no bueno moreno enroll log connection: %s{ex.Message}"
                None

        let private log_enroll conn (item: EnrollLog ) = async {
            printfn "logging enroll item!"

            let res =  Queries.Logging.Enrollment.log conn item
            return
                match res with
                | Ok r -> Ok r
                | Error e -> Error e.Message

        }

        let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/enroll_log.sqlite")
        type EnrollLogAgent(?dbPath: string) =
            let db_path = (dbPath, default_db_path) ||> defaultArg
            let conn = (open_conn db_path).Value
            let agent = Agent.Start(fun inbox ->
                    let rec loop (state: string list) =
                        async {
                             let! msg = inbox.Receive()
                             match msg with
                             | Log (item:EnrollLog, ch) ->
                                 let! res = log_enroll conn item
                                 ch.Reply(res)
                                 return! loop []
                             | GetLogs ->
                                 return! loop []
                             | PurgeLogs ->
                                 return! loop []
                        }

                    loop [])


            member self.log (item:  EnrollLog) =
                agent.PostAndAsyncReply (fun ch -> Log (item, ch))
