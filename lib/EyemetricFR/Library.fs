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



