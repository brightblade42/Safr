import React, {useEffect} from 'react';
import {AnalysisState, Analysis, AnalyzedFrame, update, init_state, AnalysisMsg, VideoPlayState} from "./analysis_state";
import './index.css';
import {info} from "autoprefixer";

function format_confidence (conf: number)  {
    let truncated = parseFloat(conf.toString().slice(0, (conf.toString().indexOf(".")) + 5)) * 100;
    return (conf >= 1) ? "100%" : `${truncated.toFixed(2)}%`;
}

function AnalyzedFrames (props) {
    const ctx = props.ctx;
    if (props.state === undefined) {
        return <div className="transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center">Analyzed Frames</div>
    }
    const frames = props.state.analysis.frames

    function build_frames(): any {

        if (frames === undefined || frames.length === 0) {
            return <div className="transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center mt-12">Analyzed Frames</div>
        } else {

            return frames.map(frame => {
                return  <AFrame ctx={ctx} frame={frame} />
            })
        }

    }
    return (
        <div className="flex overflow-x-scroll text-wgray-200 bg-wgray-100 pt-0 ml-2 mt-4 space-x-4 min-h-[300px] m-auto">
            {build_frames()}
        </div>
    )
}

function AFrame (props) {

    const ctx = props.ctx;
    const frame = props.frame

    //make detection and identification a single list.
    //detected but not identified are "unknowns"
    function combine_faces() {
        if (frame.faces_identified.length === 0) {

            return(

                <div className="m-auto ">
                    <div className="" >
                        <DetectedFaces ctx={ctx} faces={frame.faces_detected} />
                    </div>

                </div>)

        }

        else {

            const merged = frame.faces_detected.faces.map(face => {

                let info = {
                    name: "Unknown",
                    confidence: "",
                    status: "",
                    kind: "D",
                    bbox: face.bounding_box
                };

                for (const ident of frame.faces_identified) {
                    //we know they are the same person because only a single entity can occupy the same space
                    //in time..unless it's Brundle fly.

                    let conf_str = format_confidence(ident.confidence);

                    if (face.bounding_box.x === ident.bbox.x && face.bounding_box.y === ident.bbox.y) {
                        info = {
                            name: ident.name,
                            confidence: conf_str,
                            status: ident.status,
                            kind: "I",
                            bbox: ident.bbox
                        }
                        break;
                    }

                }
                return info;
            })

            let sorted_by_x = merged.sort((first, second) => {
                if (first.bbox.x < second.bbox.x) {
                    return -1;
                }
                if (first.bbox.x > second.bbox.x) {
                    return 1;
                }

                return 0;

            })

           return (
               <div className="m-auto">
                   <div className="p-4" >
                       <IdentifiedFaces ctx={ctx} faces={sorted_by_x} />
                   </div>
               </div>
           )

        }
    }

    return combine_faces()
}


function DetectedFace (props) {

    const c_ref  = React.useRef();
    const data = props.data

    function draw_face() {
        const cv = c_ref.current;
        if (cv === undefined) { return; }
        if(cv === null) {return; }
        // @ts-ignore
        const ctx = cv.getContext('2d');
        // @ts-ignore
        ctx.clearRect(0,0, cv.width, cv.height);
        // @ts-ignore
        ctx.putImageData(data, 0,0,10,10, cv.width, cv.height) ;
    }

    React.useEffect(() => { draw_face() }, [data])

    return <UnknownFace c_ref={c_ref } />
}


function DetectedFaces (props) {

    const ctx = props.ctx;
    const faces = props.faces;
    const [datas, set_datas] = React.useState([]);

    function build_faces() {
        if (faces === undefined) {
            return;
        }


        let sorted_by_x = faces.faces.sort((first, second) => {
            console.log(`${first.bounding_box.x} : ${second.bounding_box.x}`)
            if (first.bounding_box.x < second.bounding_box.x) {
                return -1;
            }
            if (first.bounding_box.x > second.bounding_box.x) {
                return 1;
            }

            return 0;

        })


        let dd = faces.faces.map((face) => {
            const box  = face.bounding_box;
            const imgW = 150;
            if ((imgW - box.width) < 5) {
                return ctx.getImageData(box.x , box.y , imgW, 175);

            }
            return ctx.getImageData(box.x -45, box.y -25, imgW, 175);
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

function FRWatchFace (props) {
    let face = props.face;
    let c_ref = props.c_ref

    return (

        <div className={`bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border-2 border-red-700 rounded-md w-72`}>
            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className={`ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center`}>{face.name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <canvas ref={c_ref} className="col-start-1 row-start-1 row-span-2"/>

                <div className="col-start-2 row-start-1 -ml-2 ">
                    <div className={`mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide`}>{face.confidence} </div>
                </div>

            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md">

                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide "></div>

                <div
                    className={`flex space-x-1 mr-2 border border-red-900  uppercase text-sm font-extrabold bg-red-100 text-red-900 py-1 px-2 rounded-md flex-shrink-0 `}>
                    <span>{face.status}</span>
                </div>


            </div>
        </div> )

}


function KnownFace (props) {
    let face = props.face;
    let c_ref = props.c_ref

    return (

        <div className={`bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border-2 border-green-700 rounded-md w-72`}>
            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className={`ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center`}>{face.name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <canvas ref={c_ref} className="col-start-1 row-start-1 row-span-2"/>

                <div className="col-start-2 row-start-1 -ml-2 ">
                    <div className={`mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide`}>{face.confidence} </div>
                </div>

            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md">

                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide "></div>

                <div
                    className={`flex space-x-1 mr-2 border border-green-900  uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 `}>
                    <span>{face.status}</span>
                </div>


            </div>
        </div> )

}


function UnknownFace (props) {
    let c_ref = props.c_ref

    return (

        <div className={`bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border border-gray-700 rounded-md w-72 `}>
            <div className="flex justify-between items-baseline py-2 px-1 opacity-80">
                <h1 className={`ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-gray-600 text-center`}>Unknown</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <canvas ref={c_ref} className="col-start-1 row-start-1 row-span-2 "/>

                <div className="col-start-2 row-start-1 -ml-2 opacity-80">
                    <div className={`mt-8 text-2xl text-center font-extrabold text-gray-600 tracking-wide`}>0%</div>
                </div>

            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md opacity-80">

                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide "></div>

                <div
                    className={`flex space-x-1 mr-2 border border-gray-900  uppercase text-sm font-extrabold bg-gray-100 text-gray-600 py-1 px-2 rounded-md flex-shrink-0 `}>
                    <span>None</span>
                </div>


            </div>
        </div> )

}



function IdentifiedFace (props) {

    const c_ref  = React.useRef();
    const data = props.data

    function draw_face() {
        const cv = c_ref.current;
        if (cv === undefined) { return; }
        if(cv === null) {return; }
        // @ts-ignore
        const ctx = cv.getContext('2d');

        // @ts-ignore
        ctx.clearRect(0,0, cv.width, cv.height);
        // @ts-ignore
        ctx.putImageData(data.img, 0,0,10,10, cv.width, cv.height) ;
    }

    React.useEffect(() => { draw_face() }, [data])

    function info_color(face) {
        if (face.name === "Unknown") {
            face.name = "Unknown Face"
            face.status = "None" //bad bad naughty mutable madnes! man
            face.confidence = "0%"
            return "gray"
        } else if (face.status === "FR Watch") {
           return "red"
        }
        else {
            return "green"
        }
    }


    function draw_card () {

            if (data.face.name === "Unknown") {
                return <UnknownFace c_ref={c_ref}  />
            } else if (data.face.status === "FR Watch") {
                return <FRWatchFace c_ref={c_ref} face={data.face} />
            } else {
                return <KnownFace c_ref={c_ref} face={data.face} />
            }

    }
    return <> {data ? draw_card() : <div>none</div> } </>
}


function IdentifiedFaces (props) {

    let ctx = props.ctx;
    let faces = props.faces;
    let [datas, set_datas] = React.useState([]);

    function build_faces() {
        if (faces === undefined) { return; }

        let dd = faces.map((face) => {
            const box  = face.bbox;
            const imgW = 150;
            if ((imgW - box.width) < 5) {
                return {
                    img: ctx.getImageData(box.x , box.y , imgW, 175),
                    face: face
                }
            }
            return {
                img: ctx.getImageData(box.x -45, box.y -25, imgW, 175),
                face: face
            }

        });

        set_datas(dd); //the image data for each detected face.

    }

    useEffect(() => {
        build_faces()
    }, [faces])

    return (
        <div className="flex">
            {datas.map((d => {
                return <IdentifiedFace data={d}  />
            }))}
        </div>
    )
}

function MyVideo (props) {

    function createObjectURL ( file ) {
            if ( window.webkitURL ) {
                return window.webkitURL.createObjectURL( file );
            } else if ( window.URL && window.URL.createObjectURL ) {
                return window.URL.createObjectURL( file );
            } else {
                return null;
            }
      }

    function play() { console.log("playing from MyVideo"); }
    function pause() { console.log("pausing from MyVideo"); }

     return(
         <video controls
                id="vid_player"
                muted={true}
                loop
                ref={props.vidref}
                width={640}
                src={createObjectURL(props.video)}
                onPlay={play}
                onPause={pause}
                onTimeUpdate={props.ntime} />
     )
}

const MemVid = React.memo(MyVideo);

export function VideoEditor(props) {

    const [video, set_video] = React.useState();
    //const [video_width, set_video_width] = React.useState(500);
    //const [video_height, set_video_height] = React.useState(200);
    const video_height = 600;
    const video_width = 800;
    //paths
    const canvasRef = React.useRef();
    const vidplayer = React.useRef();
    let [ctx, set_context] = React.useState(undefined); //hmmm
    let [image_comparison, set_image_comparison] = React.useState(undefined);
    let [frame_num, set_frame_num] = React.useState(0);
    let [state, dispatch] = React.useReducer(update, init_state()); //analysisState

    useEffect(() => {
        const timer = setInterval(() => {
                capture_frame();

        }, 1300);
        return () => clearInterval(timer)
    })

    function capture_frame() {

        if (canvasRef.current !== undefined) {
            let cv = canvasRef.current ;

            // @ts-ignore
            cv.width = 2150 //video_width; why is it that size?
            // @ts-ignore
            cv.height = 900;
            // @ts-ignore
            let lctx = cv.getContext('2d');
            set_context(lctx);
            let vc = vidplayer.current
            try {
                ctx.drawImage(vidplayer.current, 0,0);

                // @ts-ignore
                cv.toBlob(async (b) => {
                    let d_res = await detect(b);
                    // @ts-ignore
                    draw_boundaries(ctx, d_res.faces);
                    let rec_json = await recognize(b);
                    //extract data

                    let r = rec_json.map(function (x) {
                        if (x.case === "Ok") {
                            return {
                                confidence: x.fields[0].confidence,
                                name: x.fields[0].tpass_client.fields[0].name,
                                status: x.fields[0].tpass_client.fields[0].status,
                                bbox: x.fields[0].bounding_box
                            }
                        }
                    });
                    set_frame_num(frame_num +1);

                    let a_frame: AnalyzedFrame  = {
                        id: 0, elapsed_time: 0, frame_num: frame_num,
                        faces_detected: d_res, //detected_faces,
                        faces_identified: r, //identified_faces,
                        src_frame: undefined
                    }

                    dispatch({action: "AnalyzedFrameChanged", payload: a_frame});


                }, "image/jpeg");
            } catch (e) {
                console.log(`oops: ${e}`)
            }

        }
    }

    function create_video(v) {
        set_video(v);
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


    async function verify_faces(face1: Blob, face2: Blob) {

        //TODO: url for runtime not devtime
        let api_url = `http://localhost:8085/fr/`;
        let endpoint = "verify_faces";
        let form_data = new FormData();
        form_data.append("image1", face1, "image1.jpg");
        form_data.append("image2", face2, "image2.jpg");
        try {
            let res = await fetch(`${api_url}${endpoint}`,
                {
                    method: 'POST',
                    body: form_data
                });

            let json = await res.json();
            await set_image_comparison(json.confidence);

            console.log(json);
            console.log(image_comparison.image1_face);
            return json;
        } catch (e) {
            console.log(e);
        }
    }


    //The boxes around the faces on a captured frame
    //TOOD: can we do this after we draw to the cropped context
    //don't need to see bboxes in cropped images
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

    const detect    = build_post("detect-frame");
    const recognize = build_post("recognize-frame");

    function snap (e) {

        if(e.code !== "Enter" && e.code !== "KeyC") { return; }
        capture_frame();
    }

    function VideoQuadrant () {

        if (video) {
            return(
            <div className="flex-shrink-0" onKeyDown={snap} >
                <MemVid video={video} vidref={vidplayer} />
            </div>
            )
        } else
        return(
            <div className="ml-20 mt-12 flex-shrink-0 transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center" > Video</div>
        )
    }

    function CaptureQuadrant() {

        if (video) {
            return (

                <div className="w-[800px]">
                    <canvas id="vid_capture" ref={canvasRef} className="ml-4 w-[800px] h-[360px]"/>
                </div>
            )
        }
        else {
            return(
                <div className="ml-20 mt-12 flex-shrink-0 transition md:text-4xl lg:text-7xl text-green-800 opacity-10 text-center" > Frame</div>
            )

        }
    }
// @ts-ignore
    return (
        <>
            <div className="flex">
                <div className="flex flex-col">
                    <input className="ml-4 mb-4 text-gray-900 text-lg" type="file" accept="video/*"
                           onChange={(e) => create_video(e.target.files?.item(0))} />

                    <div className="flex ml-4">
                        {VideoQuadrant()}

                        <div className=" w-[800px]">
                            <canvas id="vid_capture" ref={canvasRef} className="ml-4 w-[800px] h-[360px]"/>
                        </div>
                    </div>
                </div>

            </div>

            <AnalyzedFrames ctx={ctx} state={state} />
        </>
    )
}
