import React, {useEffect} from 'react';
import {AnalysisState, Analysis, AnalyzedFrame, update, init_state, AnalysisMsg, VideoPlayState} from "./analysis_state";
import './index.css';


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

                    <div className="pt-4 font-semibold text-2xl text-center text-bgray-700 opacity-60">
                        No Matches
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
                    if (face.bounding_box.x === ident.bbox.x && face.bounding_box.y === ident.bbox.y) {
                        info = {
                            name: ident.name,
                            confidence: ident.confidence,
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

    return (
        <>
        {data ?
            <div className="border border-green-900 w-40 mr-4">
                <canvas ref={c_ref}/>
                <div className="text-yellow-700 uppercase font-semibold mt-6"></div>
            </div>

                : <div>none</div>
        }
        </>
    )
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
            return ctx.getImageData(box.x -35, box.y -15, imgW, 175);
            //return ctx.getImageData(box.x, box.y, 150, 150);
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

    return (
        <>
            {data ?
                <div className="border-2 w-52 mr-4">
                    <div className={`${data.face.name === "Unknown" ? "text-yellow-700" : "text-green-700"}
                     ml-2 uppercase font-semibold`}>{data.face.name}</div>

                    <canvas ref={c_ref}/>
                    <div className="ml-2">
                        <div className="text-green-700 uppercase font-semibold">{data.face.confidence}</div>
                        <div className="text-green-700 uppercase font-semibold">{data.face.status}</div>
                    </div>
                </div>

                : <div>none</div>
            }
        </>
    )
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
                img: ctx.getImageData(box.x -35, box.y -15, imgW, 175),
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
                width={800}
                height={500}
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
    const video_height = 800;
    const video_width = 500;
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

// @ts-ignore
    return (
        <>
            <div className="flex flex-shrink-0">
                <div className="flex flex-col">
                    <input type="file" accept="video/*"
                           onChange={(e) => create_video(e.target.files?.item(0))} />

                    <div className="flex flex-shrink-0">

                        <div onKeyDown={snap} > {video && <MemVid video={video} vidref={vidplayer} /> } </div>

                        <div className="">
                            <canvas id="vid_capture" ref={canvasRef} className="w-[900px] ml-4"/>
                        </div>
                    </div>
                </div>

            </div>

            <AnalyzedFrames ctx={ctx} state={state} />
        </>
    )
}
