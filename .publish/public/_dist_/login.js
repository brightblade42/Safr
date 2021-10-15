import React from "../_snowpack/pkg/react.js";
import eye from "./images/eye_logo.png.proxy.js";
import {FontAwesomeIcon as FAIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
export const LoginComponent = (props) => {
  let model = props.model;
  let [user, setUser] = React.useState("");
  let [pwd, setPwd] = React.useState("");
  function handle_login() {
    console.log("-- login parent hand off --");
    let cUser = user;
    let cPwd = pwd;
    setUser("");
    setPwd("");
    props.onLogin(cUser, cPwd);
  }
  function handleUserChange(e) {
    setUser(e.target.value);
  }
  function handlePwdChange(e) {
    setPwd(e.target.value);
  }
  function toggle_msg() {
    return model.login_status.type === "Failed" ? "opacity-100" : "opacity-0";
  }
  function is_login_disabled() {
    return model.login_status.type === "NotLoggedIn" && user.length < 1;
  }
  function is_in_flight() {
    return model.login_status.type === "InFlight" ? "opacity-100" : "opacity-0";
  }
  const showpwd = "password";
  return /* @__PURE__ */ React.createElement("div", {
    className: "bg-bgray-50 min-h-screen bg-white flex flex-col justify-center sm:py-12"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "-mt-48 p-10 xs:p-0 mx-auto md:w-full md:max-w-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${toggle_msg()} text-lg font-semibold text-red-700 mb-2 bg-red-100 p-2 rounded-lg text-center`
  }, "Incorrect user name or password."), /* @__PURE__ */ React.createElement("div", {
    className: "shadow-2xl w-full rounded-lg divide-y divide-gray-200"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "bg-white py-6 mb-2 "
  }, /* @__PURE__ */ React.createElement("img", {
    src: eye,
    className: "mx-auto",
    alt: "eyemetric"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-100 px-5 py-7"
  }, /* @__PURE__ */ React.createElement("label", {
    className: "font-semibold text-sm text-gray-700 pb-1 block"
  }, "User name"), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: user,
    onChange: (e) => handleUserChange(e),
    className: "border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
  }), /* @__PURE__ */ React.createElement("label", {
    className: "font-semibold text-sm text-gray-700 pb-1 block"
  }, "Password"), /* @__PURE__ */ React.createElement("input", {
    type: showpwd,
    value: pwd,
    onChange: (e) => handlePwdChange(e),
    className: "border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
  }), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    disabled: is_login_disabled(),
    onClick: () => handle_login(),
    className: "relative flex justify-center\n                                items-center transition duration-200\n                                bg-blue-500 hover:bg-blue-600 focus:bg-blue-700\n                                disabled:font-bold disabled:bg-gray-400\n                                disabled:cursor-not-allowed\n                                focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50\n                                text-white w-full py-2\n                                rounded-lg text-sm\n                                shadow-sm hover:shadow-md font-semibold text-center  inline-block"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block mr-2 text-lg"
  }, "Login"), /* @__PURE__ */ React.createElement("span", {
    className: ` ${is_in_flight()} animate-spin  inline-block ml-1 text-2xl`
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    className: "text-bgray-100",
    icon: ["fad", "spinner-third"]
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "bg-bgray-100 py-5"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 gap-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-center sm:text-left whitespace-nowrap"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "transition duration-200 mx-4 px-4 py-4  cursor-pointer\n                                    font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none\n                                    focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    icon: ["far", "lock-open-alt"],
    className: "mr-2"
  }), /* @__PURE__ */ React.createElement("span", {
    className: "inline-block"
  }, "Reset Password"))), /* @__PURE__ */ React.createElement("div", {
    className: "hidden opacity-0 text-center sm:text-right  whitespace-nowrap"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
  }, /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    className: "w-4 h-4 inline-block align-text-bottom	"
  }, /* @__PURE__ */ React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
  })), /* @__PURE__ */ React.createElement("span", {
    className: "inline-block ml-1 "
  }, "Help"))))))));
};
