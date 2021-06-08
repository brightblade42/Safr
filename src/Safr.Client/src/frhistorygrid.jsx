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
           <img src={imgf} className="w-28 h-28 rounded-md shadow-lg" alt="smelly cat"/>
        </div>)
}

const ImageTypeProvider = props => (
     <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
);

export const FRHistoryGrid = (props) => {

    const [imageColumns] = React.useState(['detected_img','matched_face']);
    const [pageSizes] = React.useState([5,10,15, 0]);
    const columns = [

        //{ name: "identity", title: "Id"},
        {name: "matched_face", title: "Enrolled "},
        //{name: "detected_img", title: "face"},
        { name: "name", title: "name"},
        { name: "confidence", title: "confidence"},
        { name: "status", title: "status"},
        { name: "matched_on", title: "matched on"},
        { name: "location", title: "location"},
    ]

    return (
        <div className="p-6 fr-history">
           <Grid
               rows={props.model.Rows}
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

    )


}