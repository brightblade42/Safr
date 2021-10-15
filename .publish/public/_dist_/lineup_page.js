import React from "../_snowpack/pkg/react.js";
import Cropper from "../_snowpack/pkg/react-cropper.js";
import "../_snowpack/pkg/cropperjs/dist/cropper.css.proxy.js";
function format_conf(conf) {
  let truncated = parseFloat(conf.toString().slice(0, conf.toString().indexOf(".") + 5)) * 100;
  return conf >= 1 ? "100%" : `${truncated.toFixed(2)}%`;
}
function FRWatchFace(props) {
  let face = props.face;
  return /* @__PURE__ */ React.createElement("div", {
    className: `ml-4 mt-4 bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border border-red-700 rounded-md w-72`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-baseline py-2 px-1 "
  }, /* @__PURE__ */ React.createElement("h1", {
    className: `ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center`
  }, face.name)), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 grid-rows-2 bg-white"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2",
    src: face.url
  }), /* @__PURE__ */ React.createElement("div", {
    className: "col-start-2 row-start-1 -ml-2 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: `mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide`
  }, format_conf(face.confidence), " "))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-lg ml-2  font-semibold text-bgray-600 tracking-wide "
  }), /* @__PURE__ */ React.createElement("div", {
    className: `flex space-x-1 mr-2 border border-red-900  uppercase text-sm font-extrabold bg-red-100 text-red-900 py-1 px-2 rounded-md flex-shrink-0 `
  }, /* @__PURE__ */ React.createElement("span", null, face.status))));
}
function KnownFace(props) {
  let face = props.face;
  return /* @__PURE__ */ React.createElement("div", {
    className: `mt-4 ml-4 bg-gray-50  shadow-xl flex flex-col flex-shrink-0 border border-green-700 rounded-md w-72`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-baseline py-2 px-1 "
  }, /* @__PURE__ */ React.createElement("h1", {
    className: `ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center`
  }, face.name)), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-2 grid-rows-2 bg-white"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2",
    src: face.url
  }), /* @__PURE__ */ React.createElement("div", {
    className: "col-start-2 row-start-1 -ml-2 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: `mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide`
  }, format_conf(face.confidence), " "))), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "text-lg ml-2  font-semibold text-bgray-600 tracking-wide "
  }), /* @__PURE__ */ React.createElement("div", {
    className: `flex space-x-1 mr-2 border border-green-900  uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 `
  }, /* @__PURE__ */ React.createElement("span", null, face.status))));
}
export function Lineup(props) {
  const lineup = props.lineup;
  function choose_face(f) {
    console.log(f);
    if (f.status === "FR Watch") {
      return /* @__PURE__ */ React.createElement(FRWatchFace, {
        face: f
      });
    } else {
      return /* @__PURE__ */ React.createElement(KnownFace, {
        face: f
      });
    }
  }
  function build_lineup() {
    if (lineup.length === 0) {
      return /* @__PURE__ */ React.createElement("div", {
        className: "mt-24 transition md:text-4xl lg:text-7xl text-green-800 opacity-20 text-center  justify-center"
      }, "Analysis");
    } else {
      return lineup.map((f) => {
        return choose_face(f);
      });
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "mt-4 mb-32 flex overflow-x-scroll text-bgray-800 bg-bgray-100 pt-0 pb-6 space-x-4 min-h-[300px] "
  }, build_lineup());
}
export function LineupPage(props) {
  const [img1_data, set_img1_data] = React.useState(void 0);
  const [img1_file, set_img1_file] = React.useState(void 0);
  const [crop_date, set_crop_data] = React.useState("#");
  const cropperRef = React.useRef(null);
  const [lineup, set_lineup] = React.useState([]);
  let api = props.api;
  function build_post(endpoint) {
    return async function(b) {
      const api_url = api.root;
      const form_data = new FormData();
      form_data.append("image", b, "file.jpg");
      try {
        const res = await fetch(`${api_url}${endpoint}`, {
          method: "POST",
          body: form_data
        });
        const json = await res.json();
        return json;
      } catch (e) {
        console.log(e);
      }
    };
  }
  const recognize = build_post("recognize-top5");
  async function top5(cv) {
    await cv.toBlob(async (b) => {
      try {
        const rec_json = await recognize(b);
        let info = rec_json.map(function(x) {
          if (x.case === "Ok") {
            let fields = x.fields;
            if (fields === void 0) {
              console.log("no fields");
              return void 0;
            }
            if (fields[0] === void 0) {
              console.log("no fields");
              return void 0;
            }
            if (fields[0].tpass_client === void 0) {
              console.log("no tpass client data");
              return void 0;
            }
            if (fields[0].tpass_client.fields[0] === void 0) {
              console.log("no tpass client data");
              return void 0;
            }
            let nurl = x.fields[0].tpass_client.fields[0].imgUrl;
            console.log(`regular url: ${nurl}`);
            if (nurl.includes("173.220.177.75")) {
              nurl = nurl.replace("173.220.177.75", "192.168.3.12");
              console.log(`replaced url: ${nurl}`);
            }
            return {
              confidence: x.fields[0].confidence,
              name: x.fields[0].tpass_client.fields[0].name,
              url: nurl,
              status: x.fields[0].tpass_client.fields[0].status,
              bbox: x.fields[0].bounding_box
            };
          }
        });
        info = info.filter(function(x) {
          return x !== void 0;
        });
        set_lineup([...info, ...lineup]);
      } catch (e) {
        console.log("could not build recognition results..");
        console.log(e);
      }
    }, "image/jpeg");
  }
  async function on_crop() {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const cv = cropper.getCroppedCanvas();
    try {
      await top5(cv);
    } catch (e) {
      console.log("God only knows...");
    }
  }
  function clear_list() {
    set_lineup([]);
  }
  function create_image(im) {
    set_img1_file(im);
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      set_img1_data(reader.result);
    }, false);
    if (im) {
      reader.readAsDataURL(im);
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-rows-2 grid-cols-1 "
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "min-h-[400px] "
  }, /* @__PURE__ */ React.createElement("div", {
    className: "ml-4 flex flex-col flex-shrink-0"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: (e) => create_image(e.target.files?.item(0))
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4 "
  }, img1_data && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Cropper, {
    src: img1_data,
    style: {height: 400, width: "100%"},
    preview: ".img-preview",
    initialAspectRatio: 16 / 9,
    guides: true,
    ref: cropperRef
  }))), img1_data && /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-end "
  }, /* @__PURE__ */ React.createElement("button", {
    className: " btn-light-indigo mt-4 text-xl",
    onClick: on_crop
  }, "Analyze"), /* @__PURE__ */ React.createElement("button", {
    className: " btn-light-indigo mt-4 ml-4 text-lg",
    onClick: clear_list
  }, "Clear"))))), /* @__PURE__ */ React.createElement(Lineup, {
    lineup
  }));
}
