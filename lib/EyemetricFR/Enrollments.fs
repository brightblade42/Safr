namespace EyemetricFR

open System
open Eyemetric.FR
open System.Data.SQLite

type Enrollments(?dbPath: string) =

    let def_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/enrollment.sqlite")
    let open_conn (dbPath: string) =
        //TODO: replace with real error handling
        try
            let conn = new SQLiteConnection $"Data Source=%s{dbPath};Version=3"
            conn.Open()
            Some conn
        with
        | :? System.Exception as ex ->
            printfn $"no bueno moreno connection: %s{ex.Message}"
            None
    let pth = (dbPath, def_db_path) ||> defaultArg
    let conn = (open_conn  pth).Value

    member self.enroll enroll_info = Queries.Enrollment.enroll conn enroll_info
    member self.get_enrolled_details_by_id (id: string ) = Queries.Enrollment.get_enrollment conn id
    member self.delete_enrollment (id: string) = Queries.Enrollment.delete_enrollment conn id
    member self.exists (ccode: string) : Async<Result<string option,exn>> = async {
          return Queries.Enrollment.exists conn ccode
    }
    member self.delete_all_enrollments () = async {
        return Queries.Enrollment.delete_all conn
    }

