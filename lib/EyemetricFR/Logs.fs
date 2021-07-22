namespace EyemetricFR

open System

module Logging  =

    type IdentifiedLogger(?dbPath: string) =

        let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/frlog.sqlite")
        let db_path = defaultArg dbPath default_db_path
        let conn = (open_conn db_path).Value

        let log_fr conn (item: FRLog ) =
            printfn "logging fr identification!"
            let x = Queries.Logging.log_fr conn item
            ()

        let get_frlog_by_date conn (startdate: Option<string>) (enddate: Option<string>) =
            printfn "getting latest fr log by date ranger"
            let startdate = Option.defaultValue "2021-06-28" startdate
            let enddate   = Option.defaultValue "2021-06-29" enddate
            Queries.Logging.get_frlog_by_date conn startdate enddate

        member self.log item = log_fr conn item

        member self.get_by_daterange (startdate: Option<string>) (enddate: Option<string>) = async {
            return get_frlog_by_date conn startdate enddate
        }

    type EnrollmentLogger(?dbPath: string) =

        let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/enroll_log.sqlite")

        let db_path = defaultArg dbPath default_db_path
        let conn = (open_conn db_path).Value

        let log_enroll conn (item: EnrollLog ) = async {
            printfn "logging enroll item!"
            return
                match (Queries.Logging.Enrollment.log conn item) with
                | Ok r    -> Ok r
                | Error e -> Error e.Message
        }

        member self.log (item:  EnrollLog) = log_enroll conn item


