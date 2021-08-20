import React from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Format} from "media-stream-player";

function format_conf (conf: number) {
    let truncated = parseFloat(conf.toString().slice(0, (conf.toString().indexOf(".")) + 5)) * 100;
    return (conf >= 1) ? "100%" : `${truncated.toFixed(2)}%`;
}
//TODO: DUPES form VideoEditor...
function FRWatchFace (props) {
    let face = props.face;

    return (

        <div className={`ml-4 mt-4 bg-gray-50 mr-2 shadow-xl flex flex-col flex-shrink-0 border border-red-700 rounded-md w-72`}>
            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className={`ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center`}>{face.name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                     src={face.url}
                />

                <div className="col-start-2 row-start-1 -ml-2 ">
                    <div className={`mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide`}>{format_conf(face.confidence)} </div>
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

    return (

        <div className={`mt-4 ml-4 bg-gray-50  shadow-xl flex flex-col flex-shrink-0 border border-green-700 rounded-md w-72`}>
            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className={`ml-2 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center`}>{face.name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                     src={face.url}
                />

                <div className="col-start-2 row-start-1 -ml-2 ">
                    <div className={`mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide`}>{format_conf(face.confidence)} </div>
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

export function Lineup (props) {

    const lineup = props.lineup


    function choose_face(f) {
        console.log(f);
        if (f.status === "FR Watch") {
            return <FRWatchFace face={f} />
        } else {
            return <KnownFace face={f}/>
        }
    }
    function build_lineup() {
        if (lineup.length === 0) {
            return <div className="mt-24 transition md:text-4xl lg:text-7xl text-green-800 opacity-20 text-center  justify-center">Analysis</div>
        } else {
            return lineup.map(f => {
                return choose_face(f)
            })
        }
    }

    return (
        <div className="mt-4 mb-32 flex overflow-x-scroll text-bgray-800 bg-bgray-100 pt-0 pb-6 space-x-4 min-h-[300px] ">
            {build_lineup()}
        </div>

    )
}


export function LineupPage (props) {

    const [img1_data, set_img1_data] = React.useState(undefined);
    const [img1_file, set_img1_file] = React.useState(undefined); //this may go away.
    const [crop_date, set_crop_data] = React.useState("#");

    const cropperRef = React.useRef<HTMLImageElement>(null);
    const [lineup, set_lineup] = React.useState([]);

    let api = props.api;//default_settings(false);

    //TODO:  undupe. function from videoeditor
    function build_post (endpoint) {

        return async function (b: Blob) {
            const api_url = api.root //`http://localhost:8085/fr/`;
            const form_data = new FormData();
            form_data.append("image", b, "file.jpg");
            try {
                const res = await fetch(`${api_url}${endpoint}`,
                    {
                        method: 'POST',
                        body: form_data
                    });

                const json = await res.json()
                return json
            } catch (e) {
                console.log(e)
            }
        }

    }

    const recognize = build_post("recognize-top5");

    async function top5(cv) {

        await cv.toBlob(async (b) => {

            try {
                const rec_json = await recognize(b); //this should be a top 5 server thing. need a conf adjustment...

                let info = rec_json.map(function (x) {
                    if (x.case === "Ok") {
                        return {
                            confidence: x.fields[0].confidence,
                            name: x.fields[0].tpass_client.fields[0].name,
                            url: x.fields[0].tpass_client.fields[0].imgUrl,
                            status: x.fields[0].tpass_client.fields[0].status,
                            bbox: x.fields[0].bounding_box
                        }
                    }
                });

                set_lineup([...info, ...lineup]);

            } catch(e) {
                console.log("could not build recognition results..");
                console.log(e);
            }
        }, "image/jpeg");
    }


    async function on_crop () {

        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const cv = cropper.getCroppedCanvas()
        try {
            await top5(cv);
        }
        catch(e) {
            console.log("God only knows...")
        }
    }

    function clear_list () {
        set_lineup([])
    }

    function create_image (im) {

        set_img1_file(im);
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            set_img1_data(reader.result);
        }, false);

        if (im) {
            reader.readAsDataURL(im);
        }
    }


    return (

    <div className="grid grid-rows-2 grid-cols-1 ">

        <div className="flex">

            <div className="min-h-[400px] ">

                <div className="ml-4 flex flex-col flex-shrink-0">
                    <input type="file" accept="image/*"
                           onChange={(e) => create_image(e.target.files?.item(0))} />

                    <div className="mt-4 ">
                        {img1_data &&
                        <div>
                            <Cropper
                                src={img1_data}
                                style={{ height: 400, width: "100%" }}
                                // Cropper.js options
                                preview=".img-preview"
                                initialAspectRatio={16 / 9}
                                guides={true}
                                ref={cropperRef}
                            />

                        </div>
                        }
                    </div>

                    {img1_data &&
                        <div className="flex justify-end ">
                            <button className=" btn-light-indigo mt-4 text-xl" onClick={on_crop}>Analyze</button>
                            <button className=" btn-light-indigo mt-4 ml-4 text-lg" onClick={clear_list}>Clear</button>
                        </div>
                    }
                </div>

            </div>

        </div>
        <Lineup lineup={lineup} />
    </div>
    )
}


