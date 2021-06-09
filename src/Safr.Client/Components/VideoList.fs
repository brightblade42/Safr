module Safr.Client.Components.VideoList

open Safr.Client.Components.Video //.VideoPlayer //yikes
open Safr.Client.State
open Feliz
open Elmish
//open Fable.SignalR.Feliz
//open EyemetricFR.Shared.FRHub


[<ReactComponent>]
let VideoList (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    Html.div [

            prop.className ["overflow-x-scroll flex bg-gray-50 pb-8 ml-4 " ]

            prop.children [
                (*
                AVid {| hostname="192.168.0.109"; camname="Main Entrance" |}
                AVid {| hostname="192.168.0.105"; camname="Library Entrance"|}
                AVid {| hostname="192.168.0.109"; camname="Bay Door" |}
                AVid {| hostname="192.168.0.105"; camname="Back Exit" |}
                *)
                for cam in props.m.AvailableCameras  do
                    AVid {| hostname=cam.ipaddress; camname=cam.name |}
                //    VideoPlayerContainer {| cam=cam; m=props.m; dispatch=props.dispatch; |} // hub=props.hub |}
            ]
        ]
