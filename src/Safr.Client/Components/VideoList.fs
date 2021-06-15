module Safr.Client.Components.VideoList

open Safr.Client.Components.Video //.VideoPlayer //yikes
open Safr.Client.AppState
open Feliz
open Elmish
//open Fable.SignalR.Feliz
//open EyemetricFR.Shared.FRHub


[<ReactComponent>]
let VideoList (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>;  |}) =
    Html.div [

            prop.className ["overflow-x-scroll flex bg-gray-50 pb-8 ml-4 min-h-[365px]" ]

            prop.children [
                if props.m.AvailableCameras.Length = 0 then
                    Html.div [
                        prop.className [ "text-7xl m-auto text-gray-200" ]
                        prop.text "Cameras"
                    ]
                (*
                AVid {| hostname="192.168.0.109"; camname="Main Entrance" |}
                AVid {| hostname="192.168.0.105"; camname="Library Entrance"|}
                AVid {| hostname="192.168.0.109"; camname="Bay Door" |}
                AVid {| hostname="192.168.0.105"; camname="Back Exit" |}
                *)
                for cam in props.m.AvailableCameras  do
                    if cam.enabled then
                        AVid {| hostname=cam.ipaddress; camname=cam.name |}
                    else
                        Html.div [
                            prop.className ["w-full max-w-lg flex-shrink-0 flex flex-col mr-1"]
                            prop.children [
                                Html.div [
                                    prop.className ["uppercase
                                         rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md
                                         tracking-wide text-bgray-700 bg-bgray-300"
                                     ]

                                    prop.children [
                                        Html.span [
                                            prop.text cam.name
                                        ]
                                        Html.div [
                                            prop.className ["bg-gray-400 min-h-[288px]"]
                                            prop.children [
                                                Html.span [
                                                    prop.className ["inline-block text-4xl text-gray-300 my-24"]
                                                    prop.text "Disabled"

                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                //    VideoPlayerContainer {| cam=cam; m=props.m; dispatch=props.dispatch; |} // hub=props.hub |}
            ]
        ]
