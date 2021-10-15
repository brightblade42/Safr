import React, {Fragment} from "../_snowpack/pkg/react.js";
import {Menu, Transition} from "../_snowpack/pkg/@headlessui/react.js";
import {DotsVerticalIcon} from "../_snowpack/pkg/@heroicons/react/solid.js";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function EditMenu(props) {
  let state = props.state;
  let face = props.face;
  let funcs = props.funcs;
  return /* @__PURE__ */ React.createElement(Menu, {
    as: "div",
    className: "relative inline-block text-left"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Menu.Button, {
    className: "bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, "Open options"), /* @__PURE__ */ React.createElement(DotsVerticalIcon, {
    className: "h-5 w-5",
    "aria-hidden": "true"
  }))), /* @__PURE__ */ React.createElement(Transition, {
    as: Fragment,
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-95"
  }, /* @__PURE__ */ React.createElement(Menu.Items, {
    className: "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "py-1"
  }, /* @__PURE__ */ React.createElement(Menu.Item, null, ({active}) => /* @__PURE__ */ React.createElement("a", {
    href: "#",
    className: classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm"),
    onClick: () => {
      console.log("I have been selected for editing!");
      funcs.edit_profile();
    }
  }, "Edit Profile")), /* @__PURE__ */ React.createElement(Menu.Item, null, ({active}) => /* @__PURE__ */ React.createElement("a", {
    href: "#",
    className: classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm"),
    onClick: () => {
      console.log("I have been selected for elimination!");
      funcs.begin_delete_profile();
    }
  }, "Delete Profile"))))));
}
