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
    return ldate.toLocaleString(DateTime.DATETIME_MED);
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

    const model = props.model;
    const funcs = props.funcs;
    console.log(funcs);
    const [imageColumns] = React.useState(['detected_img','matched_face']);
    const [dateColumns] = React.useState(['matched_on']);
    const [confidenceColumns] = React.useState(['confidence']);
    const [pageSizes] = React.useState([5,10,15, 0])

    let on_load = () => {
        funcs.on_load()
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

    return (
        <div className="flex flex-col">
            <div className="flex mt-6 space-x-8 justify-end mr-4">
                <TextField
                    id="datetime-local"
                    label="END DATE"
                    type="datetime-local"
                    defaultValue="2017-05-24T10:30"
                />
                <TextField
                    id="datetime-local"
                    label="START DATE"
                    type="datetime-local"
                    defaultValue="2017-05-24T10:30"
                />
                <button className="btn-indigo w-32  ml-3" onClick={on_load}>Load History</button>
            </div>
            <div className="px-6 fr-history">
               <Grid
                   rows={model.Rows}
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