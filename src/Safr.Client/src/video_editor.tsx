import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//case file prototype
interface State {

}

type Frame = {
    time: Date;
    frame: number | 0;
    faces_detected: {}; //the faces detected in a video frame
    faces_identified: {};
    src_image: string; //base64 or DataUrl

}

type Analysis = {
    frames: Frame [];

}

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


function IdentifiedFace (props) {
    let c_ref  = React.useRef();
    let data = props.data

    function draw_face() {
        let cv = c_ref.current;
        if (cv === undefined) { return; }
        if(cv === null) {return; }
        console.log("in ident draw_face");
        let ctx = cv.getContext('2d');

        ctx.clearRect(0,0, cv.width, cv.height);
        ctx.putImageData(data.img, 0,0,10,10, cv.width, cv.height) ;
        console.log(data.face)
    }

    React.useEffect(() => { draw_face() }, [data])

    return (
        <>
            {data ?
                <div className="border border-green-900 w-40 mr-4">
                    <canvas ref={c_ref}/>
                    <div className="ml-2">
                        <div className="text-green-700 uppercase font-semibold">{data.face.name}</div>
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
        if (faces === undefined) {
            return;
        }

        let dd = faces.map((face) => {
            const box  = face.bbox;
            console.log("---------- Ident BOX -----------");
            return {
                img: ctx.getImageData(box.x, box.y, 150, 150),
                face: face
            }

        });

        set_datas(dd); //the image data for each detected face.

    }

    useEffect(() => {
        build_faces()
    }, [faces])

    return (
        <div className="flex text-bgray-200 bg-bgray-100 ">
            {datas.map((d => {
                return <IdentifiedFace data={d}  />
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

      const opts= {
         controls: true,
         responsive: true,
          fit: true,
          sources: [{
             src: createObjectURL(props.video),
              type: 'video/mp4'
          }]

      }
      /*
      return <VideoJS options={opts} onPlay={play}
                      width={800}
                      height={500}
                      src={createObjectURL(props.video)}
                      />

       */

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
    const [img1_data, set_img1_data] = React.useState(undefined);
    const [img2_data, set_img2_data] = React.useState(undefined);
    //paths
    const [img1_file, set_img1_file] = React.useState(undefined);
    const [img2_file, set_img2_file] = React.useState(undefined);
    const canvasRef = React.useRef();
    const vidplayer = React.useRef();
    let [ctx, set_context] = React.useState(undefined); //hmmm
    let [detected_faces, set_detected_faces] = React.useState(undefined);
    let [identified_faces, set_identified_faces] = React.useState(undefined);
    let [image_comparison, set_image_comparison] = React.useState(undefined);

    function create_video(v) {
        console.log(v);
        set_video(v);
    }

    function create_image (im) {
        console.log("loading image");
        console.log(im);
        set_img1_file(im);
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            set_img1_data(reader.result);
        }, false);

        if (im) {
            reader.readAsDataURL(im);
        }
    }

    function create_image2 (im) {
        console.log("loading image2 ");
        console.log(im);
        set_img2_file(im);
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            set_img2_data(reader.result);
        }, false);

        if (im) {
            reader.readAsDataURL(im);
        }
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


    async function verify_faces(face1: Blob, face2: Blob) {

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
            console.log("verification...")
            console.log(image_comparison.image1_face);
            return json;
        } catch (e) {
            console.log(e);
        }
    }



    function build_faces() {
        console.log("Gonna compare the frame man");
        console.log(detected_faces);
        if (detected_faces === undefined) {
            return;
        }

        let reader1 = new FileReader();
        let ref_image;

        reader1.addEventListener("load", function () {
            let bin = reader1.result
            ref_image = new Blob([bin])
            //let blob2 = new Blob([bin])
        }, true);//removes itself?

        if (img1_file) {
            reader1.readAsArrayBuffer(img1_file);
        }


        let dd = detected_faces.faces.map((face) => {
            const box  = face.bounding_box;
            console.log("---------- BOX -----------");
            console.log(face);
            console.log("A face for the reference compare is ready");
            //return ctx.getImageData(box.x, box.y, box.width + 50, box.height + 50);
            let idata =  ctx.getImageData(box.x, box.y, 150, 150);

            //let res = verify_faces(ref_image, blob);
            //console.log(res);
            //console.log(blob);

        });

        //set_datas(dd); //the image data for each detected face.

    }


    useEffect(() => {
        console.log("faces changed");
        //build_faces()
    }, [detected_faces])


    function compare_images() {
        //how do i get the binary data?
        console.log(img1_file);

        const reader1 = new FileReader();
        const reader2 = new FileReader();
        let blob1;
        let blob2
        reader1.addEventListener("load", function () {
            let bin = reader1.result
            blob1 = new Blob([bin])
            //let blob2 = new Blob([bin])
        }, false);

        if (img1_file) {
            reader1.readAsArrayBuffer(img1_file);
        }
        reader2.addEventListener("load", function () {
            let bin = reader2.result
            blob2 = new Blob([bin])
            let res = verify_faces(blob1, blob2);
        }, false);

        if (img2_file) {
            reader2.readAsArrayBuffer(img2_file);
        }
        //load the binary data


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


    const detect    = build_post("detect-frame");
    const recognize = build_post("recognize-frame");

    function snap (e) {
        if(e.code !== "Enter" && e.code !== "KeyC") {
            return;
        }
        if (canvasRef.current !== undefined) {
            let cv = canvasRef.current ;

            cv.width = 2150 //video_width;
            cv.height = 900;
            let lctx = cv.getContext('2d');
            set_context(lctx);
            try {
                ctx.drawImage(vidplayer.current, 0,0);

                cv.toBlob(async (b) => {
                    let d_res = await detect(b);
                    set_detected_faces(d_res);
                    // @ts-ignore
                    draw_boundaries(ctx, d_res.faces);
                    let rec_json = await recognize(b);
                    //extract data

                    let r = rec_json.map(function (x) {
                        if (x.case === "Ok") {
                            console.log("We got one!");
                            return {
                                confidence: x.fields[0].confidence,
                                name: x.fields[0].tpass_client.fields[0].name,
                                status: x.fields[0].tpass_client.fields[0].status,
                                bbox: x.fields[0].bounding_box
                            }
                        }
                    });
                    console.log(r);
                    set_identified_faces(r);


                }, "image/jpeg");
            } catch (e) {
               console.log(`oops: ${e}`)
            }

        }
    }

// @ts-ignore
return (
        <>
            <div className="flex">
                <div className="flex flex-col">
                    <input type="file" accept="video/*"
                           onChange={(e) => create_video(e.target.files?.item(0))} />

                    <div onKeyDown={snap} >
                        {video &&

                        <MemVid
                            video={video}
                            vidref={vidplayer}  />

                        }
                    </div>
                </div>

                <div className="ml-8 border border-gray-300 ">
                    <input type="file" accept="image/*"
                           onChange={(e) => create_image(e.target.files?.item(0))} />

                    <div>
                        {img1_data &&
                            <img src={img1_data} />
                        }
                    </div>

                    <div>
                        <button className="mt-4 btn-light-indigo">Compare Video</button>
                    </div>
                </div>

                <div className="border border-gray-300 ">
                    <input type="file" accept="image/*"
                           onChange={(e) => create_image2(e.target.files?.item(0))} />

                    <div>
                        {img2_data &&
                        <img src={img2_data} />
                        }
                    </div>
                    <div>
                        <button
                            className="mt-4 btn-light-indigo"
                            onClick={(e) => compare_images()}
                        >Compare Images</button>
                    </div>
                    {image_comparison &&
                    <div className="mt-8">Likeness : {image_comparison}</div>
                    }
                </div>
            </div>

            <div className="flex mt-8 flex-shrink-0">
                <div className="border border-gray-400 bg-bgray-100">
                    <canvas id="vid_capture" ref={canvasRef} className="w-[900px]"/>
                </div>

                <div className="-ml-20">
                    <div >
                        <DetectedFaces ctx={ctx} faces={detected_faces} />
                    </div>
                    <div className="mt-4">
                        <IdentifiedFaces  ctx={ctx} faces={identified_faces} />
                    </div>
                </div>

            </div>
        </>
    )
}
