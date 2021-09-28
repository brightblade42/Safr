import React from "react";
import {
    DataTypeProvider,
    PagingState,
    SearchState,
    IntegratedFiltering,
    IntegratedPaging,
    EditingState

} from "@devexpress/dx-react-grid";

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
    Toolbar
} from "@devexpress/dx-react-grid-material-ui";
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import {CheckIn, CheckOut} from "./heroicons";
import {DateTime} from 'luxon';
import {OKCancelDialog} from "./dialogs";
import {AppState} from "./appstate";


const getRowId = row => row.id

const CamEnabledEditor = (props) => {
        let value= props.value;
        let onValueChange = props.onValueChange
        return (
            <Select
                input={<Input />}
                value={value ? 'Enabled' : 'Disabled'}
                onChange={event => onValueChange(event.target.value === 'Enabled')}
                style={{ width: '100%' }} >
                <MenuItem value="Enabled">
                    Enabled
                </MenuItem>
                <MenuItem value="Disabled">
                    Disabled
                </MenuItem>
            </Select>
        )
}

const CamDirectionEditor = ({ value, onValueChange }) => (
    <Select
        input={<Input />}
        value={value ? 'IN' : 'OUT'}
        onChange={event => onValueChange((event.target.value === 'IN') ? 1 : 0)}
        style={{ width: '100%' }} >
            <MenuItem value="IN"> IN </MenuItem>
            <MenuItem value="OUT"> OUT </MenuItem>
    </Select>
);

const CamDirectionFormatter = (props) => {
    let value = props.value;

    return(
        <div
            className="w-[5rem] flex justify-start items-center flex-shrink-0 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
            {value ? <CheckIn /> : <CheckOut/> }
            <span className="ml-2">{value ? "IN" : "OUT"}</span>
        </div>
    )
}
const CamDirectionTypeProvider = props => {
    return (
        <DataTypeProvider
            formatterComponent={CamDirectionFormatter}
            editorComponent={CamDirectionEditor}
            {...props}
        />
    )};



let BuildCamEnabledFormatter = (onclick, is_busy) => {


    return  ({ value, row }) => {

        let start_or_stop = row.streaming ? "STOP" : "START";
        let busy = is_busy()

        if (row.updating) {
            return (
                <div className="flex justify-between">
                    <div className={`w-24 flex space-x-1 mr-2 border border-green-900
                    uppercase text-sm font-extrabold bg-yellow-100 text-yellow-700 py-1 px-2
                    rounded-md flex-shrink-0`}>Updating..</div>
                    <div className="mr-12">
                        <button disabled={true} onClick={(e) => onclick(row)} className="w-20 btn-light-indigo disabled:bg-gray-400 text-sm ">{start_or_stop}</button>
                    </div>
                </div>
            )
        }
        else {
            let msg = value ? 'Enabled' : 'Disabled'

            return (
                <div className="flex justify-between">
                    <div className={`w-20  flex  space-x-1 mr-2 border border-green-900
                    uppercase text-sm font-extrabold ${value ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-700'} py-1 px-2
                    rounded-md flex-shrink-0`}>{msg}</div>
                    <div className="mr-12">
                        <button disabled={busy} onClick={(e) => onclick(row)}
                                className="w-20 btn-light-indigo disabled:bg-gray-400 text-sm">{start_or_stop}</button>

                    </div>

                </div>
            )
        }

    }
}


export function CameraSettings(props) {

    const app_state: AppState = props.state
    const funcs = props.funcs;


    const [editingRowIds, setEditingRowIds] = React.useState([]);
    const [addedRows, setAddedRows]         = React.useState([]);
    const [rowChanges, setRowChanges]       = React.useState({});
    const [deletedRow, setDeletedRow]       = React.useState(0);


    const [pageSizes] = React.useState([5,10,15, 0]);
    const columns = [

        //{name: "id", title: "ID"},
        {name: "name", title: "NAME"},
        { name: "ipaddress", title: "ADDRESS"},
        { name: "direction", title: "DIRECTION"},
        { name: "enabled", title: "STATUS"},
    ]

    const [camEnabledColumn] = React.useState(['enabled'])
    const [camDirectionColumn] = React.useState(['direction'])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const handle_start_or_stop = (row) => {
        console.log("handle start or stop")
        if (row.streaming) {
            funcs.stop_camera(row)
        }
        else {
            funcs.start_camera(row)
        }


    }


    const handle_cancel = () => {
        setIsDeleteDialogOpen(false)
    }

    const handle_delete = () => {
        setIsDeleteDialogOpen(false)
        console.log("handle delete camera");
        funcs.delete_camera(deletedRow)
    }

    const any_cams_updating = () => {
        let any_updates = false;
        app_state.available_cameras.forEach(r => {
            if (r.updating) {
                any_updates = true;
            }
        });

        return any_updates;
    }

    const streams_inflight = () => {
        return app_state.starting_all_streams || app_state.stopping_all_streams
    }

    const is_busy = () => {
        return any_cams_updating() || streams_inflight()
    }

    const CamEnabledTypeProvider = props => (
        <DataTypeProvider
            formatterComponent={BuildCamEnabledFormatter(handle_start_or_stop, is_busy)}
            editorComponent={CamEnabledEditor}
            {...props}
        />
    );

    const changeAddedRows = (value) => {
        const initialized = value.map(row => (Object.keys(row).length ? row : { direction: 1, enabled: true }));
        setAddedRows(initialized);
    };

    const commitChanges = ({ added, changed, deleted }) => {

        if (added) {
            let addRow = added[0];
            let nrow = Object.assign(addRow, {id: 0} );

            funcs.add_camera(nrow);
        }
        if (changed) {
            let id = Object.keys(changed)[0];

            let changed_row = changed[id]
            if (changed_row === undefined) {
                console.log("you so fine.. yeah, undefined. Bazinga")
                return;
            }
            let crow = app_state.available_cameras.find(x =>  x.id === parseInt(id));
            let new_row = Object.assign(crow, changed_row)

            //TODO: UPDATE CAMERA
             funcs.update_camera(new_row)
        }
        if (deleted) {

            setDeletedRow(deleted[0])
            setIsDeleteDialogOpen(true)
        }

    };

    const on_start_streams = () =>  {
        console.log("on start streams called");
        funcs.start_all_streams();
    };
    const  on_stop_streams = () => {
        console.log("on stop streams called");
        funcs.stop_all_streams();
    }

    const renderDialog = () => {
         if (isDeleteDialogOpen) {
             console.log(deletedRow);
             let row = app_state.available_cameras.find(r => r.id === deletedRow);
             let confirm_desc = "Are you sure you want to delete " + row.name + " ?";
             let confirm_msg = "Delete"
             let title = "Delete Camera"
            return (<OKCancelDialog isopen={true} onConfirm={handle_delete}
                                    onCancel={handle_cancel}
                                    confirm_desc={confirm_desc}
                                    confirm_msg={confirm_msg}
                                    title={title}
            />)
        }
    }

    return (

       <div className="absolute top-[386px] min-h-3 flex flex-col shadow-2xl" >
           <div className="text-xl py-2 font-semibold shadow-xl border-2  border-gray-300
             text-bgray-700 text-center bg-bgray-200 ">Camera Settings</div>
           {renderDialog()}

           <div className="p-6 bg-bgray-100 fr-history z-10"  >
               <Grid
                   rows={app_state.available_cameras}
                   columns={columns}
                   getRowId={getRowId}
               >
                   <CamEnabledTypeProvider
                       for={camEnabledColumn}
                   />
                   <CamDirectionTypeProvider
                       for={camDirectionColumn}
                   />
                   {funcs.has_permission() ?
                       <EditingState
                           editingRowIds={editingRowIds}
                           onEditingRowIdsChange={setEditingRowIds}
                           rowChanges={rowChanges}
                           onRowChangesChange={setRowChanges}
                           addedRows={addedRows}
                           onAddedRowsChange={changeAddedRows}
                           onCommitChanges={commitChanges}
                       /> : <></>

                   }

                   <SearchState defaultValue=""/>
                   <IntegratedFiltering />
                   <PagingState
                       defaultCurrentPage={0}
                       defaultPageSize={5} />
                   <IntegratedPaging />
                   <Table/>
                   <TableHeaderRow/>
                   {funcs.has_permission() ? <TableEditRow/> : <></>}
                   {funcs.has_permission() ?
                       <TableEditColumn
                               showAddCommand={!addedRows.length}
                               showEditCommand
                               showDeleteCommand
                           />
                       : <></>
                   }

                   <Toolbar/>
                   {/*   <SearchPanel/> */}
                   <PagingPanel  pageSizes={pageSizes}/>
               </Grid>
           </div>


           <div className="text-xl py-2 font-semibold text-bgray-600 text-center bg-bgray-200">
               <div className="flex space-x-1 justify-end mr-4">
                   <button
                       className="uppercase btn-indigo text-bgray-200 text-sm font-bold disabled:bg-gray-400"
                       disabled={is_busy()}
                       onClick={() => on_start_streams()}
                   >Start All</button>
                   <button
                       className="uppercase btn-indigo text-bgray-200 text-sm font-bold disabled:bg-gray-400"
                       disabled={is_busy()}
                       onClick={() => on_stop_streams()}
                   >Stop All</button>

               </div>
           </div>

       </div>

    )


}
