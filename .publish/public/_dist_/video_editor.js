import React, {useEffect} from "../_snowpack/pkg/react.js";
import {
  update,
  init_state
} from "./analysis_state.js";
import {EditProfileDlg} from "./dlg_profile.js";
import EditMenu from "./profile_options.js";
import "./index.css.proxy.js";
import {ConfirmDeleteDlg} from "./dialogs.js";
function format_confidence(conf) {
  let truncated = parseFloat(conf.toString().slice(0, conf.toString().indexOf(".") + 5)) * 100;
  return conf >= 1 ? "100%" : `${truncated.toFixed(2)}%`;
}
function AnalyzedFrames(props) {
  const ctx = props.ctx;
  const dispatch = props.dispatch;
  if (props.state === void 0) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center"
    }, "Analyzed Frames");
  }
  const frames = props.state.analysis.frames;
  function build_frames() {
    if (frames === void 0 || frames.length === 0) {
      return /* @__PURE__ */ React.createElement("div", {
        className: "transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center mt-12"
      }, "Analyzed Frames");
    } else {
      return frames.map((frame, i) => {
        return /* @__PURE__ */ React.createElement(AFrame, {
          key: i,
          ctx,
          frame,
          dispatch
        });
      });
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex overflow-x-scroll text-wgray-200 bg-wgray-100 pt-0 ml-2 mt-4 space-x-4 min-h-[300px] m-auto"
  }, build_frames());
}
function AFrame(props) {
  const ctx = props.ctx;
  const frame = props.frame;
  const dispatch = props.dispatch;
  function combine_faces() {
    if (frame.faces_identified.length === 0) {
      return /* @__PURE__ */ React.createElement("div", {
        className: "m-auto "
      }, /* @__PURE__ */ React.createElement("div", {
        className: ""
      }, /* @__PURE__ */ React.createElement(DetectedFaces, {
        ctx,
        faces: frame.faces_detected,
        dispatch
      })));
    } else {
      const merged = frame.faces_detected.faces.map((face) => {
        let info2 = {
          id: "",
          ccode: "",
          name: "Unknown",
          fName: "Unknown",
          lName: "",
          confidence: "",
          status_type: 1,
          client_type: 7,
          status: "",
          kind: "D",
          typ: "Visitor",
          bbox: face.bounding_box
        };
        for (const ident of frame.faces_identified) {
          let conf_str = format_confidence(ident.confidence);
          if (face.bounding_box.x === ident.bbox.x && face.bounding_box.y === ident.bbox.y) {
            info2 = {
              id: ident.id,
              ccode: ident.ccode,
              name: ident.name,
              fName: ident.fName,
              lName: ident.lName,
              confidence: conf_str,
              status: ident.status,
              status_type: ident.status_type,
              client_type: ident.client_type,
              typ: ident.typ,
              kind: "I",
              bbox: ident.bbox
            };
            break;
          }
        }
        return info2;
      });
      let sorted_by_x = merged.sort((first, second) => {
        if (first.bbox.x < second.bbox.x) {
          return -1;
        }
        if (first.bbox.x > second.bbox.x) {
          return 1;
        }
        return 0;
      });
      return /* @__PURE__ */ React.createElement("div", {
        className: "m-auto"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "p-4"
      }, /* @__PURE__ */ React.createElement(IdentifiedFaces, {
        ctx,
        faces: sorted_by_x,
        dispatch
      })));
    }
  }
  return combine_faces();
}
function DetectedFace(props) {
  const c_ref = React.useRef();
  const data = props.data;
  const dispatch = props.dispatch;
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
    ctx.putImageData(data, 0, 0, 10, 10, cv.width, cv.height);
  }
  React.useEffect(() => {
    draw_face();
  }, [data]);
  return /* @__PURE__ */ React.createElement(UnknownFace, {
    c_ref,
    data,
    dispatch
  });
}
function DetectedFaces(props) {
  const ctx = props.ctx;
  const faces = props.faces;
  const [datas, set_datas] = React.useState([]);
  function build_faces() {
    if (faces === void 0) {
      return;
    }
    let sorted_by_x = faces.faces.sort((first, second) => {
      if (first.bounding_box.x < second.bounding_box.x) {
        return -1;
      }
      if (first.bounding_box.x > second.bounding_box.x) {
        return 1;
      }
      return 0;
    });
    let dd = faces.faces.map((face) => {
      const box = face.bounding_box;
      const imgW = 150;
      if (imgW - box.width < 5) {
        return ctx.getImageData(box.x, box.y, imgW, 175);
      }
      return ctx.getImageData(box.x - 45, box.y - 25, imgW, 175);
    });
    set_datas(dd);
  }
  useEffect(() => {
    build_faces();
  }, [faces]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex text-wgray-200 bg-wgray-100 "
  }, datas.map((d, i) => {
    return /* @__PURE__ */ React.createElement(DetectedFace, {
      key: i,
      data: d,
      index: i,
      dispatch: props.dispatch
    });
  }));
}
function FRWatchFace(props) {
  let face = props.face;
  let c_ref = props.c_ref;
  let dispatch = props.dispatch;
  let menu_funcs = {
    begin_delete_profile: () => {
      dispatch({action: "ProfileActionChanged", payload: {type: "Deleting", msg: face}});
      dispatch({action: "SelectedIdentityChanged", payload: void 0});
    },
    edit_profile: () => {
      dispatch({action: "ProfileActionChanged", payload: {type: "Creating"}});
      dispatch({action: "SelectedIdentityChanged", payload: face});
      dispatch({action: "SelectedDetectionChanged", payload: props.data});
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: `bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border-2 border-red-700 rounded-md w-72`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-baseline py-2 px-1 "
  }, /* @__PURE__ */ React.createElement("h1", {
    className: `ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center`
  }, face.name), /* @__PURE__ */ React.createElement(EditMenu, {
    state: props.state,
    face,
    funcs: menu_funcs
  })), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 grid-rows-2 bg-white"
  }, /* @__PURE__ */ React.createElement("canvas", {
    ref: c_ref,
    className: "col-start-1 row-start-1 row-span-2"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "col-start-2 row-start-1 -ml-2 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: `mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide`
  }, face.confidence, " "))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-lg ml-2  font-semibold text-bgray-600 tracking-wide "
  }), /* @__PURE__ */ React.createElement("div", {
    className: `flex space-x-1 mr-2 border border-red-900  uppercase text-sm font-extrabold bg-red-100 text-red-900 py-1 px-2 rounded-md flex-shrink-0 `
  }, /* @__PURE__ */ React.createElement("span", null, face.status))));
}
function KnownFace(props) {
  let face = props.face;
  let c_ref = props.c_ref;
  let dispatch = props.dispatch;
  let menu_funcs = {
    begin_delete_profile: () => {
      dispatch({action: "ProfileActionChanged", payload: {type: "Deleting", msg: face}});
      dispatch({action: "SelectedIdentityChanged", payload: void 0});
    },
    edit_profile: () => {
      dispatch({action: "ProfileActionChanged", payload: {type: "Creating"}});
      dispatch({action: "SelectedIdentityChanged", payload: face});
      dispatch({action: "SelectedDetectionChanged", payload: props.data});
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: `bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border-2 border-green-700 rounded-md w-72`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-baseline py-2 px-1 "
  }, /* @__PURE__ */ React.createElement("h1", {
    className: `ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center`
  }, face.name), /* @__PURE__ */ React.createElement(EditMenu, {
    state: props.state,
    face,
    funcs: menu_funcs,
    create: false
  })), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 grid-rows-2 bg-white"
  }, /* @__PURE__ */ React.createElement("canvas", {
    ref: c_ref,
    className: "col-start-1 row-start-1 row-span-2"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "col-start-2 row-start-1 -ml-2 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: `mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide`
  }, face.confidence, " "))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-lg ml-2  font-semibold text-bgray-600 tracking-wide "
  }), /* @__PURE__ */ React.createElement("div", {
    className: `flex space-x-1 mr-2 border border-green-900  uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 `
  }, /* @__PURE__ */ React.createElement("span", null, face.status))));
}
function UnknownFace(props) {
  let c_ref = props.c_ref;
  let dispatch = props.dispatch;
  let data = props.data;
  function begin_create_profile() {
    dispatch({action: "ProfileActionChanged", payload: {type: "Creating"}});
    dispatch({action: "SelectedDetectionChanged", payload: data});
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: `bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border border-gray-700 rounded-md w-72 `
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-baseline py-2 px-1 opacity-80"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: `ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-gray-600 text-center`
  }, "Unknown")), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 grid-rows-2 bg-white"
  }, /* @__PURE__ */ React.createElement("canvas", {
    ref: c_ref,
    className: "col-start-1 row-start-1 row-span-2 "
  }), /* @__PURE__ */ React.createElement("div", {
    className: "col-start-2 row-start-1 -ml-2 opacity-80"
  }, /* @__PURE__ */ React.createElement("div", {
    className: `mt-8 text-2xl text-center font-extrabold text-gray-600 tracking-wide`
  }, "0%"))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md opacity-80"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-lg ml-2  font-semibold text-bgray-600 tracking-wide "
  }), /* @__PURE__ */ React.createElement("button", {
    onClick: begin_create_profile,
    className: `flex space-x-1 mr-2 border border-gray-900 hover:bg-gray-300 uppercase text-sm font-extrabold bg-gray-100 text-gray-600 py-1 px-2 rounded-md flex-shrink-0 `
  }, /* @__PURE__ */ React.createElement("span", null, "Enroll"))));
}
function IdentifiedFace(props) {
  const c_ref = React.useRef();
  const data = props.data;
  const dispatch = props.dispatch;
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
    ctx.putImageData(data.img, 0, 0, 10, 10, cv.width, cv.height);
  }
  React.useEffect(() => {
    draw_face();
  }, [data]);
  function info_color(face) {
    if (face.name === "Unknown") {
      face.name = "Unknown Face";
      face.status = "None";
      face.confidence = "0%";
      return "gray";
    } else if (face.status === "FR Watch") {
      return "red";
    } else {
      return "green";
    }
  }
  function draw_card() {
    if (data.face.name === "Unknown") {
      return /* @__PURE__ */ React.createElement(UnknownFace, {
        c_ref,
        dispatch,
        data: props.data.img
      });
    } else if (data.face.status === "FR Watch") {
      return /* @__PURE__ */ React.createElement(FRWatchFace, {
        c_ref,
        face: data.face,
        data: props.data.img,
        dispatch
      });
    } else {
      return /* @__PURE__ */ React.createElement(KnownFace, {
        c_ref,
        face: data.face,
        data: props.data.img,
        dispatch
      });
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, " ", data ? draw_card() : /* @__PURE__ */ React.createElement("div", null, "none"), " ");
}
function IdentifiedFaces(props) {
  let ctx = props.ctx;
  let faces = props.faces;
  let dispatch = props.dispatch;
  let [datas, set_datas] = React.useState([]);
  function build_faces() {
    if (faces === void 0) {
      return;
    }
    let dd = faces.map((face) => {
      const box = face.bbox;
      const imgW = 150;
      if (imgW - box.width < 5) {
        return {
          img: ctx.getImageData(box.x, box.y, imgW, 175),
          face
        };
      }
      return {
        img: ctx.getImageData(box.x - 45, box.y - 25, imgW, 175),
        face
      };
    });
    set_datas(dd);
  }
  useEffect(() => {
    build_faces();
  }, [faces]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, datas.map((d, i) => {
    return /* @__PURE__ */ React.createElement(IdentifiedFace, {
      key: i,
      data: d,
      dispatch
    });
  }));
}
function MyVideo(props) {
  function createObjectURL(file) {
    if (window.webkitURL) {
      return window.webkitURL.createObjectURL(file);
    } else if (window.URL && window.URL.createObjectURL) {
      return window.URL.createObjectURL(file);
    } else {
      return null;
    }
  }
  function play() {
    console.log("playing from MyVideo");
  }
  function pause() {
    console.log("pausing from MyVideo");
  }
  return /* @__PURE__ */ React.createElement("video", {
    controls: true,
    id: "vid_player",
    muted: true,
    loop: true,
    ref: props.vidref,
    width: 640,
    src: createObjectURL(props.video),
    onPlay: play,
    onPause: pause,
    onTimeUpdate: props.ntime
  });
}
const MemVid = React.memo(MyVideo);
export function VideoEditor(props) {
  const [video, set_video] = React.useState();
  const video_height = 600;
  const video_width = 800;
  const canvasRef = React.useRef();
  const vidplayer = React.useRef();
  let [ctx, set_context] = React.useState(void 0);
  let [frame_num, set_frame_num] = React.useState(0);
  let [state, dispatch] = React.useReducer(update, init_state());
  let api = props.api;
  useEffect(() => {
    const timer = setInterval(() => {
      capture_frame();
    }, 1300);
    return () => clearInterval(timer);
  });
  useEffect(() => {
    const get_profile_types = async () => {
      try {
        let client_types = await api.get_client_types();
        dispatch({action: "ClientTypesChanged", payload: client_types});
      } catch (e) {
        console.log("error getting client types");
        console.log(e);
      }
    };
    const get_status_types = async () => {
      try {
        let status_types = await api.get_status_types();
        dispatch({action: "StatusTypesChanged", payload: status_types});
      } catch (e) {
        console.log("error getting status types");
        console.log(e);
      }
    };
    get_profile_types();
    get_status_types();
  }, []);
  function capture_frame() {
    if (canvasRef.current !== void 0) {
      let cv = canvasRef.current;
      cv.width = 2150;
      cv.height = 900;
      let lctx = cv.getContext("2d");
      set_context(lctx);
      let vc = vidplayer.current;
      try {
        ctx.drawImage(vidplayer.current, 0, 0);
        cv.toBlob(async (b) => {
          let d_res = await detect(b);
          draw_boundaries(ctx, d_res.faces);
          let rec_json = await recognize(b);
          if (rec_json.error !== void 0) {
            console.log("VERY UNDUDE");
            console.log(rec_json);
            return;
          }
          let r = rec_json.map(function(x) {
            if (x.case === "Ok") {
              return {
                id: x.fields[0].id,
                ccode: x.fields[0].tpass_client.fields[0].ccode,
                confidence: x.fields[0].confidence,
                name: x.fields[0].tpass_client.fields[0].name,
                fName: x.fields[0].tpass_client.fields[0].fName,
                lName: x.fields[0].tpass_client.fields[0].lName,
                status: x.fields[0].tpass_client.fields[0].status,
                client_type: x.fields[0].tpass_client.fields[0].clntTid,
                status_type: x.fields[0].tpass_client.fields[0].sttsId,
                typ: x.fields[0].tpass_client.fields[0].typ,
                bbox: x.fields[0].bounding_box
              };
            }
          });
          set_frame_num(frame_num + 1);
          let a_frame = {
            id: 0,
            elapsed_time: 0,
            frame_num,
            faces_detected: d_res,
            faces_identified: r,
            src_frame: void 0
          };
          dispatch({action: "AnalyzedFrameChanged", payload: a_frame});
        }, "image/jpeg");
      } catch (e) {
        console.log(`oops: ${e}`);
      }
    }
  }
  function create_video(v) {
    set_video(v);
  }
  function build_post(endpoint) {
    return async function(b) {
      let api_url = api.root;
      let form_data = new FormData();
      form_data.append("image", b, "file.jpg");
      try {
        let res = await fetch(`${api_url}${endpoint}`, {
          method: "POST",
          body: form_data
        });
        let json = await res.json();
        return json;
      } catch (e) {
        console.log(e);
      }
    };
  }
  function draw_boundaries(ctx2, faces) {
    faces.forEach(function(item, index, array) {
      let box = item.bounding_box;
      let rectangle = new Path2D();
      rectangle.rect(box.x, box.y, box.width, box.height);
      ctx2.strokeStyle = "green";
      ctx2.strokeWidth = 2;
      ctx2.stroke(rectangle);
    });
  }
  const detect = build_post("detect-frame");
  const recognize = build_post("recognize-frame");
  function snap(e) {
    if (e.code !== "Enter" && e.code !== "KeyC") {
      return;
    }
    capture_frame();
  }
  function VideoQuadrant() {
    if (video) {
      return /* @__PURE__ */ React.createElement("div", {
        className: "flex-shrink-0",
        onKeyDown: snap
      }, /* @__PURE__ */ React.createElement(MemVid, {
        video,
        vidref: vidplayer
      }));
    } else
      return /* @__PURE__ */ React.createElement("div", {
        className: "ml-20 mt-12 flex-shrink-0 transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center"
      }, " Video");
  }
  let profile_funcs = {
    save_profile: async (p) => {
      dispatch({action: "ProfileActionChanged", payload: {type: "Saving", msg: p}});
      let profile_res = await api.create_profile(p);
      dispatch({action: "ProfileActionChanged", payload: {type: "Completed"}});
      dispatch({action: "ProfileActionChanged", payload: {type: "None"}});
    },
    edit_profile: async (p) => {
      console.log("in edit_profile callback");
      dispatch({action: "ProfileActionChanged", payload: {type: "Saving", msg: p}});
      let profile_res = await api.edit_profile(p);
      console.log("profile results are ....");
      console.log(profile_res);
      dispatch({action: "ProfileActionChanged", payload: {type: "Completed"}});
      dispatch({action: "ProfileActionChanged", payload: {type: "None"}});
    },
    delete_profile: async () => {
      console.log("in delete_profile callback. Sweet!");
      console.log(state.profile_action_state);
      if (state.profile_action_state.type === "Deleting") {
        let face = state.profile_action_state.msg;
        let profile_res = await api.delete_profile(face.ccode.toString(), face.id);
        console.log("delete profile results ------");
        console.log(profile_res);
        dispatch({action: "ProfileActionChanged", payload: {type: "Completed"}});
        dispatch({action: "ProfileActionChanged", payload: {type: "None"}});
      } else {
        console.log("ERROR: expected to be in Deleting state.");
      }
    },
    cancel: () => {
      console.log("Cancel profile update");
      dispatch({action: "ProfileActionChanged", payload: {type: "None"}});
    },
    dispatch
  };
  function is_profile_deleting() {
    console.log("what my state..?");
    console.log(state.profile_action_state.type);
    let is_del = state.profile_action_state.type === "Deleting";
    console.log(is_del);
    return is_del;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(EditProfileDlg, {
    state,
    funcs: profile_funcs
  }), /* @__PURE__ */ React.createElement(ConfirmDeleteDlg, {
    state,
    onConfirm: profile_funcs.delete_profile,
    onCancel: profile_funcs.cancel,
    confirm_msg: "Delete",
    confirm_desc: "Are you sure you want to delete profile?",
    title: "Delete Profile"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, /* @__PURE__ */ React.createElement("input", {
    className: "ml-4 mb-4 text-gray-900 text-lg",
    type: "file",
    accept: "video/*",
    onChange: (e) => create_video(e.target.files?.item(0))
  }), /* @__PURE__ */ React.createElement("div", {
    className: "flex ml-4"
  }, VideoQuadrant(), /* @__PURE__ */ React.createElement("div", {
    className: " w-[800px]"
  }, /* @__PURE__ */ React.createElement("canvas", {
    id: "vid_capture",
    ref: canvasRef,
    className: "ml-4 w-[800px] h-[360px]"
  }))))), /* @__PURE__ */ React.createElement(AnalyzedFrames, {
    ctx,
    state,
    dispatch
  }));
}
