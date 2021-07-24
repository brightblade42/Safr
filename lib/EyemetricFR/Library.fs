namespace EyemetricFR
open System
open System.IO
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.TPass.Types

module Queries = Queries.Config

///Thin type wrappers around the Database.

type Config(?db_path: string) =

    let db_path'      = defaultArg db_path (Path.Combine(AppContext.BaseDirectory, "data/config.sqlite"))
    let conn          = (open_conn db_path').Value

    member self.get_latest_config () =
        let conf = Queries.get_latest_config conn
        match conf with
        | Ok c -> c
        | Error e -> printfn $"could not retrieve a good config. %s{e.Message}"; None

    member self.update_config conf = Queries.update_config conn conf

module Queries = Queries.Camera

type Cameras(?dbPath: string) =

    let db_path = defaultArg dbPath (Path.Combine(AppContext.BaseDirectory, "data/config.sqlite"))
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

module Queries = Queries.Enrollment

type Enrollments(?dbPath: string) =

    let path  = defaultArg dbPath (Path.Combine(AppContext.BaseDirectory, "data/enrollment.sqlite"))
    let conn  = (open_conn  path).Value

    member self.batch_enroll(enroll_infos: Result<EnrollmentInfo, string> []) = async {

       printfn "ENROLL: BATCH ENROLL STARTED...."

       let res = enroll_infos
                 |> Array.map(fun x ->
                     match x with
                     | Ok en -> self.enroll en |> Some
                     | _     -> None
                     )
                 |> Array.filter(fun x -> x.IsSome)
                 |> Array.map (fun x-> x.Value)
       return res

    }

    member self.enroll enroll_info = Queries.enroll conn enroll_info

    member self.get_enrolled_details_by_id (id: string ) = Queries.get_enrollment conn id

    member self.delete_enrollment (id: string) = Queries.delete_enrollment conn id

    member self.exists (ccode: string) : Async<Result<string option,exn>> = async {
          return Queries.exists conn ccode
    }

    member self.delete_all_enrollments () = async {
        return Queries.delete_all conn
    }
