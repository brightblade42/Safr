namespace EyemetricFR
open System

module Queries = Queries.Config


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





