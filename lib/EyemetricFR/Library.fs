namespace Eyemetric.FR
open System
open Eyemetric.FR.Enrollment
open Eyemetric.FR.Types
open Paravision
open Paravision.Identification
open Safr.Types.Paravision.Identification
open TPass.Client.Service

open Safr.Types.TPass


module TPE = Eyemetric.FR.Utils.TPassEnrollment   //alias, if yer into that whole brevity thing man.
module GE = Eyemetric.FR.Utils.GeneralEnrollment

module Funcs =
    let init_detect_agent(conf: Configuration) = async {
        return  FaceDetection(conf.vid_streaming_addr.Trim(), conf.detection_socket_addr)
        //return  DetectionAgent(conf.vid_streaming_addr.Trim(), conf.detection_socket_addr)
    }

    let init_tpass (conf: Configuration) = async {
        let tpass_agent = TPassAgent(conf.tpass_api_addr.Trim(),UserPass (conf.tpass_user, conf.tpass_pwd),  false)

        let! is_init = tpass_agent.initialize()
        return
            match is_init with
            | Success _ -> Some tpass_agent
            | _ -> None     //should we log, retru or none?
    }

    let init_ident_agent(conf: Configuration) = async {
        return IdentificationAgent(conf.pv_api_addr)
    }

    let init_enroll_agent () = async {
        return EnrollmentAgent(System.IO.Path.Combine(AppContext.BaseDirectory, "data/enrollment.sqlite"))
    }

    let enroll_tpass_clients (tp_agent: TPassAgent) (ident_agent: IdentificationAgent) (enroll_agent: EnrollmentAgent) (clients: TPassClient []) = async {

        //TODO: strategy for logging any errors along the way.
        let! clients_with_images = (tp_agent, clients) ||> TPE.combine_with_image

        //TODO: do an ident check to see how close a face might match before enrolling them.

        let! enrollment_infos_res = (ident_agent, clients_with_images) ||> TPE.create_enrollments //create idents
        let! enrolled = (enroll_agent, enrollment_infos_res) ||> Utils.do_enroll //local enrollment

        let to_vals (info: Result<EnrollmentInfo, string>) =
                match info with
                | Ok en ->
                    let tp = en.tpass_client.Value
                    Some (TPassClient.ccode tp, en.identity.id)
                | Error e -> None

        let do_register (vals: int * string) = async {
            let (ccode, pv) = vals
            return! (string ccode, pv) ||> tp_agent.update_pv
        }

        let! registered =  //let tpass know about pv ids
            enrollment_infos_res
            |> Seq.map to_vals
            |> Seq.filter (fun x -> x.IsSome)
            |> Seq.map (fun x -> x.Value)
            |> Seq.map do_register
            |> Async.Parallel

        printfn "------- TPASS REG ------"
        printfn "%A" registered
        //TODO: return detailed information about enrollment? or leave that to a database query?
        return enrolled
    }
    let enroll_general (ident_agent: IdentificationAgent) (enroll_agent: EnrollmentAgent) (files: string seq) = async {

        //TODO: Async things in Utils mod are not as elegant as they should be. I've kludged it up a bit.
        let gen_info_with_images =
            files
            |> GE.create_general_info_seq
            |> GE.combine_with_image_async

        let! enrollments = (ident_agent, gen_info_with_images) ||>  GE.create_enrollments
        let! enrolled = (enroll_agent, enrollments) ||> Utils.do_enroll

        return enrolled
    }
    let private delete_identity (ident_agent: IdentificationAgent) (id: string) = async {
          let! res =  id |> ident_agent.delete_identity
          return res
    }
    let private delete_all_identities (ident_agent: IdentificationAgent) (idents: Identity list): Async<Result<Identity,string> []>  = async {

        let del_results = idents |> Seq.map ( fun x -> (ident_agent,x.id) ||> delete_identity) |> Async.Parallel
        return! del_results
    }

    let  delete_enrollment (ident_agent: IdentificationAgent) (enroll_agent: EnrollmentAgent) (id: string)= async {
        let! del_id = (ident_agent, id) ||> delete_identity
        let del_en = id |> enroll_agent.delete_enrollment
        return del_en
      }
    //local enrollments are what we store locallay. a combination of pvid, an image, and decriptive info.
    //Note: the naming is a little weird because in this type we are referring to an enrollment
    //as the composite of an identity+local_enrollment
    let private delete_all_local_enrollments (enroll_agent: EnrollmentAgent) = async {
        return! enroll_agent.delete_all_enrollments ()
    }

    let delete_all_enrollments (ident_agent: IdentificationAgent) (enroll_agent: EnrollmentAgent) = async {
        //TODO: revisit this error handling. Get rid of filthy Exceptions

        //get all the pv idents.
        let! ids  = ident_agent.get_identities //TODO: determine why this is a prop and not a func.
        let! deleted_idents =
            match ids with
            | Ok ids -> (ident_agent, ids) ||> delete_all_identities
            | Error e -> failwith ( sprintf "could not get current identity list from paravision: %s" e)

        let! deleted_locals = enroll_agent |> delete_all_local_enrollments

        return deleted_locals
    }

    //Unneccesary
    let check_existence (enroll_agent: EnrollmentAgent) (ccode: string) = async {
        return! ccode |> enroll_agent.exists
    }

    //unnecessary
    let  get_enrollment (enroll_agent: EnrollmentAgent) (pi: PossibleMatch) = async {
        let enroll_info = pi |> enroll_agent.get_enrolled_details
        return enroll_info
    }

    let get_enrollment_by_id (enroll_agent: EnrollmentAgent) (id: string) = async {
        let enroll_info = id |> enroll_agent.get_enrolled_details_by_id
        return enroll_info
    }

