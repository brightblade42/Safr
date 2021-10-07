import React from "../_snowpack/pkg/react.js";
import {
  DataTypeProvider,
  PagingState,
  SearchState,
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging
} from "../_snowpack/pkg/@devexpress/dx-react-grid.js";
import {TextField} from "../_snowpack/pkg/@material-ui/core.js";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
  Toolbar
} from "../_snowpack/pkg/@devexpress/dx-react-grid-material-ui.js";
import {DateTime} from "../_snowpack/pkg/luxon.js";
import {FontAwesomeIcon as FAIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
const ImageFormatter = ({value}) => {
  const imgf = "data:image/png;base64, " + value;
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex space-x-2"
  }, /* @__PURE__ */ React.createElement("img", {
    src: imgf,
    className: "w-28 h-28 rounded-md shadow-lg",
    alt: "enrolled face"
  }));
};
const ImageTypeProvider = (props) => /* @__PURE__ */ React.createElement(DataTypeProvider, {
  formatterComponent: ImageFormatter,
  ...props
});
const DateFormatter = ({value}) => {
  let ldate = DateTime.fromISO(value);
  return ldate.toLocaleString(DateTime.DATETIME_SHORT);
};
const DateTypeProvider = (props) => /* @__PURE__ */ React.createElement(DataTypeProvider, {
  formatterComponent: DateFormatter,
  ...props
});
const BuildConfidenceFormatter = (format_conf) => {
  return ({value}) => {
    return /* @__PURE__ */ React.createElement("span", {
      className: "text-md"
    }, format_conf(value));
  };
};
export const FRHistoryGrid = (props) => {
  const app_state = props.state;
  const funcs = props.funcs;
  const [imageColumns] = React.useState(["detected_img", "matched_face"]);
  const [dateColumns] = React.useState(["matched_on"]);
  const [confidenceColumns] = React.useState(["confidence"]);
  const [pageSizes] = React.useState([5, 10, 15, 0]);
  const [endDate, setEndDate] = React.useState(DateTime.now().toFormat("yyyy-MM-dd") + "T18:00");
  const [startDate, setStartDate] = React.useState(DateTime.now().toFormat("yyyy-MM-dd") + "T06:00");
  const on_enddate_change = (value) => {
    setEndDate(value);
  };
  const on_startdate_change = (value) => {
    setStartDate(value);
  };
  const on_load = () => {
    funcs.on_load(startDate, endDate);
  };
  const is_loading = () => {
    return app_state.fr_history_loading ? "opacity-100" : "opacity-0";
  };
  const columns = [
    {name: "matched_face", title: "ENROLLED"},
    {name: "name", title: "NAME"},
    {name: "confidence", title: "CONFIDENCE"},
    {name: "status", title: "STATUS"},
    {name: "matched_on", title: "MATCHED ON"},
    {name: "location", title: "LOCATION"}
  ];
  const format_confidence = (c) => {
    return funcs.format_conf(c);
  };
  const ConfidenceTypeProvider = (props2) => /* @__PURE__ */ React.createElement(DataTypeProvider, {
    formatterComponent: BuildConfidenceFormatter(format_confidence),
    ...props2
  });
  const handle_key_press = (e) => {
    if (e.key === "Enter") {
      on_load();
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex mt-6 z-10 space-x-8 justify-end mr-4"
  }, /* @__PURE__ */ React.createElement(TextField, {
    id: "datetime-local",
    label: "START DATE",
    type: "datetime-local",
    defaultValue: startDate,
    onKeyPress: (e) => handle_key_press(e),
    onChange: (e) => on_startdate_change(e.target.value),
    InputLabelProps: {
      shrink: true
    }
  }), /* @__PURE__ */ React.createElement(TextField, {
    id: "datetime-local",
    label: "END DATE",
    type: "datetime-local",
    onKeyPress: (e) => handle_key_press(e),
    onChange: (e) => on_enddate_change(e.target.value),
    defaultValue: endDate,
    InputLabelProps: {
      shrink: true
    }
  }), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    disabled: app_state.fr_history_loading,
    onClick: on_load,
    className: "relative flex justify-center\n                                w-32 items-center transition duration-200\n                                bg-blue-500 hover:bg-blue-600 focus:bg-blue-700\n                                disabled:font-bold disabled:bg-gray-400 disabled:cursor-not-allowed\n                                focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50\n                                text-white\n                                font-semibold\n                                rounded-lg text-sm\n                                shadow-sm hover:shadow-md\n                                 "
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block text-lg"
  }, "Load"), /* @__PURE__ */ React.createElement("span", {
    className: ` ${is_loading()} animate-spin  inline-block ml-1 text-2xl`
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    className: "text-bgray-100",
    icon: ["fad", "spinner-third"]
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "px-2 fr-history -mt-12"
  }, /* @__PURE__ */ React.createElement(Grid, {
    rows: app_state.fr_logs,
    columns
  }, /* @__PURE__ */ React.createElement(ImageTypeProvider, {
    for: imageColumns
  }), /* @__PURE__ */ React.createElement(DateTypeProvider, {
    for: dateColumns
  }), /* @__PURE__ */ React.createElement(ConfidenceTypeProvider, {
    for: confidenceColumns
  }), /* @__PURE__ */ React.createElement(SearchState, {
    defaultValue: ""
  }), /* @__PURE__ */ React.createElement(FilteringState, {
    defaultFilters: []
  }), /* @__PURE__ */ React.createElement(IntegratedFiltering, null), /* @__PURE__ */ React.createElement(PagingState, {
    defaultCurrentPage: 0,
    defaultPageSize: 5
  }), /* @__PURE__ */ React.createElement(IntegratedPaging, null), /* @__PURE__ */ React.createElement(Table, null), /* @__PURE__ */ React.createElement(TableHeaderRow, null), /* @__PURE__ */ React.createElement(TableFilterRow, null), /* @__PURE__ */ React.createElement(Toolbar, null), /* @__PURE__ */ React.createElement(PagingPanel, {
    pageSizes
  }))));
};
