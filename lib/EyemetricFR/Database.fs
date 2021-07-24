namespace EyemetricFR

open System
open System.Data
open System.Collections.Generic
open Dapper
open Types
open EyemetricFR.Paravision.Types.Identification
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.TPass.Types

[<AutoOpen>]
module Database =

    open System.Data.SQLite

    let open_conn (dbPath: string) =
        //TODO: replace with real error handling
        try
            printfn $"opening data connection for %s{dbPath}"
            let conn = new SQLiteConnection$"Data Source=%s{dbPath};Version=3"
            conn.Open()
            Some conn
        with
        | :? Exception as ex ->
            printfn $"no bueno moreno connection: %s{ex.Message}"
            None

    let close_conn (conn: SQLiteConnection) =
        conn.Close()
        conn.Dispose()
    ///TODO: only handle specific errors, bubble up the truly exceptional
    let execute (conn:IDbConnection) (sql:string) (parameters:_)=
        try
            let result = conn.Execute(sql, parameters)
            Ok result
        with
        | ex ->
            printfn $"execute query failed %s{ex.Message}"
            Error ex

    let query_single (conn:IDbConnection) (sql:string) (parameters:IDictionary<string, obj> option) =

         try
             let result =
                 match parameters with
                 | Some p -> conn.QuerySingleOrDefault<'T>(sql, p)
                 | None -> conn.QuerySingleOrDefault<'T>(sql)

             if isNull (box result) then Ok None
             else Ok (Some result)

         with
         | ex -> Error ex

    let query_single_x<'T> (conn:IDbConnection) (sql:string) (parameters:IDictionary<string, obj> option) =

         try
             let result =
                 match parameters with
                 | Some p -> conn.QuerySingleOrDefault<'T>(sql, p)
                 | None -> conn.QuerySingleOrDefault<'T>(sql)

             if isNull (box result) then Ok None
             else Ok (Some result)

         with
         | ex ->
             printfn "%s" ex.Message
             Error ex

    let query<'T> (conn: IDbConnection) (sql:string) (parameters : IDictionary<string, obj> option): Result<seq<'T>, exn> =
       try
           use trans = conn.BeginTransaction()
           let result =
               match parameters with
               | Some p -> conn.Query<'T>(sql, p)
               | None -> conn.Query<'T>(sql)

           trans.Commit()
           Ok result

       with
       | ex -> Error ex

module Queries =

    module Enrollment =

        //get all the ccodes, help us to filter out attempts to enroll same person twice
        //at the id level not the face identification level.
        let get_all_ccodes conn = query conn "select ccode from enrollment"
        let exists conn (ccode:string) =
            query_single conn $"select ccode from enrollment where ccode='%s{ccode}'" None
        let get_enrollment conn (id: string)  =
            let sql = "select identity as id, pv_img from enrollment where identity=@ID"
            let p = ["ID", box id;] |> dict |> Some
            query_single_x<EnrolledIdentity> conn sql p

        let delete_enrollment conn (id: string) =
            let sql = "delete from enrollment where identity=@ID"
            let param = [("ID", box id)] |> dict
            printfn $"===== Deleting %s{id}"
            execute conn sql param

        let enroll conn (enroll_info: EnrollmentInfo) =
            let sql = """ insert into enrollment (identity, ccode, pv_json, tpass_json, pv_img, general_info)
                              VALUES (@identity, @ccode,  @pv_json, @tpass_json,  @pv_img, @general_info)
                          """
            let fbytes =
                match enroll_info.face with
                | Binary f -> f
                | B64Encoding f -> f |> Convert.FromBase64String
                | _ -> failwith "Can't enroll person without a valid image"

            let to_tpc_str (tpc: TPassClient) =
               match tpc with
               | Student s -> (string s.ccode, TPassClient.to_str tpc)
               | Visitor v -> (string v.ccode, TPassClient.to_str tpc)
               | EmployeeOrUser emp -> (string emp.ccode, TPassClient.to_str tpc)


            let ccode, tpc_str, general_info =
                match enroll_info with
                | { tpass_client = None; general_info = None } -> ("", "", "")
                | { tpass_client = None; general_info = Some(gi) } -> ("", "", gi)
                | { tpass_client = Some(tpc); general_info = None } ->
                    let (ccode, tpc_str) = tpc |> to_tpc_str
                    (ccode, tpc_str , "")

                | { tpass_client = Some(tpc); general_info = Some(gi) } ->
                    let (ccode, tpc_str) = tpc |> to_tpc_str
                    (ccode, tpc_str , gi)


            let data = [("@identity", box enroll_info.identity.id)
                        ("@ccode", box ccode)
                        ("@pv_json", box (enroll_info.identity |> Identity.to_str))
                        ("@tpass_json", box tpc_str)
                        ("@pv_img", box fbytes)
                        ("@general_info", box general_info)
                        ] |> dict
            execute conn sql data

        let delete_all conn =
            let sql = "delete from enrollment"
            execute conn sql None

    module Logging =
        let log_fr conn (item: FRLog ) =

            let sql = """insert into FRLog (
                              identity,
                              matched_on,
                              detected_img,
                              location,
                              expires,
                              matched_face,
                              name,
                              confidence,
                              status )
                         VALUES (@identity,
                                 @matched_on,
                                 @detected_img,
                                 @location,
                                 @expires,
                                 @matched_face,
                                 @name,
                                 @confidence,
                                 @status) """

            let det_face = item.detected_img
            let matched_face = item.matched_face

            let data = [("@identity", box item.identity)
                        ("@matched_on", box item.matched_on)
                        ("@detected_img", box det_face)
                        ("@location", box item.location)
                        ("@expires", box "30")
                        ("@matched_face", box matched_face)
                        ("@name", box item.name)
                        ("@confidence", box item.confidence)
                        ("@status", box item.status )
                        ] |> dict

            execute conn sql data

        let get_fr_top conn (count: int) =
            let sql =  $"select * from FRLog order by matched_on desc limit %d{count}"
            query<FRLog> conn sql None

        let get_frlog_by_date conn (startdate: string) (enddate: string) =
            let sql =  $"select * from FRLog where matched_on between '%s{startdate}' and '%s{enddate}' order by matched_on desc"
            query<FRLog> conn sql None

        let log_enrollment (conn: IDbConnection) (item: EnrollLog) =

                let sql = """
                           insert into log (ccode,name, typ, pv_id, result,  conf, msg,client, time_stamp)
                              VALUES (@ccode, @name, @typ, @pv_id, @result, @conf, @msg, @client, @time_stamp)
                            """

                let data =  [("@ccode", box item.ccode)
                             ("@name", box item.name)
                             ("@typ", box item.typ)
                             ("@pv_id", box item.pv_id)
                             ("@result", box item.result)
                             ("@conf", box item.conf)
                             ("@msg", box item.msg)
                             ("@client", box item.client)
                             ("@time_stamp", box (DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")))
                             ] |> dict

                execute conn sql data

    module Config =

        let get_latest_config conn =
            let sql = """
                      SELECT  id,
                      identity_cache_expiry,
                      vid_streaming_addr,
                      detection_socket_addr,
                      pv_api_addr,
                      min_identity_confidence,
                      tpass_api_addr,
                      tpass_user,
                      tpass_pwd,
                      modified_on
                      FROM FRService ORDER By id DESC LIMIT 1;
                      """
            query_single<Configuration> conn sql None


        let update_config conn (conf: Configuration) =
            let sql = """
                      UPDATE FRService SET
                      identity_cache_expiry=@identity_cache_expiry,
                      vid_streaming_addr=@vid_streaming_addr,
                      detection_socket_addr=@detection_socket_addr,
                      pv_api_addr=@pv_api_addr,
                      min_identity_confidence=@min_identity_confidence,
                      tpass_api_addr=@tpass_api_addr,
                      tpass_user=@tpass_user,
                      tpass_pwd=@tpass_pwd,
                      modified_on=datetime()
                      WHERE id=@id """


            execute conn sql conf

        let get_pwd conn (user: string) =
            let sql = $"Select pass from Accounts where user = '%s{user}'"
            query_single_x<string> conn sql None

    module Camera =

        let get_cameras conn (enabled: bool option) =

            let sql, param =
                match enabled with
                | Some(e) ->
                    let parameters = Some(dict["@Enabled", box e;])
                    let sql = """Select id, name, ipaddress, connection, enabled, user, password, direction, detect_frame_rate, secure from
                                 Camera where enabled=@Enabled order by feedposition
                               """
                    (sql, parameters)
                | None ->
                    let sql = """select id, name, ipaddress, connection, enabled, user, password, direction, detect_frame_rate, secure from
                                 Camera order by feedposition
                               """
                    (sql, None)
            query<CameraStream> conn sql param

        let get_camera conn (id: CameraID) =
            let sql = """Select id, Name, IpAddress, Connection, Enabled, CreatedOn, User, Password, Direction,detect_frame_rate, secure  from Camera
                         where ID = @ID """
            let (CameraID cid) = id
            let p = Some(dict["ID", box cid;])
            query_single conn sql p

        let get_camera_by_name conn (name: string) =
            let sql = "select id, Name, IpAddress, Connection, Enabled, CreatedOn, User, Password, Direction,detect_frame_rate, secure  from Camera where Name = @Name"
            let p = Some(dict["Name", box name;])
            query_single conn sql p

        let save_camera conn (camera: CameraStream) =
            //TODO: ensure that execute knows how to handle the option type.
            let sql = """insert into Camera (Name, IpAddress,Connection, Enabled, CreatedOn, User, Password, Direction, detect_frame_rate, secure )
                        VALUES (@Name, @IpAddress, @Connection, @Enabled, datetime(), @User, @Password, @Direction, @detect_frame_rate, @secure)
                        """
            let res = execute conn sql camera
            res

        let update_camera conn (camera: CameraStream) =

            let sql = """update Camera set name=@name,ipaddress=@ipaddress,
                         connection=@connection, enabled=@enabled, direction=@direction,
                         detect_frame_rate=@detect_frame_rate, secure=@secure where ID=@ID
                        """
            printfn $"%A{camera}"
            execute conn sql camera

        let delete_camera conn (id: CameraID) =
            let sql = "delete from Camera where ID=@ID"
            //this is funky
            let (CameraID cid) = id
            let data = [("@ID",box cid)] |> dict |> DynamicParameters
            execute conn sql data
