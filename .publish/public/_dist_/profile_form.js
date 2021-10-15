import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import SelectBox from "./select_box.js";
import InputValidation from "./input_with_validation.js";
export default function ProfileForm(props) {
  let state = props.state;
  let funcs = props.funcs;
  let c_ref = React.useRef();
  const cancelButtonRef = useRef(null);
  let ident = state.selected_identity == void 0 ? {fName: "", lName: ""} : state.selected_identity;
  let [first, set_first] = useState(ident.fName || "");
  let [middle, set_middle] = useState("");
  let [last, set_last] = useState(ident.lName || "");
  let [status, set_status] = useState({id: 1, description: "Active"});
  let [client_type, set_client_type] = useState({id: 7, description: "Visitor"});
  let [image, set_image] = useState(void 0);
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
    if (ident.ccode === void 0) {
      let profile = {
        ccode: 1,
        first,
        middle,
        last,
        status: status.id,
        client_type: client_type.id,
        type: client_type.description,
        image
      };
      funcs.save_profile(profile);
    } else {
      let profile = {
        ccode: ident.ccode,
        first,
        middle,
        last,
        status: status.id,
        client_type: client_type.id,
        type: client_type.description,
        image: void 0
      };
      console.log("Going to edit from Dialog..");
      funcs.edit_profile(profile);
    }
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
  }, "First name"), /* @__PURE__ */ React.createElement(InputValidation, {
    id: "first-name",
    name: "first-name",
    placeholder: "required",
    className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
    value: first,
    onChange: (v) => save_first(v.currentTarget.value)
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col-span-2 flex"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "last-name",
    className: "m-auto flex-shrink-0 mr-8 font-medium text-gray-700"
  }, "Last name"), /* @__PURE__ */ React.createElement(InputValidation, {
    id: "last-name",
    name: "last-name",
    placeholder: "required",
    autoComplete: "family-name",
    value: last,
    className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
    onChange: (v) => save_last(v.currentTarget.value)
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
    defaultSelecteed: 7,
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
