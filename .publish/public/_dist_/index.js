import React, {useEffect} from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import "./index.css.proxy.js";
import {init_state, update} from "./appstate.js";
import {VideoList} from "./axvideo.js";
import {library} from "../_snowpack/pkg/@fortawesome/fontawesome-svg-core.js";
import {fal} from "../_snowpack/pkg/@fortawesome/pro-light-svg-icons.js";
import {fas} from "../_snowpack/pkg/@fortawesome/pro-solid-svg-icons.js";
import {far} from "../_snowpack/pkg/@fortawesome/pro-regular-svg-icons.js";
import {fad} from "../_snowpack/pkg/@fortawesome/pro-duotone-svg-icons.js";
import {LoginComponent} from "./login.js";
import {VideoEditor} from "./video_editor.js";
import {AppBar} from "./appbar.js";
import {BrowserRouter as Router, Route, Switch} from "../_snowpack/pkg/react-router-dom.js";
import {GoodFaces, BadFaces} from "./facecards.js";
import {CameraSettings} from "./camerasettings.js";
import {FRHistoryGrid} from "./frhistorygrid.js";
import {LineupPage} from "./lineup_page.js";
import {RemoteApiBuilder} from "./remote_api.js";
import * as signalR from "../_snowpack/pkg/@microsoft/signalr.js";
import {HubConnectionState} from "../_snowpack/pkg/@microsoft/signalr.js";
library.add(fas, far, fad, fal);
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function Home({state, dispatch}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, /* @__PURE__ */ React.createElement(VideoList, {
    state,
    dispatch
  }), /* @__PURE__ */ React.createElement(GoodFaces, {
    faces: state.matched_faces
  }), /* @__PURE__ */ React.createElement(BadFaces, {
    faces: state.fr_watchlist
  }));
}
function update_available_cams(cam_info, dispatch) {
  let avail = cam_info.available_cams;
  let s_res = cam_info.streams;
  if (s_res.isOk) {
    let streams = s_res.resultValue.streams;
    avail = avail.map((cam) => {
      const is_running = streams.findIndex((s) => cam.name === s.name);
      return is_running > -1 ? {...cam, streaming: true} : {...cam, streaming: false};
    });
  } else {
    console.log(s_res.errorValue);
  }
  let cam_state = {available_cameras: avail, streams_loading: false, starting_all_streams: false, stopping_all_streams: false};
  dispatch({action: "AvailableCamerasChanged", payload: cam_state});
  console.log(cam_info);
}
function update_face(face, dispatch) {
  if (face.status.includes("FR")) {
    dispatch({action: "FRWatchlistChanged", payload: face});
  } else {
    dispatch({action: "MatchedFacesChanged", payload: face});
  }
}
function App(props) {
  let logout = props.logout;
  const dispatch = props.dispatch;
  let [show_camsettings, set_show_camsettings] = React.useState(false);
  const api = props.api;
  let endpoint = api.hub;
  function has_permission() {
    if (props.state.login_status.type === "LoggedIn") {
      return props.state.login_status.role === "Admin";
    } else {
      return false;
    }
  }
  const hub = new signalR.HubConnectionBuilder().withUrl(endpoint).withAutomaticReconnect().configureLogging(signalR.LogLevel.Information).build();
  function try_connect(fn) {
    return function() {
      if (hub.state === HubConnectionState.Disconnected) {
        console.log("Was NOT  connected...");
        hub.start().then((a) => {
          fn();
        });
      } else {
        console.log("Was connected...");
        fn();
      }
    };
  }
  function start_streams() {
    console.log("start streams of available cameras that are not already streaming.");
  }
  useEffect(() => {
    hub.on("ReceiveMessage", (msg) => {
      console.log(`got the server message: ${msg}`);
    });
    hub.on("AvailableCameras", (msg) => {
      update_available_cams(msg, dispatch);
    });
    hub.on("FaceIdentified", (msg) => {
      update_face(msg, dispatch);
    });
    hub.on("StreamsStarting", () => {
      console.log("Received Streams Starting Message");
    });
    hub.start().then((a) => {
      hub.send("GetAvailableCameras").then((a2) => {
        console.log(`get cameras invoked ${a2}`);
      }).catch((err) => {
        console.log(`BOOM: ${err}`);
      });
    }).catch((err) => {
      console.log("couldn't connect hub.");
      console.log(err);
    });
  }, []);
  let toggle_settings = () => {
    set_show_camsettings(!show_camsettings);
  };
  let cam_funcs = {
    start_all_streams: () => {
      console.log(hub);
      try_connect(() => {
        hub.send("StartAllStreams").then((a) => {
          console.log("dispatching start all streams request");
          dispatch({action: "StartingAllStreams", payload: true});
        }).catch((err) => {
          console.log("could not call StartAllStreams on hub");
          console.log(err);
        });
      })();
    },
    stop_all_streams: () => {
      try_connect(() => {
        hub.send("StopAllStreams").then((a) => {
          console.log("dispatching StoppingAllStreams request");
          dispatch({action: "StoppingAllStreams", payload: true});
        }).catch((err) => {
          console.log("could not call STOP AllStreams on hub");
          console.log(err);
        });
      })();
    },
    start_camera: (cam) => {
      try_connect(() => {
        hub.send("StartStream", cam).then((a) => console.log("Sent Start Stream request")).catch((err) => console.log(`Error starting stream: ${err}`));
      })();
    },
    stop_camera: (cam) => {
      try_connect(() => {
        hub.send("StopStream", cam).then((a) => console.log("Sent Stop Stream request")).catch((err) => console.log(`Error stopping stream: ${err}`));
      })();
    },
    update_camera: (c) => {
      try_connect(() => {
        hub.send("UpdateCamera", c).then((a) => console.log("sending update camera req")).catch((err) => console.log(`Couldn't update camer: ${err}`));
      })();
    },
    add_camera: (c) => {
      try_connect(() => {
        hub.send("AddCamera", c).then((a) => console.log("sending add camera req")).catch((err) => console.log(`Couldn't add camera: ${err}`));
      })();
    },
    delete_camera: (id) => {
      try_connect(() => {
        hub.send("RemoveCamera", id).then((a) => console.log("sending delete camera req")).catch((err) => console.log(`Couldn't delete camera: ${err}`));
      })();
    },
    has_permission
  };
  let fr_history_funcs = {
    on_load: async (start, end) => {
      try {
        dispatch({action: "FRHistoryLoading", payload: true});
        let res = await api.get_frlogs(start, end);
        let logs = res.logs;
        dispatch({action: "FRLogStateChanged", payload: logs});
      } catch (err) {
        console.log("failed to load history logs..");
        console.log(err);
      } finally {
        dispatch({action: "FRHistoryLoading", payload: false});
      }
    },
    format_conf: (conf) => {
      let truncated = parseFloat(conf.toString().slice(0, conf.toString().indexOf(".") + 5)) * 100;
      return conf >= 1 ? "100%" : `${truncated.toFixed(2)}%`;
    }
  };
  return /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(AppBar, {
    logout,
    toggle_settings
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mt-20"
  }, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: "/"
  }, /* @__PURE__ */ React.createElement("div", null, show_camsettings && /* @__PURE__ */ React.createElement(CameraSettings, {
    state: props.state,
    funcs: cam_funcs
  }), /* @__PURE__ */ React.createElement(Home, {
    state: props.state,
    dispatch: props.dispatch
  }))), /* @__PURE__ */ React.createElement(Route, {
    path: "/frhistory"
  }, /* @__PURE__ */ React.createElement(FRHistoryGrid, {
    state: props.state,
    funcs: fr_history_funcs
  })), /* @__PURE__ */ React.createElement(Route, {
    path: "/videoedit"
  }, /* @__PURE__ */ React.createElement(VideoEditor, {
    api
  })), /* @__PURE__ */ React.createElement(Route, {
    path: "/lineup"
  }, /* @__PURE__ */ React.createElement(LineupPage, {
    api
  })))));
}
function Root() {
  let [state, dispatch] = React.useReducer(update, init_state());
  console.log(state);
  let is_prod = false;
  let api = RemoteApiBuilder(is_prod);
  function login(user, pwd) {
    dispatch({action: "LoginStateChanged", payload: {type: "InFlight"}});
    let login_state = {type: "LoggedIn", role: "admin"};
    console.log(login_state);
    dispatch({action: "LoginStateChanged", payload: login_state});
  }
  function logout() {
    dispatch({action: "LoginStateChanged", payload: {type: "NotLoggedIn"}});
  }
  return /* @__PURE__ */ React.createElement("div", null, " ", state.login_status.type !== "LoggedIn" ? /* @__PURE__ */ React.createElement(LoginComponent, {
    model: state,
    onLogin: login
  }) : /* @__PURE__ */ React.createElement(App, {
    state,
    dispatch,
    logout,
    api
  }));
}
ReactDOM.render(/* @__PURE__ */ React.createElement(Root, null), document.getElementById("safer-app"));
