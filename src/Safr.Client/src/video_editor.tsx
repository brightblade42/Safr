import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Player} from 'video-react';
//import "../../../node_modules/video-react/dist/video-react.css"
import './index.css';

export function VideoEditor(props) {

    const [video, set_video] = React.useState();

    const [video_width, set_video_width] = React.useState(800);
    const [video_height, set_video_height] = React.useState(500);
    const [img_src, set_img_src] = React.useState("");
    const canvasRef = React.useRef();
    const vidplayer = React.useRef();
    const imageRef  = React.useRef();
    const img_src_ref = React.useRef("");



    function createObjectURL ( file ) {
        if ( window.webkitURL ) {
            return window.webkitURL.createObjectURL( file );
        } else if ( window.URL && window.URL.createObjectURL ) {
            return window.URL.createObjectURL( file );
        } else {
            return null;
        }
    }

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
        vidplayer.current.play();
    }
    function snap (e) {
        console.log(e.code);
        if(e.code !== "Enter") {
            return;
        }
        if (canvasRef.current !== undefined) {
            // @ts-ignore
            let cv = canvasRef.current;
            cv.width = 1400; //video_width;
            cv.height = 600;
            cv.getContext("2d").drawImage(vidplayer.current, 0, 0);
            //img_src_ref.current = cv.toDataURL("image/webp");
            let data = cv.toDataURL("image/jpeg");
            cv.toBlob((b)=> {
                 console.log(b);
                let api_url = `http://localhost:8085/fr/`;
                let form_data = new FormData();
                form_data.append("image", b, "file.jpg");

                fetch(`${api_url}recognize`,
                    {
                        method: 'POST',
                        headers: {
                            //'Accept': 'application/json',
                           // 'Content-Type': 'multipart/form-data',

                        },
                        body: form_data
                    }).then(response => response.json())
                    .then(j => console.log(JSON.stringify(j)))

                    .catch(error => console.log("Bam a lam! Fart boom crash"))


            }, "image/jpeg");
            //console.log(data);
            set_img_src(data);
        }

    }
    // @ts-ignore
    return (
        <>
        <div>Let's edit some Video!</div>

            <input type="file" accept="video/*"
                   onChange={(e) => create_video(e.target.files?.item(0))} />

        <div onKeyDown={snap}>
            {video &&
                 <video controls
                        id="vid_player"
                        ref={vidplayer}
                        width={video_width}
                        height={video_height}
                        src={createObjectURL(video)}
                        onPlay={play}
                        onPause={pause}
                        onTimeUpdate={ntime}

                 /> }

            <div className="flex mt-2">
                <button className="btn-indigo" onClick={snap}>Snap</button>
                <button className="btn-indigo" onClick={start}>Start</button>
            </div>

            <div className="mt-8">
                <canvas id="vid_capture" ref={canvasRef} className="hidden"/>
                <img className="w-[800px] h-[450px]" src={img_src}
                />
            </div>
        </div>
        </>
    )
}

