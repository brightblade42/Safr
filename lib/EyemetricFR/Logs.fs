namespace EyemetricFR

open System

module Logging  =

    type IdentifiedLogger(?dbPath: string) =

        let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/frlog.sqlite")
        let db_path = (dbPath, default_db_path) ||> defaultArg
        let conn = (open_conn db_path).Value

        let log_fr conn (item: FRLog ) =
            printfn "logging fr identification!"
            let x = Queries.Logging.log_fr conn item
            ()

        let get_frlog_by_date conn (startdate: Option<string>) (enddate: Option<string>) =
            printfn "getting latest fr log by date ranger"
            let startdate = startdate |> Option.defaultValue "2021-06-28"
            let enddate = enddate |> Option.defaultValue "2021-06-29"
            let res = Queries.Logging.get_frlog_by_date conn startdate enddate
            res

        member self.log(item: FRLog) =
            log_fr conn item

        member self.get_by_daterange (startdate: Option<string>) (enddate: Option<string>) = async {
            let r = get_frlog_by_date conn startdate enddate
            return r
        }

    type EnrollmentLogger(?dbPath: string) =

        let default_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/enroll_log.sqlite")

        let db_path = (dbPath, default_db_path) ||> defaultArg
        let conn = (open_conn db_path).Value

        let log_enroll conn (item: EnrollLog ) = async {
            printfn "logging enroll item!"

            let res =  Queries.Logging.Enrollment.log conn item
            return
                match res with
                | Ok r -> Ok r
                | Error e -> Error e.Message

        }

        member self.log (item:  EnrollLog) = log_enroll conn item


