namespace EyemetricFR
open System
open EyemetricFR.TPass.Types
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

