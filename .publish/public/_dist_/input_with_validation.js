import React, {useEffect, useState} from "../_snowpack/pkg/react.js";
import {ExclamationCircleIcon} from "../_snowpack/pkg/@heroicons/react/solid.js";
export default function InputValidation(props) {
  let msg = "You must enter a first name";
  let [text, set_text] = useState(props.value);
  let [is_valid, set_is_valid] = useState(false);
  useEffect(() => {
    if (text === void 0) {
      return;
    }
    if (text.length > 0 && text[0] !== " ") {
      set_is_valid(true);
    } else {
      set_is_valid(false);
    }
  }, [text]);
  function on_change(e) {
    set_text(e.currentTarget.value);
    if (props.onChange !== void 0) {
      props.onChange(e);
    }
  }
  let valid_style = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md";
  let invalid_style = "mt-1 w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md";
  return /* @__PURE__ */ React.createElement("div", {
    className: props.className
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mt-1 relative rounded-md shadow-sm"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    name: props.id,
    id: props.id,
    onChange: on_change,
    placeholder: props.placeholder,
    defaultValue: props.defaultValue,
    value: text,
    className: is_valid ? valid_style : invalid_style,
    "aria-invalid": "true",
    "aria-describedby": "input-error"
  }), !is_valid && /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
  }, /* @__PURE__ */ React.createElement(ExclamationCircleIcon, {
    className: "h-5 w-5 text-red-500",
    "aria-hidden": "true"
  }))), props.msg && /* @__PURE__ */ React.createElement("p", {
    className: "mt-1 text-sm text-red-600 min-h-[20px]",
    id: "input-error"
  }, is_valid ? "  " : props.msg));
}
