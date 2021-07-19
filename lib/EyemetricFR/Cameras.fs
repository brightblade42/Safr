namespace EyemetricFR
open System
open Eyemetric.FR
open System.Data.SQLite
open Safr.Types.Paravision.Streaming

module Queries = Queries.Camera

type Cameras(?dbPath: string) =
    let open_conn (dbPath: string) =
        //TODO: replace with real error handling
        try
            let conn = new SQLiteConnection $"Data Source=%s{dbPath};Version=3"
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn $"no bueno connection: %s{ex.Message}"
            None
    let close_conn (conn: SQLiteConnection) =
        conn.Close()
        conn.Dispose()

    let def_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/config.sqlite")
    let db_path = (dbPath, def_db_path) ||> defaultArg
    let conn = (open_conn db_path).Value //not sure about this here

    member self.get_cameras (enabled: bool option) = async {
         return Queries.get_cameras conn enabled
    }

    member self.get_camera (id: CameraID) = async {
        return Queries.get_camera conn id
    }

    member self.save_camera (cam: CameraStream) = async {
        return Queries.save_camera conn cam
    }

    member self.delete_camera (id: CameraID) = async {
        return Queries.delete_camera conn id
    }

    member self.update_camera (cam: CameraStream) = async {
        return Queries.update_camera conn cam
    }
