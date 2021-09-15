namespace EyemetricFR

open System
open System.IO

module Logging  =
    module Logger = Queries.Logging

    type IdentifiedLogger(?dbPath: string) =

        let db_path = defaultArg dbPath (Path.Combine(AppContext.BaseDirectory, "data/frlog.sqlite"))
        let conn    = (open_conn db_path).Value

        member self.log item =
            printfn "logging fr identification!"
            let x = Logger.log_fr conn item
            ()

        member self.log_error item =
            printfn "logging fr error!"
            let x = Logger.log_fr_error conn item
            ()
        member self.get_by_daterange (startdate: Option<string>) (enddate: Option<string>) = async {
            printfn "getting latest fr log by date ranger"
            let startdate = Option.defaultValue "2021-06-28" startdate
            let enddate   = Option.defaultValue "2021-06-29" enddate
            return Logger.get_frlog_by_date conn startdate enddate
        }

    type EnrollmentLogger(?dbPath: string) =

        let db_path = defaultArg dbPath (Path.Combine(AppContext.BaseDirectory, "data/enroll_log.sqlite"))
        let conn    = (open_conn db_path).Value

        member self.log (item:  EnrollLog) = async {
            printfn "logging enroll item!"
            return
                match (Logger.log_enrollment conn item) with
                | Ok r    -> Ok r
                | Error e -> Error e.Message
        }


