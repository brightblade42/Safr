module Safr.Client.Router

open Browser.Types
open Feliz.Router
open Fable.Core.JsInterop

type Page =
    | HomePage
    | FRHistoryPage
    | ScratchPage

[<RequireQualifiedAccess>]
module Page =
    let defaultPage = Page.HomePage

    let parseFromUrlSegments = function
        | [ "scratch" ] -> Page.ScratchPage
        | [ "frhistory" ] -> Page.FRHistoryPage
        | [ ] -> Page.HomePage
        | _ -> defaultPage

    let noQueryString segments : string list * (string * string) list = segments, []

    let toUrlSegments = function
        | Page.HomePage -> [ ] |> noQueryString
        | Page.FRHistoryPage -> [ "frhistory" ] |> noQueryString
        | Page.ScratchPage ->
            printfn "SCRATCH MATCH"
            [ "scratch" ] |> noQueryString

[<RequireQualifiedAccess>]
module Router =
    let goToUrl (e:MouseEvent) =
        e.preventDefault()
        let href : string = !!e.currentTarget?attributes?href?value
        Router.navigatePath href

    let navigatePage (p:Page) = p |> Page.toUrlSegments |> Router.navigatePath