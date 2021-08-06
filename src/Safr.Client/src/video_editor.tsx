import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Player} from 'video-react';
//import "../../../node_modules/video-react/dist/video-react.css"
import './index.css';
import {BadFace} from "./facecards";


function DetectedFace (props) {
    let c_ref  = React.useRef();
    let data = props.data

    function draw_face() {
        let cv = c_ref.current;
        if (cv === undefined) { return; }
        if(cv === null) {return; }
        console.log("in use draw_face");
        let ctx = cv.getContext('2d');

        ctx.clearRect(0,0, cv.width, cv.height);
        ctx.putImageData(data, 0,0);
    }

    React.useEffect(() => {
            draw_face()
    }, [data])
    return (
        <>
        {data ?
            <div className="border border-green-900 w-40 mr-4">
                <canvas ref={c_ref}/>
                <div className="text-yellow-700 uppercase font-semibold">unknown</div>
            </div>

                : <div>none</div>
        }
        </>
    )
}


function DetectedFaces (props) {

    let ctx = props.ctx;
    let faces = props.faces;
    let [datas, set_datas] = React.useState([]);

    function build_faces() {
        if (faces === undefined) {
            return;
        }
        let dd = faces.faces.map((face) => {
            const box  = face.bounding_box;
            console.log("---------- BOX -----------");
            console.log(face);
            console.log("Oh hey mmman");
            //return ctx.getImageData(box.x, box.y, box.width + 50, box.height + 50);
            return ctx.getImageData(box.x, box.y, 150, 150);

        });

        set_datas(dd); //the image data for each detected face.

    }

    useEffect(() => {
         build_faces()
    }, [faces])

    return (
        <div className="flex text-wgray-200 bg-wgray-100 ">
            {datas.map((d => {
                return <DetectedFace data={d} />
            }))}
        </div>

    )
}

function MyVideo (props) {
      console.log("my special video");
      function createObjectURL ( file ) {
            if ( window.webkitURL ) {
                return window.webkitURL.createObjectURL( file );
            } else if ( window.URL && window.URL.createObjectURL ) {
                return window.URL.createObjectURL( file );
            } else {
                return null;
            }
      }

      function play() {
          console.log("playing from MyVideo");
         //props.play();
      }

      function snap() {
          console.log("Snappy Snap snap!!")
      }

      return <video controls
           id="vid_player"
           //onKeyDown={snap}
           ref={props.vidref}
           width={800}
           height={500}
           src={createObjectURL(props.video)}
           onPlay={play}
           onPause={props.pause}
           onTimeUpdate={props.ntime}

      />
}

const MemVid = React.memo(MyVideo);


export function VideoEditor(props) {

    const [video, set_video] = React.useState();

    //const [video_width, set_video_width] = React.useState(500);
    //const [video_height, set_video_height] = React.useState(200);
    const video_height = 800;
    const video_width = 500;
    const [img_src, set_img_src] = React.useState("");
    const canvasRef = React.useRef();
    const vidplayer = React.useRef();
    let [ctx, set_context] = React.useState(undefined); //hmmm
    let [detected_faces, set_detected_faces] = React.useState(undefined);


    function create_video(v) {
        console.log(v);
        set_video(v);
    }

    function play() {
        console.log("playing event triggered");
        // @ts-ignore
        console.log(canvasRef.current.id)
    }
    function pause() {
        console.log("pause event triggered");
    }
    function ntime() {
        console.log("time updated")
    }

    function start () {
        console.log(vidplayer);
        //vidplayer.current.play();
    }

    function build_post (endpoint) {

       return async function (b: Blob) {
           let api_url = `http://localhost:8085/fr/`;
           let form_data = new FormData();
           form_data.append("image", b, "file.jpg");
           //fetch(`${api_url}recognize-frame`,
           try {
               let res = await fetch(`${api_url}${endpoint}`,
                   {
                       method: 'POST',
                       body: form_data
                   });

               let json = await res.json()
               return json
           } catch (e) {
               console.log(e)
           }
       }

    }

    function draw_boundaries (ctx, faces) {

        faces.forEach(function (item, index, array) {
                let box = item.bounding_box;
                let rectangle = new Path2D();
                rectangle.rect(box.x, box.y, box.width, box.height);
                ctx.strokeStyle = "green";
                ctx.strokeWidth = 2;
                ctx.stroke(rectangle);
        } );

    }

    function load_thumbs(ctx, faces) {

        console.log(" where the data man");
        let thumbs = faces.map((f) => {
            let box = f.bounding_box;
            let data = ctx.getImageData(box.x, box.y, box.width, box.height);
            return data;
        });

        //set_copied_faces(thumbs);
    }

    const detect    = build_post("detect-frame");
    const recognize = build_post("recognize-frame");

    function snap (e) {
        if(e.code !== "Enter" && e.code !== "KeyC") {
            return;
        }
        if (canvasRef.current !== undefined) {
            let cv = canvasRef.current;
            cv.width = 2150 //video_width;
            cv.height = 900;
            let lctx = cv.getContext('2d');
            set_context(lctx);
            ctx.drawImage(vidplayer.current, 0, 0);
            cv.toBlob(async (b)=> {
                 let d_res = await detect(b);
                 set_detected_faces(d_res);
                 // @ts-ignore
                 draw_boundaries(ctx,d_res.faces);
                 let rec_json = await recognize(b);
                //console.log(JSON.stringify(rec_json))

            }, "image/jpeg");
        }

    }
    // @ts-ignore
    return (
        <>
        <div>Let's edit some Video!</div>

            <input type="file" accept="video/*"
                   onChange={(e) => create_video(e.target.files?.item(0))} />

        <div
            onKeyDown={snap}
        >
            {video &&

                <MemVid
                       //play={play}
                          //pause={pause}
                          //ntime={ntime}
                          video={video}
                          vidref={vidplayer}  />


            }

            {/*
                <div className="flex mt-2">
                    <button className="btn-indigo" onClick={snap}>Snap</button>
                    <button className="btn-indigo" onClick={start}>Start</button>
                </div>

            */}

            <div className="mt-8">
                <canvas id="vid_capture" ref={canvasRef} className="w-[900px]"/>
            </div>
            <div className="mt-2">
                <DetectedFaces ctx={ctx} faces={detected_faces}/>
            </div>
        </div>
        </>
    )
}

