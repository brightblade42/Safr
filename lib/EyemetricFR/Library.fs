namespace EyemetricFR
open EyemetricFR.Identifier
open EyemetricFR.Paravision.Types.Identification
open EyemetricFR.TPass.Types

module TPE = EyemetricFR.Utils.TPassEnrollment   //alias, if yer into that whole brevity thing man.

module Funcs =

    let init_tpass (conf: Configuration) = async {
        let tpass_agent = TPassService(conf.tpass_api_addr.Trim(),UserPass (conf.tpass_user, conf.tpass_pwd),  false)

        let! is_init = tpass_agent.initialize()
        return
            match is_init with
            | Success _ -> Some tpass_agent
            | _ -> None     //should we log, retru or none?
    }

    let private delete_identity (ident_agent: FaceIdentification) (id: string) = async {
          let! res =  id |> ident_agent.delete_identity
          return res
    }
    let private delete_all_identities (ident_agent: FaceIdentification) (idents: Identity list): Async<Result<Identity,string> []>  = async {

        let del_results = idents |> Seq.map ( fun x -> (ident_agent,x.id) ||> delete_identity) |> Async.Parallel
        return! del_results
    }

    let  delete_enrollment (ident_agent: FaceIdentification) (enroll_agent: Enrollments) (id: string)= async {
        let! del_id = (ident_agent, id) ||> delete_identity
        let del_en = id |> enroll_agent.delete_enrollment
        return del_en
      }
    //local enrollments are what we store locallay. a combination of pvid, an image, and decriptive info.
    //Note: the naming is a little weird because in this type we are referring to an enrollment
    //as the composite of an identity+local_enrollment
    let private delete_all_local_enrollments (enroll_agent: Enrollments) = async {
        return! enroll_agent.delete_all_enrollments ()
    }

    let delete_all_enrollments (ident_agent: FaceIdentification) (enroll_agent: Enrollments) = async {
        //TODO: revisit this error handling. Get rid of filthy Exceptions

        //get all the pv idents.
        let! ids  = ident_agent.get_identities() //TODO: determine why this is a prop and not a func.
        let! deleted_idents =
            match ids with
            | Ok ids -> (ident_agent, ids) ||> delete_all_identities
            | Error e -> failwith ( sprintf "could not get current identity list from paravision: %s" e)

        let! deleted_locals = enroll_agent |> delete_all_local_enrollments

        return deleted_locals
    }



