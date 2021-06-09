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

/*
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
*/
export const CameraSettings = (props) => {

     const on_start_streams = () =>  {
        console.log("start streams request from jsx");
        props.funcs.start_all_streams();

    };
    //const [imageColumns] = React.useState(['detected_img','matched_face']);
    const  on_stop_streams = () => {
        console.log("stop streams request from jsx");
        props.funcs.stop_all_streams();

    }
    const [pageSizes] = React.useState([5,10,15, 0]);
    const columns = [

        {name: "name", title: "Name"},
        { name: "address", title: "Address"},
        { name: "direction", title: "Direction"},
        { name: "enabled", title: "Enabled"},
        { name: "confidence", title: "Confidence"},
    ]

    return (

       <div className="flex flex-col" >
           <div className="text-xl py-2 font-semibold shadow-xl border-2 d border-gray-300
           text-bgray-700 text-center bg-bgray-200">Camera Settings</div>
           <div className="p-6 bg-bgray-100 fr-history"  >
               <Grid
                   rows={props.model.Rows}
                   columns={columns} >

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


           <div className="text-xl py-2 font-semibold text-bgray-600 text-center bg-bgray-200">
               <div className="flex space-x-1 justify-end mr-4">
                   <button
                       className="btn-indigo text-bgray-200 text-sm font-bold"
                       onClick={() => on_start_streams()}
                   >Start All</button>
                   <button
                       className="btn-indigo text-bgray-200 text-sm font-bold"
                       onClick={() => on_stop_streams()}
                   >Stop All</button>

               </div>
           </div>

       </div>

    )


}
