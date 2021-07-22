namespace EyemetricFR
open System
open EyemetricFR.Identifier
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.Paravision.Types.Identification
open EyemetricFR.TPass.Types

module Queries = Queries.Config


//Thin type wrappers around the Database.

type Config(?db_path: string) =
    let def_config_db = System.IO.Path.Combine(AppContext.BaseDirectory, "data/config.sqlite")
    let db_path' = (db_path, def_config_db) ||> defaultArg
    let conn = (open_conn db_path').Value

    let get_config () =
        let conf = conn |> Queries.get_latest_config
        match conf with
        | Ok c -> c
        | Error e -> printfn $"could not retrieve a good config. %s{e.Message}"; None

    member self.get_latest_config () = get_config()
    member self.update_config conf = Queries.update_config conn conf

module Queries = Queries.Camera

type Cameras(?dbPath: string) =

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


type Enrollments(?dbPath: string) =

    let def_db_path = System.IO.Path.Combine(AppContext.BaseDirectory, "data/enrollment.sqlite")
    let pth = (dbPath, def_db_path) ||> defaultArg
    let conn = (open_conn  pth).Value


    member self.batch_enroll(enroll_infos: Result<EnrollmentInfo, string> []) = async {

       printfn "ENROLL: preparing local data store....."
       let enroll_client (enroll_info: EnrollmentInfo) = enroll_info |> self.enroll

       let res = enroll_infos
                 |> Array.map(fun x ->
                     match x with
                     | Ok en -> en |> enroll_client |> Some
                     | _     -> None
                     )
                 |> Array.filter(fun x -> x.IsSome)
                 |> Array.map (fun x-> x.Value)
       return res

    }

    member self.enroll enroll_info = Queries.Enrollment.enroll conn enroll_info
    member self.get_enrolled_details_by_id (id: string ) = Queries.Enrollment.get_enrollment conn id
    member self.delete_enrollment (id: string) = Queries.Enrollment.delete_enrollment conn id
    member self.exists (ccode: string) : Async<Result<string option,exn>> = async {
          return Queries.Enrollment.exists conn ccode
    }
    member self.delete_all_enrollments () = async {
        return Queries.Enrollment.delete_all conn
    }
