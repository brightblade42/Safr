import React from "react";
import {
    DataTypeProvider,
    PagingState,
    SearchState,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,

} from "@devexpress/dx-react-grid";

import {TextField} from "@material-ui/core";

import {
    Grid,
    Table,
    TableHeaderRow,
    TableFilterRow,
    PagingPanel,
    Toolbar,

} from "@devexpress/dx-react-grid-material-ui";

import {DateTime} from 'luxon';
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import {AppState} from "./AppState";

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


const DateFormatter = ({ value }) => {
    let ldate = DateTime.fromISO(value);
    return ldate.toLocaleString(DateTime.DATETIME_SHORT);
}

const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
);


const BuildConfidenceFormatter = (format_conf) => {
   return ({value}) => {
       return (
           <span className="text-md" >{format_conf(value)}</span>
       )

   };
}



export const FRHistoryGrid = (props) => {

    const app_state: AppState = props.state;
    const funcs = props.funcs;
    //const api = props.remote_api;

    const [imageColumns] = React.useState(['detected_img','matched_face']);
    const [dateColumns] = React.useState(['matched_on']);
    const [confidenceColumns] = React.useState(['confidence']);
    const [pageSizes] = React.useState([5,10,15, 0])
    const [endDate, setEndDate] = React.useState(DateTime.now().toFormat("yyyy-MM-dd") + "T18:00");
    const [startDate, setStartDate] = React.useState(DateTime.now().toFormat("yyyy-MM-dd") + "T06:00");


    const on_enddate_change = (value)  => {
        setEndDate(value);
    }
    const on_startdate_change = (value)  => {
        setStartDate(value);
    }
    const on_load = () => {
        funcs.on_load(startDate, endDate)
    }

    const is_loading = () => {
        return app_state.fr_history_loading ? "opacity-100" : "opacity-0"
    }


    const columns = [

        {name: "matched_face", title: "ENROLLED"},
        { name: "name", title: "NAME"},
        { name: "confidence", title: "CONFIDENCE"},
        { name: "status", title: "STATUS"},
        { name: "matched_on", title: "MATCHED ON"},
        { name: "location", title: "LOCATION"},
    ]

    const format_confidence =  (c: number)  => {
        return funcs.format_conf(c)
    }
    const ConfidenceTypeProvider = props => (
        <DataTypeProvider formatterComponent={BuildConfidenceFormatter(format_confidence)} {...props} />
    );

    const handle_key_press = (e) => {
        if (e.key === "Enter") {
            on_load()
        }
    }
    return (
        <div
            className="flex flex-col">
            <div className="flex mt-6 z-10 space-x-8 justify-end mr-4">
                <TextField
                    id="datetime-local"
                    label="START DATE"
                    type="datetime-local"
                    defaultValue={startDate}
                    onKeyPress={(e) => handle_key_press(e)}
                    onChange={(e) => on_startdate_change(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="datetime-local"
                    label="END DATE"
                    type="datetime-local"
                    onKeyPress={(e) => handle_key_press(e)}
                    onChange={(e) => on_enddate_change(e.target.value)}
                    defaultValue={endDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <button type="button"
                        disabled={app_state.fr_history_loading}
                        onClick={on_load}
                        className="relative flex justify-center
                                w-32 items-center transition duration-200
                                bg-blue-500 hover:bg-blue-600 focus:bg-blue-700
                                disabled:font-bold disabled:bg-gray-400 disabled:cursor-not-allowed
                                focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                                text-white
                                font-semibold
                                rounded-lg text-sm
                                shadow-sm hover:shadow-md
                                 " >
                    <span className="inline-block text-lg">Load</span>
                    <span className={` ${is_loading()} animate-spin  inline-block ml-1 text-2xl`}>
                                <FAIcon className="text-bgray-100" icon={['fad','spinner-third']}  />
                            </span>
                </button>
            </div>
            <div className="px-2 fr-history -mt-12">
               <Grid
                   rows={app_state.fr_logs}
                   columns={columns} >

                   <ImageTypeProvider for={imageColumns}/>
                   <DateTypeProvider for={dateColumns} />
                   <ConfidenceTypeProvider for={confidenceColumns}/>
                   <SearchState defaultValue=""/>
                   <FilteringState defaultFilters={[]}/>
                   <IntegratedFiltering />
                   <PagingState
                       defaultCurrentPage={0}
                       defaultPageSize={5} />
                   <IntegratedPaging />
                   <Table/>
                   <TableHeaderRow/>
                   <TableFilterRow  />
                   <Toolbar/>
                   <PagingPanel  pageSizes={pageSizes}/>
               </Grid>
           </div>

        </div>

    )


}
