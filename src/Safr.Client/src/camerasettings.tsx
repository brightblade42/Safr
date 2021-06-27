import React from "react";
import {
    DataTypeProvider,
    PagingState,
    SearchState,
    IntegratedFiltering,
    IntegratedPaging,
    EditingState

} from "@devexpress/dx-react-grid";

import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
    Toolbar,
    SearchPanel
} from "@devexpress/dx-react-grid-material-ui";
import {LoginComponent} from "./login";

const getRowId = row => row.id

const CamEnabledFormatter = ({ value }) =>

    <div className={`w-20 flex space-x-1 mr-2 border border-green-900
    uppercase text-sm font-extrabold ${value ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-700'} py-1 px-2
    rounded-md flex-shrink-0`}>{value ? 'Enabled' : 'Disabled'}</div>


//<Chip className="bg-green-200 text-green-800 font-semibold" label={value ? 'Enabled' : 'Disabled'} />;
const CamEnabledEditor = ({ value, onValueChange }) => (
    <Select
        input={<Input />}
        value={value ? 'Enabled' : 'Disabled'}
        onChange={event => onValueChange(event.target.value === 'Enabled')}
        style={{ width: '100%' }}
    >
        <MenuItem value="Enabled">
            Enabled
        </MenuItem>
        <MenuItem value="Disabled">
            Disabled
        </MenuItem>
    </Select>
);

const CamEnabledTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CamEnabledFormatter}
        editorComponent={CamEnabledEditor}
        {...props}
    />
);

const CamDirectionFormatter = ({ value }) => {
    let inout;
    if (value) {
        inout = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
        </svg>
    } else {

        inout = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>

    }
    return(
    <div
        className="w-14 flex space-x-1 mr-2 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
        {inout}
        <span>{value ? "IN" : "OUT"}</span>
    </div>
    )
}
const CamDirectionEditor = ({ value, onValueChange }) => (
    <Select
        input={<Input />}
        value={value ? 'IN' : 'OUT'}
        onChange={event => onValueChange((event.target.value === 'IN') ? 1 : 0)}
        style={{ width: '100%' }}
    >
        <MenuItem value="IN">
            IN
        </MenuItem>
        <MenuItem value="OUT">
            OUT
        </MenuItem>
    </Select>
);

const CamDirectionTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CamDirectionFormatter}
        editorComponent={CamDirectionEditor}
        {...props}
    />
);


export const CameraSettings = (props) => {

     const gmodel = props.gmodel;
     const model = props.model;
     const funcs = props.funcs;

     const [editingRowIds, setEditingRowIds] = React.useState([]);
     const [addedRows, setAddedRows]         = React.useState([]);
     const [rowChanges, setRowChanges]       = React.useState({});

    const changeAddedRows = (value) => {
        console.log("change add rows function")
        //const initialized = value.map(row => (Object.keys(row).length ? row : { city: 'Tokio' }));
        //setAddedRows(initialized);
    };

    const commitChanges = ({ added, changed, deleted }) => {
        console.log("COMMIT THE CHANGES HERE  ADD/CHANGE/DELETE....")

        //console.log("EDITING ROW IDS ===")
        //console.log(editingRowIds)
        let changedRows;
        if (added) {
            console.log("WE Would be adding stuff")
            /*
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];

             */
        }
        if (changed) {
            console.log(changed);
            let id = Object.keys(changed)[0];

            //not using internal state so this isn't neccessary. from the example code
            //gmodel.Rows.map(row => (changed[row.id] ? {...row, ...changed[row.id] } : row));

            let obj = changed[id]
            if (obj === undefined) {
                console.log("you so fine.. yeah, undefined. Bazinga")
                return;
            }
            let crow = gmodel.Rows.find(x =>  x.id === parseInt(id));
            let nrow = Object.assign(crow, obj)

            //console.log(nrow)
            funcs.update_camera(nrow)
            //changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
            console.log("DELETE THE THING!!")
            //const deletedSet = new Set(deleted);
            //changedRows = rows.filter(row => !deletedSet.has(row.id));
        }
        //setRows(changedRows);

    };

     const on_start_streams = () =>  {
        console.log("start streams request from jsx");
        funcs.start_all_streams();

    };
    //const [imageColumns] = React.useState(['detected_img','matched_face']);
    const  on_stop_streams = () => {
        console.log("stop streams request from jsx");
        funcs.stop_all_streams();

    }
    const [pageSizes] = React.useState([5,10,15, 0]);
    const columns = [

        {name: "name", title: "NAME"},
        { name: "ipaddress", title: "ADDRESS"},
        { name: "direction", title: "DIRECTION"},
        { name: "enabled", title: "STATUS"},
        //{ name: "streaming", title: "Streaming"}
        //{ name: "confidence", title: "Confidence"},
    ]

    const [camEnabledColumn] = React.useState(['enabled'])
    const [camDirectionColumn] = React.useState(['direction'])

    const streams_inflight = () => {
        return model.StartingAllStreams || model.StoppingAllStreams
    }


    return (

       <div className="absolute top-[460px] min-h-3 flex flex-col" >
           <div className="text-xl py-2 font-semibold shadow-xl border-2  border-gray-300
           text-bgray-700 text-center bg-bgray-200">Camera Settings</div>
           <div className="p-6 bg-bgray-100 fr-history"  >
               <Grid
                   rows={gmodel.Rows}
                   columns={columns}
                   getRowId={getRowId}
               >
                   <CamEnabledTypeProvider
                       for={camEnabledColumn}
                   />
                   <CamDirectionTypeProvider
                       for={camDirectionColumn}
                   />
                    <EditingState
                        editingRowIds={editingRowIds}
                        onEditingRowIdsChange={setEditingRowIds}
                        rowChanges={rowChanges}
                        onRowChangesChange={setRowChanges}
                        addedRows={addedRows}
                        onAddedRowsChange={changeAddedRows}
                        onCommitChanges={commitChanges}
                    />
                   <SearchState defaultValue=""/>
                   <IntegratedFiltering />
                   <PagingState
                       defaultCurrentPage={0}
                       defaultPageSize={5} />
                   <IntegratedPaging />
                   <Table/>
                   <TableHeaderRow/>
                   <TableEditRow/>
                   <TableEditColumn
                       showAddCommand={!addedRows.length}
                       showEditCommand
                       showDeleteCommand
                   />
                   <Toolbar/>
                   {/*   <SearchPanel/> */}
                   <PagingPanel  pageSizes={pageSizes}/>
               </Grid>
           </div>


           <div className="text-xl py-2 font-semibold text-bgray-600 text-center bg-bgray-200">
               <div className="flex space-x-1 justify-end mr-4">
                   <button
                       className="btn-indigo text-bgray-200 text-sm font-bold disabled:bg-gray-400"
                       disabled={streams_inflight()}
                       onClick={() => on_start_streams()}
                   >Start All</button>
                   <button
                       className="btn-indigo text-bgray-200 text-sm font-bold disabled:bg-gray-400"
                       disabled={streams_inflight()}
                       onClick={() => on_stop_streams()}
                   >Stop All</button>

               </div>
           </div>

       </div>

    )


}
