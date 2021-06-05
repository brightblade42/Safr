import React from "react";
import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";

export  const FRHistoryGrid = (props) => {

    React.useEffect(() => {
            console.log("===== OHM ====== ");
            console.log(props);
        }
    );
    return (
       <div className="p-8">

           <Grid
               rows={props.model.Rows}
               columns={props.model.Columns}
           >
               <Table/>
               <TableHeaderRow/>

           </Grid>
       </div>

    )


}