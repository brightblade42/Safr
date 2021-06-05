module Safr.Client.Components.FRLog

open Fable.Core.Experimental
open Feliz
open Elmish
open Safr.Client.State

open Safr.Types.Eyemetric
open Fable.SignalR.Feliz
open EyemetricFR.Shared.FRHub


    (*

       Html.img [
           prop.src ("data:image/png;base64," + rd.detected_img)
           prop.style [
               style.maxHeight 125
               style.maxWidth 110
           ]
        ]

    *)


    (*




               rows={[
               { id: 0, product: 'DevExtreme', owner: 'DevExpress' },
               { id: 1, product: 'DevExtreme Reactive', owner: 'DevExpress' },
               ]}
               columns={[
                   { name: 'id', title: 'ID' },
                   { name: 'product', title: 'Product' },
                   { name: 'owner', title: 'Owner' },

               ]}

    *)
type Row = {
    id: int
    product: string
    owner: string
}

type Column = {
    name: string
    title: string
}

type GModel = {
    Rows: Row seq
    Columns: Column seq
}
[<ReactComponent(import="FRHistoryGrid", from="../src/frhistorygrid.jsx")>]
let private FRHistoryGrid' (props: {| model: GModel |}) = React.imported()
//let private FRHistoryGrid' (props: {| model: Model |}) = React.imported()

[<ReactComponent>]
let FRHistoryGrid (props: {| model: Model; dispatch: Dispatch<Msg>; |}) =
    //we wrap this for when we need extra things from parents without mucking up our component
    //ss

    let rows=[|
       { id= 0; product= "Nookie"; owner= "DevExpress" }
       { id= 1; product= "DevExtreme Reactive"; owner= "DevExpress" }
       |]
    let columns= [|
       { name= "id"; title= "ID23" }
       { name= "product"; title= "Product" }
       { name= "owner"; title= "Owner" }
    |]
    let pp = { Rows = rows; Columns=columns }
    FRHistoryGrid' {| model=pp |}




