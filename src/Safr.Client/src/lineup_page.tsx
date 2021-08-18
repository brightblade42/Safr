import React from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {AnalyzedFrame} from "./analysis_state";


export function Lineup (props) {

    let lineup = props.lineup


    function build_lineup() {
        if (lineup.length === 0) {
            return <div className="mt-24 transition md:text-4xl lg:text-7xl text-green-800 opacity-20 text-center  justify-center">Analysis</div>
        } else {
            return lineup.map(f => {

                return (
                       <div>
                        <div> {f.name}</div>
                        <img src={f.url} className="w-48" />
                    </div>)
            })
        }
    }

    return (
        <div className="col-span-2 bg-bgray-100">
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
    //TODO:  undupe. function from videoeditor
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

    const recognize = build_post("recognize-top5");

    async function top5(cv) {

        await cv.toBlob(async (b) => {

            let rec_json = await recognize(b); //this should be a top 5 server thing. need a conf adjustment...
            //extract data
            let r = rec_json.map(function (x) {
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

            set_lineup(r);

        }, "image/jpeg");
    }


    const onCrop = async () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const cv = cropper.getCroppedCanvas()
        try {
            await top5(cv);
        }
        catch(e) {
            console.log("God only knows...")
        }
    };

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

    <div className="grid  grid-rows-2 grid-cols-2 ">
        <div className="flex border min-h-[400px]">
            <div className="ml-4">
                <input type="file" accept="image/*"
                       onChange={(e) => create_image(e.target.files?.item(0))} />
                <div className="mt-4">
                    {img1_data &&
                    <div className="flex">
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
                <button className="btn-light-indigo" onClick={onCrop}>Analyze</button>
            </div>
        </div>
        <div className="border">
            <div className="text-center justify-center">
                <div className="img-preview"
                     style={{ width: "100%",  height: "400px" }} />
            </div>
        </div>
        <Lineup lineup={lineup} />
    </div>
    )
}

