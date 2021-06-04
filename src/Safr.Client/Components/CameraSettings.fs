module Safr.Client.Components.CameraSettings

open Fable.Core
open Fable.Core.Experimental
open Feliz
open Feliz.UseElmish
open Elmish
open Safr.Client.State
open Fable.SignalR.Feliz
open Safr.Types.Paravision.Streaming

open EyemetricFR.Shared.FRHub
//open Feliz.MaterialUI
//open Feliz.MaterialUI.MaterialTable


type private RowData = {
    name: string
    address: string
    //direction: string
    direction: int
    enabled: bool
    confidence: float
}


[<ReactComponent>]
let private CameraSettings' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) = // hub: Hub<Action,Response>; |}) =
//let private CameraSettings' (props: {| name: string |}) = //(props: {| m: Model; dispatch: Dispatch<Msg> |}) =
    let state , setState =
        [
            {
                name = "Main Entrance"
                address = "eyemetric.camera1.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Side Entrance"
                address = "eyemetric.camera2.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Main Exit"
                address = "eyemetric.camera3.com"
                direction = 0 //"Check out"
                enabled =  false
                confidence = 98.0
            }
            {
                name = "Main Entrance 2"
                address = "eyemetric.camera1.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Side Entrance 2"
                address = "eyemetric.camera2.com"
                direction = 1 //"Check in"
                enabled =  true
                confidence = 98.0
            }
            {
                name = "Main Exit 3"
                address = "eyemetric.camera3.com"
                direction =  0 //"Check out"
                enabled =  false
                confidence = 98.0
            }
             ] |> React.useState


    Html.div [
        prop.text "CAMERA SETTINGS PLACEHOLDER"
    ]
    //let theme = Styles.useTheme()

    (*
    Mui.materialTable [

        prop.style [
            //style.backgroundColor theme.palette.background.``default``

            //style.borderStyle.solid
            //style.borderColor theme.palette.primary.light
            //style.borderWidth 3
        ]
        materialTable.title "Camera Settings"
        materialTable.columns [
            columns.column [
                column.title "Name"
                column.field<RowData> (fun rd -> nameof rd.name)
            ]
            columns.column [
                column.title "Address"
                column.field<RowData> (fun rd -> nameof rd.address)
                column.initialEditValue ""
            ]
            columns.column [
                column.title "Direction"
                column.field<RowData> (fun rd -> nameof rd.direction)

                column.lookup<int,string> [
                    (1, "Check In")
                    (0, "Check Out")
                ]

            ]
            columns.column [
                column.title "Confidence"
                column.field<RowData> (fun rd -> nameof rd.confidence)
                column.initialEditValue 98.0
                //column.type'.numeric
            ]
            columns.column [
                column.title "Enabled"
                column.field<RowData> (fun rd -> nameof rd.enabled)
                column.type'.boolean

            ]
            (*
            columns.column [
                column.title "Some DateTime"
                column.field "someDateTime"
                column.type'.datetime
            ]
            *)
        ]
        materialTable.data state

        //TODO: set these as options.. edit / group / etc.

        materialTable.options [
            //options.grouping true
            options.headerStyle [
                //style.color theme.palette.primary.light
            ]
        ]


        materialTable.editable [
            editable.onRowAdd<RowData> (fun newData ->
                promise {
                    state @ [ newData ]
                    |> setState
                }
            )
            editable.onRowUpdate<RowData> (fun newData oldData ->
                promise {
                    state
                    |> List.map (fun d -> if d = oldData then newData else d)
                    |> setState
                }
            )
            editable.onRowDelete<RowData> (fun oldData ->
                promise {
                    state
                    |> List.filter (fun d -> d <> oldData)
                    |> setState
                }
            )
        ]
    ] *)


let CameraSettings content = CameraSettings' content
