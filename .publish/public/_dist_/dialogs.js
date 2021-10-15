import React, {Fragment, useState, useRef} from "../_snowpack/pkg/react.js";
import {FontAwesomeIcon as FAIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {Dialog, Transition} from "../_snowpack/pkg/@headlessui/react.js";
export const OKDialog = (props) => {
  let [isOpen, setIsOpen] = useState(true);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "fixed inset-0 flex items-center justify-center"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    onClick: openModal,
    className: "px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  }, "Open dialog")), /* @__PURE__ */ React.createElement(Transition, {
    appear: true,
    show: isOpen,
    as: Fragment
  }, /* @__PURE__ */ React.createElement(Dialog, {
    as: "div",
    className: "fixed inset-0 z-10 overflow-y-auto",
    onClose: closeModal
  }, /* @__PURE__ */ React.createElement("div", {
    className: "min-h-screen px-4 text-center"
  }, /* @__PURE__ */ React.createElement(Transition.Child, {
    as: Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement(Dialog.Overlay, {
    className: "fixed inset-0"
  })), /* @__PURE__ */ React.createElement("span", {
    className: "inline-block h-screen align-middle",
    "aria-hidden": "true"
  }, "​"), /* @__PURE__ */ React.createElement(Transition.Child, {
    as: Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
  }, /* @__PURE__ */ React.createElement(Dialog.Title, {
    as: "h3",
    className: "text-lg font-medium leading-6 text-gray-900"
  }, "Payment successful"), /* @__PURE__ */ React.createElement("div", {
    className: "mt-2"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Your payment has been successfully submitted. We’ve sent your an email with all of the details of your order.")), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
    onClick: closeModal
  }, "Got it, thanks!"))))))));
};
export const ConfirmDeleteDlg = (props) => {
  const [open, setOpen] = useState(props.isopen);
  const cancelButtonRef = useRef(null);
  const handle_confirm = () => {
    if (props.onConfirm !== void 0) {
      console.log("confirm it");
      props.onConfirm();
    }
    setOpen(false);
  };
  const handle_cancel = () => {
    setOpen(false);
    if (props.onCancel !== void 0) {
      console.log("cancel it");
      props.onCancel();
    }
  };
  function is_deleting() {
    return props.state.profile_action_state.type === "Deleting";
  }
  return /* @__PURE__ */ React.createElement(Transition.Root, {
    show: is_deleting(),
    as: Fragment
  }, /* @__PURE__ */ React.createElement(Dialog, {
    as: "div",
    static: true,
    className: "fixed z-10 inset-0 overflow-y-auto",
    initialFocus: cancelButtonRef,
    onClose: handle_cancel
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
    className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "sm:flex sm:items-start"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    className: "text-red-600 text-[1.2em]",
    icon: ["far", "exclamation-triangle"]
  })), /* @__PURE__ */ React.createElement("div", {
    className: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
  }, /* @__PURE__ */ React.createElement(Dialog.Title, {
    as: "h3",
    className: "text-lg leading-6 font-medium text-gray-900"
  }, props.title), /* @__PURE__ */ React.createElement("div", {
    className: "mt-2"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm text-gray-500"
  }, props.confirm_desc))))), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm",
    onClick: () => handle_confirm()
  }, props.confirm_msg), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
    onClick: () => handle_cancel(),
    ref: cancelButtonRef
  }, "Cancel")))))));
};
