module Safr.Client.Router

open Browser.Types
open Feliz.Router
open Fable.Core.JsInterop

type Page =
    | HomePage
    | FRHistoryPage

[<RequireQualifiedAccess>]
module Page =
    let defaultPage = Page.HomePage

    let parseFromUrlSegments = function
        | [ "frhistory" ] -> Page.FRHistoryPage
        | [ ] -> Page.HomePage
        | _ -> defaultPage

    let noQueryString segments : string list * (string * string) list = segments, []

    let toUrlSegments = function
        | Page.HomePage -> [ ] |> noQueryString
        | Page.FRHistoryPage -> [ "frhistory" ] |> noQueryString

[<RequireQualifiedAccess>]
module Router =
    let goToUrl (e:MouseEvent) =
        e.preventDefault()
        let href : string = !!e.currentTarget?attributes?href?value
        Router.navigatePath href

    let navigatePage (p:Page) = p |> Page.toUrlSegments |> Router.navigatePath