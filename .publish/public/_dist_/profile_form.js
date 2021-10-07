import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import SelectBox from "./select_box.js";
export default function ProfileForm(props) {
  let state = props.state;
  let funcs = props.funcs;
  let c_ref = React.useRef();
  const cancelButtonRef = useRef(null);
  let [first, set_first] = useState("");
  let [middle, set_middle] = useState("");
  let [last, set_last] = useState("");
  let [status, set_status] = useState({id: 0, description: ""});
  let [client_type, set_client_type] = useState({id: 0, description: ""});
  let [image, set_image] = useState(void 0);
  let [ccode, set_ccode] = useState(-1);
  function save_first(v) {
    console.log("first name is : " + v);
    set_first(v);
  }
  function save_last(v) {
    console.log("last name is : " + v);
    set_last(v);
  }
  function save_middle(v) {
    console.log("save middle is : " + v);
    set_middle(v);
  }
  function save_client_type(v) {
    console.log("saving client type");
    console.log(v);
    set_client_type(v);
  }
  function save_status(v) {
    console.log("saving status");
    console.log(v);
    set_status(v);
  }
  function do_save() {
    let profile = {
      ccode: 1,
      first,
      middle,
      last,
      status: status.id,
      client_type: client_type.id,
      image
    };
    funcs.save_profile(profile);
  }
  function do_cancel() {
    funcs.cancel();
  }
  function draw_face() {
    const cv = c_ref.current;
    if (cv === void 0) {
      return;
    }
    if (cv === null) {
      return;
    }
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.putImageData(state.selected_detection, 0, 0, 10, 10, cv.width, cv.height);
    cv.toBlob(async (b) => {
      set_image(b);
    }, "image/jpeg", 0.95);
  }
  useEffect(() => {
    console.log(state.selected_detection);
    draw_face();
  }, [state.selected_detection]);
  function map_statuses() {
    return state.status_list.map((item) => {
      return {
        id: item.sttsId,
        description: item.description
      };
    });
  }
  function map_person_types() {
    return state.client_type_list.map((item) => {
      return {
        id: item.clntTid,
        description: item.description
      };
    });
  }
  let status_list = map_statuses();
  let person_types = map_person_types();
  return /* @__PURE__ */ React.createElement("div", {
    className: "space-y-6"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "md:grid md:grid-cols-3 md:gap-6"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "md:col-span-1"
  }, /* @__PURE__ */ React.createElement("canvas", {
    id: "cropped_img",
    ref: c_ref
  })), /* @__PURE__ */ React.createElement("div", {
    className: "md:col-span-2"
  }, /* @__PURE__ */ React.createElement("form", {
    action: "#",
    method: "POST"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 gap-x-2 gap-y-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "first-name",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "First name"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "first-name",
    id: "first-name",
    autoComplete: "given-name",
    onChange: (v) => save_first(v.currentTarget.value),
    className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "middle-name",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "Middle name"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "middle-name",
    id: "middle-name",
    onChange: (v) => save_middle(v.currentTarget.value),
    autoComplete: "middle-name",
    className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "last-name",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "Last name"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: "last-name",
    id: "last-name",
    onChange: (v) => save_last(v.currentTarget.value),
    autoComplete: "family-name",
    className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex "
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "status",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "Status"), /* @__PURE__ */ React.createElement(SelectBox, {
    id: "status",
    onSelected: save_status,
    className: "flex-shrink-0",
    options: status_list,
    dir: 1
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex "
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "typ",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "Type"), /* @__PURE__ */ React.createElement(SelectBox, {
    id: "typ",
    className: "flex-shrink-0",
    options: person_types,
    dir: 1,
    onSelected: save_client_type
  }))))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-end"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    onClick: () => do_cancel(),
    ref: cancelButtonRef,
    className: "bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  }, "Cancel"), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    onClick: () => do_save(),
    className: "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  }, "Save")));
}
