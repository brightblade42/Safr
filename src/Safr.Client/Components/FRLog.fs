module Safr.Client.Components.FRLog

open Fable.Core.Experimental
open Feliz
open Elmish
open Safr.Client.State
open Safr.Types.Eyemetric
//open Feliz.MaterialUI
//open Feliz.MaterialUI.MaterialTable
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub


[<ReactComponent>]
let private FRLog' (props: {| m: Model; dispatch: Dispatch<Msg>; |}) =  // hub: Hub<Action,Response>;  |}) =

    //let theme = Styles.useTheme()

    let model = props.m

    Html.div[
        prop.text "I AM THE FR LOG"
    ]
    (*
    Mui.materialTable [

        materialTable.title "FR Log"
        materialTable.columns [
            columns.column [
                column.title "Detected Face"
                column.field "detected_img" //<FRLog> (fun rd -> nameof rd.matched_face)
                column.render<FRLog> (fun rd _ ->
                   Html.img [
                       prop.src ("data:image/png;base64," + rd.detected_img)
                       prop.style [
                           style.maxHeight 125
                           style.maxWidth 110
                       ]
                    ]

                    )
                //column.initialEditValue ""
            ]
            columns.column [
                column.title "Enrolled Face"
                column.field "matched_face" //<FRLog> (fun rd -> nameof rd.matched_face)
                column.render<FRLog> (fun rd _ ->
                   Html.img [
                       prop.src ("data:image/png;base64," + rd.matched_face)
                       prop.style [
                           style.maxWidth 110
                           style.maxHeight 125
                       ]
                    ]

                    )
            ]

            columns.column [
                column.title "Name"
                column.field<FRLog> (fun rd -> nameof rd.name)
            ]
            columns.column [
                column.title "Confidence"
                column.field<FRLog> (fun rd -> nameof rd.confidence)

            ]
            columns.column [
                column.title "Camera"
                column.field<FRLog> (fun rd -> nameof rd.location)

            ]
            columns.column [
                column.title "Matched on"
                column.field<FRLog> (fun rd -> nameof rd.matched_on)
                column.type'.datetime
            ]
            columns.column [
                column.title "Status"
                column.field<FRLog> (fun rd -> nameof rd.status)
                //column.type'.boolean

            ]
        ]
        materialTable.data  (List.ofSeq model.FRLogs) //state

        //TODO: set these as options.. edit / group / etc.
        (*
        materialTable.options [
            options.grouping true
        ]
        *)

        (*
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

        ] *)
    ]
*)

let FRLog content = FRLog' content



