namespace Eyemetric.FR

open System
open System.Data
open System.Data.SQLite
open Safr.Types.Paravision.Identification
module Enrollment =

    type private Agent<'T> = MailboxProcessor<'T>

    let private open_conn (dbPath: string) =
        //TODO: replace with real error handling
        try
            let conn = new SQLiteConnection(sprintf "Data Source=%s;Version=3" dbPath)
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn "no bueno moreno connection: %s" ex.Message
            None

    type private AgentMsg =
        | CreateEnrollment of (EnrollmentInfo * AsyncReplyChannel<Result<int, exn>>)
        | CheckExistence of (string * AsyncReplyChannel<Result<string option, exn>>)
        | GetEnrolledDetails of (PossibleMatch * AsyncReplyChannel<Result<EnrolledIdentity option, exn>>)
        | GetEnrolledDetailsID of (string * AsyncReplyChannel<Result<EnrolledIdentity option, exn>>)
        | DeleteAllEnrollments of AsyncReplyChannel<Result<int, exn>>
        | DeleteEnrollment of (string * AsyncReplyChannel<Result<int, exn>>)

    let private parse_possible_identity (pid:string) =
       match (pid |> to_possible_identity) with
       | Ok p -> Some p
       | _ -> None

    let private get_all_ccodes conn = conn |> Queries.Enrollment.get_all_ccodes
    let private check_existence conn ccode = (conn, ccode) ||> Queries.Enrollment.exists
    let private get_enrolled_identity_by_id conn id = (conn, id) ||> Queries.Enrollment.get_enrollment
    let private get_enrolled_identity conn pid = (conn, pid.identities.Head.id) ||> Queries.Enrollment.get_enrollment
    let private create_enrollment conn enroll_info = (conn, enroll_info) ||> Queries.Enrollment.enroll
    let private delete_all_enrollments (conn) = conn |> Queries.Enrollment.delete_all
    let private delete_enrollment (conn) (id: string) = (conn, id) ||> Queries.Enrollment.delete_enrollment

    let def_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/config.sqlite")
    type EnrollmentAgent(?dbPath: string) =
        let pth = (dbPath, def_db_path) ||> defaultArg
        let conn = (open_conn  pth).Value

        let agent = Agent.Start(fun inbox ->
            let rec loop (state) =
                async {
                    let! msg = inbox.Receive()
                    match msg with
                    | GetEnrolledDetails (possible_identity, reply_chan) ->
                        let e_id = get_enrolled_identity conn possible_identity
                        reply_chan.Reply e_id
                        return! loop state
                    | CheckExistence (ccode, rc) ->
                        let exists = (check_existence conn ccode)
                        rc.Reply exists
                        return! loop state
                    | GetEnrolledDetailsID (id, reply_chan) ->
                        let e_id = get_enrolled_identity_by_id conn id
                        reply_chan.Reply e_id
                        return! loop state
                    | CreateEnrollment (enroll_info, reply_chan) ->
                        printfn "ENROLL AGENT: in CreateEnrollment MSG"
                        let res = (conn, enroll_info) ||> create_enrollment
                        res |> reply_chan.Reply
                        return! loop state
                    | DeleteEnrollment (id, reply_chan) ->
                        let res = (conn, id) ||> delete_enrollment
                        res |> reply_chan.Reply
                        return! loop state

                    | DeleteAllEnrollments reply_chan ->
                        let res = conn |> delete_all_enrollments //handle result here or pass to caller?
                        res |> reply_chan.Reply
                        return! loop state
                }
            loop [])

        member self.exists (ccode: string) =
            agent.PostAndAsyncReply(fun rc -> CheckExistence (ccode, rc))
        member self.get_enrolled_details (pid: PossibleMatch ) =
            agent.PostAndReply(fun rc -> GetEnrolledDetails (pid, rc))
        member self.get_enrolled_details_by_id (id: string ) =
            agent.PostAndReply(fun rc -> GetEnrolledDetailsID (id, rc))

        member self.delete_enrollment (id: string) =
            agent.PostAndReply(fun rc -> DeleteEnrollment (id, rc))
        member self.delete_all_enrollments () =
            agent.PostAndAsyncReply(fun rc -> DeleteAllEnrollments rc)
        member self.enroll enroll_info =
            agent.PostAndReply(fun rc -> CreateEnrollment (enroll_info, rc))