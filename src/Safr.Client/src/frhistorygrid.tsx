import React from "react";
import {
    DataTypeProvider,
    PagingState,
    SearchState,
    IntegratedFiltering,
    IntegratedPaging,

} from "@devexpress/dx-react-grid";

import { IconButton} from "@material-ui/core";
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    Toolbar,
    SearchPanel
} from "@devexpress/dx-react-grid-material-ui";

const ImageFormatter = ({value}) => {
    const imgf = "data:image/png;base64, " + value
    return (
        <div className="flex space-x-2">
           <img src={imgf} className="w-28 h-28 rounded-md shadow-lg" alt="enrolled face"/>
        </div>)
}

const ImageTypeProvider = props => (
     <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
);

export const FRHistoryGrid = ({model, onLoad}) => {

    const [imageColumns] = React.useState(['detected_img','matched_face']);
    const [pageSizes] = React.useState([5,10,15, 0])

    let on_load = () => {
        onLoad()
    }
    const columns = [

        {name: "matched_face", title: "ENROLLED"},
        { name: "name", title: "NAME"},
        { name: "confidence", title: "CONFIDENCE"},
        { name: "status", title: "STATUS"},
        { name: "matched_on", title: "MATCHED ON"},
        { name: "location", title: "LOCATION"},
    ]

    return (
        <div className="flex flex-col">
            <button className="btn-indigo w-32 mt-4 ml-3" onClick={on_load}>Load History</button>
            <div className="px-6 fr-history">
               <Grid
                   rows={model.Rows}
                   columns={columns} >

                   <ImageTypeProvider for={imageColumns}/>
                   <SearchState defaultValue=""/>
                   <IntegratedFiltering />
                   <PagingState
                       defaultCurrentPage={0}
                       defaultPageSize={10} />
                   <IntegratedPaging />
                   <Table/>
                   <TableHeaderRow/>
                   <Toolbar/>
                   <SearchPanel/>
                   <PagingPanel  pageSizes={pageSizes}/>
               </Grid>
           </div>

        </div>

    )


}