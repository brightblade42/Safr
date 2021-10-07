import React from "../_snowpack/pkg/react.js";
import {FontAwesomeIcon as FAIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {CheckIn, CheckOut} from "./heroicons.js";
const InOut = ({direction}) => direction ? /* @__PURE__ */ React.createElement(CheckIn, null) : /* @__PURE__ */ React.createElement(CheckOut, null);
export function DisabledVideo({cam}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "w-full max-w-lg flex-shrink-0 flex flex-col mr-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "uppercase rounded-t-md py-1 text-center\n                            transform translate translate-y-4 font-bold mt-2\n                            text-md tracking-wide text-bgray-700 bg-bgray-300"
  }, /* @__PURE__ */ React.createElement("span", null, cam.name), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-400 min-h-[288px]"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block text-4xl text-gray-300 my-24"
  }, "Disabled"))));
}
export function OfflineVideo({cam}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "w-full max-w-lg flex-shrink-0 flex flex-col mr-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "uppercase rounded-t-md py-1 text-center\n                            transform translate translate-y-4 font-bold mt-2\n                            text-md tracking-wide text-bgray-700 bg-bgray-300"
  }, /* @__PURE__ */ React.createElement("span", null, cam.name), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-400 min-h-[288px]"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block text-4xl text-gray-300 my-24"
  }, "OFFLINE"))));
}
export function ConnectingVideo({cam, msg}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "w-full max-w-lg flex-shrink-0 flex flex-col mr-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "uppercase rounded-t-md py-1 text-center\n                            transform translate translate-y-4 font-bold mt-2\n                            text-md tracking-wide text-bgray-700 bg-bgray-300"
  }, /* @__PURE__ */ React.createElement("span", null, cam.name), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-400 min-h-[288px]"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block text-4xl text-yellow-300/60 my-24"
  }, msg), /* @__PURE__ */ React.createElement("span", {
    className: `animate-spin  inline-block ml-2 text-2xl`
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    className: "text-yellow-300/70",
    size: "2x",
    icon: ["fad", "spinner-third"]
  })))));
}
export function UpdatingVideo({cam, msg}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "w-full max-w-lg flex-shrink-0 flex flex-col mr-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "uppercase rounded-t-md py-1 text-center\n                            transform translate translate-y-4 font-bold mt-2\n                            text-md tracking-wide text-bgray-700 bg-bgray-300"
  }, /* @__PURE__ */ React.createElement("span", null, cam.name), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-400 min-h-[288px]"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "inline-block text-4xl text-yellow-300/60 my-24"
  }, msg), /* @__PURE__ */ React.createElement("span", {
    className: `animate-spin  inline-block ml-2 text-2xl`
  }, /* @__PURE__ */ React.createElement(FAIcon, {
    className: "text-yellow-300/70",
    size: "2x",
    icon: ["fad", "spinner-third"]
  })))));
}
export function AxVideo({cam}) {
  let secure = false;
  return /* @__PURE__ */ React.createElement("div", {
    className: "w-full max-w-lg flex-shrink-0 flex flex-col mr-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "uppercase\n                 rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md\n                 tracking-wide text-bgray-700 bg-bgray-300"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-center space-x-4"
  }, /* @__PURE__ */ React.createElement("div", null, cam.name), /* @__PURE__ */ React.createElement(InOut, {
    direction: cam.direction
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "h-80 bg-gray-100"
  }, /* @__PURE__ */ React.createElement("media-stream-player", {
    autoplay: true,
    format: "RTP_H264",
    hostname: cam.ipaddress
  })));
}
export function VideoList(props) {
  let app_state = props.state;
  console.log("==== prop aroni =====");
  let available_cams = app_state.available_cameras;
  const avail_cams = () => {
    if (available_cams.length === 0) {
      return /* @__PURE__ */ React.createElement("div", {
        className: "text-7xl m-auto text-gray-200"
      }, "Cameras");
    }
    const create_video = (cam) => {
      if (cam.updating) {
        return /* @__PURE__ */ React.createElement(UpdatingVideo, {
          cam,
          msg: "Updating.."
        });
      }
      if (cam.enabled) {
        if (cam.streaming) {
          if (app_state.stopping_all_streams) {
            return /* @__PURE__ */ React.createElement(ConnectingVideo, {
              cam,
              msg: "Disconnecting.."
            });
          }
          return /* @__PURE__ */ React.createElement(AxVideo, {
            cam
          });
        } else {
          if (app_state.starting_all_streams) {
            return /* @__PURE__ */ React.createElement(ConnectingVideo, {
              cam,
              msg: "Connecting.."
            });
          }
          return /* @__PURE__ */ React.createElement(OfflineVideo, {
            cam
          });
        }
      } else {
        return /* @__PURE__ */ React.createElement(DisabledVideo, {
          cam
        });
      }
    };
    return available_cams.map((cam) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, " ", create_video(cam), " ");
    });
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "overflow-x-scroll flex -ml-1 -mt-10 bg-gray-50 pb-0 px-1 min-h-[365px]"
  }, avail_cams());
}
