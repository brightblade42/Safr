module Safr.Client.RemoteApi

open Fable.Remoting.Client
open EyemetricFR.Shared.Remoting

let service =
    Remoting.createApi()
    |> Remoting.withRouteBuilder Service.RouteBuilder
    |> Remoting.buildProxy<Service>