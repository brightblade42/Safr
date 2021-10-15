import React, {Fragment, useState} from "../_snowpack/pkg/react.js";
import {Listbox, Transition} from "../_snowpack/pkg/@headlessui/react.js";
import {CheckIcon, SelectorIcon} from "../_snowpack/pkg/@heroicons/react/solid.js";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function SelectBox(props) {
  let options = props.options;
  const [selected, setSelected] = useState(options[props.defaultSelected || 0]);
  const [direction, setDirection] = useState(props.dir);
  function classNames2(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function open_dir() {
    return direction === 0 ? "mt-1" : "-mt-72";
  }
  function on_selected(v) {
    setSelected(v);
    props.onSelected(v);
  }
  return /* @__PURE__ */ React.createElement(Listbox, {
    value: selected,
    onChange: on_selected
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mt-1 relative w-full"
  }, /* @__PURE__ */ React.createElement(Listbox.Button, {
    className: "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "block"
  }, selected.description), /* @__PURE__ */ React.createElement("span", {
    className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
  }, /* @__PURE__ */ React.createElement(SelectorIcon, {
    className: "h-5 w-5 text-gray-700",
    "aria-hidden": "true"
  }))), /* @__PURE__ */ React.createElement(Transition, {
    as: Fragment,
    leave: "transition ease-in duration-100",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement(Listbox.Options, {
    className: `absolute z-20 ${open_dir()} w-full bg-white shadow-lg max-h-60 rounded-md py-1
                                    text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`
  }, options.map((status) => /* @__PURE__ */ React.createElement(Listbox.Option, {
    key: status.id,
    className: ({active}) => classNames2(active ? "text-white bg-indigo-600" : "text-gray-900", "cursor-default select-none relative py-2 pl-3 pr-9"),
    value: status
  }, ({selected: selected2, active}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
    className: classNames2(selected2 ? "font-semibold" : "font-normal", "block ")
  }, status.description), selected2 ? /* @__PURE__ */ React.createElement("span", {
    className: classNames2(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")
  }, /* @__PURE__ */ React.createElement(CheckIcon, {
    className: "h-5 w-5",
    "aria-hidden": "true"
  })) : null)))))));
}
