import React, {Fragment, useState} from "../_snowpack/pkg/react.js";
import {Dialog, Transition} from "../_snowpack/pkg/@headlessui/react.js";
import ProfileForm from "./profile_form.js";
export default function EditProfile(props) {
  let state = props.state;
  let [first, set_first] = useState("");
  let [middle, set_middle] = useState("");
  let [last, set_last] = useState("");
  let [status, set_status] = useState("");
  let [ccode, set_ccode] = useState(-1);
  let [client_types, set_client_types] = useState([]);
  let funcs = props.funcs;
  function is_editing() {
    return state.profile_action_state.type !== "None";
  }
  function do_cancel() {
    return;
  }
  return /* @__PURE__ */ React.createElement(Transition.Root, {
    show: is_editing(),
    as: Fragment
  }, /* @__PURE__ */ React.createElement(Dialog, {
    as: "div",
    className: "fixed z-10 inset-0 overflow-y-auto",
    onClose: do_cancel
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
  }, /* @__PURE__ */ React.createElement(Transition.Child, {
    as: Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement(Dialog.Overlay, {
    className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
  })), /* @__PURE__ */ React.createElement("span", {
    className: "hidden sm:inline-block sm:align-middle sm:h-screen",
    "aria-hidden": "true"
  }, "​"), /* @__PURE__ */ React.createElement(Transition.Child, {
    as: Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    enterTo: "opacity-100 translate-y-0 sm:scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "inline-block\n                        align-bottom bg-white rounded-lg px-4 pt-5 pb-4\n                        text-left overflow-hidden\n                        shadow-xl transform transition-all sm:my-8\n                        sm:align-middle\n                        sm:max-w-4xl\n                        sm:w-full sm:p-6"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: ""
  }, /* @__PURE__ */ React.createElement(Dialog.Title, {
    as: "h3",
    className: "text-xl font-medium uppercase text-gray-900"
  }, "Profile"), /* @__PURE__ */ React.createElement("hr", {
    className: "mt-1"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4"
  }, /* @__PURE__ */ React.createElement(ProfileForm, {
    state: props.state,
    funcs: props.funcs
  })))))))));
}
