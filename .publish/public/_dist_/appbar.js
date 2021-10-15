import React from "../_snowpack/pkg/react.js";
import eye from "./images/eye_logo2.png.proxy.js";
import {HomeIcon, SettingsIcon} from "./heroicons.js";
import {Link} from "../_snowpack/pkg/react-router-dom.js";
export const AppBar = (props) => {
  function logout() {
    props.logout();
  }
  function toggle_settings() {
    props.toggle_settings();
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "fixed inset-x-0 top-0 z-10  flex justify-between items-end  bg-blue-800 text-blue-300 p-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex space-x-4 items-end"
  }, /* @__PURE__ */ React.createElement("img", {
    src: eye,
    className: "inline-block w-[99px] h-[58px] opacity-100 ",
    alt: "eyemetric"
  }), /* @__PURE__ */ React.createElement(Link, {
    to: "/",
    className: "mt-0  btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex space-x-2 items-end"
  }, /* @__PURE__ */ React.createElement(HomeIcon, null), /* @__PURE__ */ React.createElement("span", {
    className: "inline-block ml-4"
  }, "Home"))), /* @__PURE__ */ React.createElement(Link, {
    to: "/frhistory",
    className: "mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
  }, "History"), /* @__PURE__ */ React.createElement(Link, {
    to: "/videoedit",
    className: "mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
  }, "Analyze Video"), /* @__PURE__ */ React.createElement(Link, {
    to: "/lineup",
    className: "mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
  }, "Analyze Image")), /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, /* @__PURE__ */ React.createElement("button", {
    onClick: toggle_settings,
    className: "btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex space-x-2 items-end"
  }, /* @__PURE__ */ React.createElement(SettingsIcon, null), /* @__PURE__ */ React.createElement("span", {
    className: "inline-block ml-4"
  }, "Settings"))), /* @__PURE__ */ React.createElement("button", {
    className: "btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50",
    onClick: logout
  }, "Logout")));
};
