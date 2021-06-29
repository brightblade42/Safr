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
import {DateTime} from 'luxon';
import {OKCancelDialog} from "./dialogs";

const getRowId = row => row.id


const CamEnabledEditor = (props) => {
        let value= props.value;
        let onValueChange = props.onValueChange
        return (
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

const CamDirectionFormatter = (props) => {
    let inout;
    let value = props.value;

    if (value) {
        inout = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
        </svg>
    } else {

        inout = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>

    }
    return(
        <div
            className="w-[5rem] flex justify-start items-center flex-shrink-0 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
            {inout}
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


export const CameraSettings = (props) => {

    const gmodel = props.gmodel;
    const model = props.model;
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
        funcs.delete_camera(deletedRow)
    }

    const any_cams_updating = () => {
        let any_updates = false;
        gmodel.Rows.forEach(r => {
            if (r.updating) {
                any_updates = true;
            }
        });

        return any_updates;
    }

    const streams_inflight = () => {
        return model.StartingAllStreams || model.StoppingAllStreams
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
            let crow = gmodel.Rows.find(x =>  x.id === parseInt(id));
            let new_row = Object.assign(crow, changed_row)

            funcs.update_camera(new_row)
        }
        if (deleted) {

            setDeletedRow(deleted[0])
            setIsDeleteDialogOpen(true)
        }

    };

     const on_start_streams = () =>  { funcs.start_all_streams(); };
    const  on_stop_streams = () => { funcs.stop_all_streams(); }

    const renderDialog = () => {
         if (isDeleteDialogOpen) {
             console.log(deletedRow);
             let row = gmodel.Rows.find(r => r.id === deletedRow);
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

       <div className="absolute top-[400px] min-h-3 flex flex-col shadow-2xl" >
           <div className="text-xl py-2 font-semibold shadow-xl border-2  border-gray-300
             text-bgray-700 text-center bg-bgray-200">Camera Settings</div>
           {renderDialog()}

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
