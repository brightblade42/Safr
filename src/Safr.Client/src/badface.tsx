import React from 'react';
import {Divider} from "@material-ui/core";


export const BadFaces  = ({faces}) => {

    //let faces = props.faces;

    let bf = () => {
        if (faces.length === 0) {
            return <div className="transition md:text-4xl lg:text-7xl m-auto ">Watch List</div>
        } else {
            return faces.map (f => {
                return <BadFace face={f} />
            })
        }
    }

    return (
        <div className="flex overflow-x-scroll text-wgray-200 bg-wgray-100 pt-2 pb-6 mt-0 space-x-4 min-h-[365px]">
            {bf()}
        </div>

    )

}

export const BadFace = (props) => {

    let b64 = "data:image/png;base64," + props.face.Frame
    let mask_res;

    if (props.face.Mask.includes("%")) {
        mask_res = <div className="uppercase mt-1  text-center text-md font-semibold tracking-wide text-red-800">
            <span className="mr-2 opacity-90">mask</span>
            <span className="opacity-90 text-md">{props.face.Mask}</span>
        </div>
    } else {
        mask_res = <div className="uppercase opacity-90 mt-1 text-center text-md font-semibold tracking-wide text-yellow-700">no mask</div>
    }

    let name = props.face.Name;
    let confidence = props.face.Confidence;
    let timestamp = props.face.TimeStamp
    let cam = props.face.Cam;
    let status = props.face.Status;

    return (
        <div
            className="bg-wgray-50 ml-4 mt-2 shadow-xl flex flex-col flex-shrink-0 w-96 h-auto border-2 border-red-700 rounded-md">

            <div className="flex justify-between items-baseline py-2 px-1 ">

                <h1 className="ml-1 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center">{name}
                    </h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">
                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2" src={b64}/>


                    <div className="col-start-2 row-start-1 ">
                        <div className="mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide">{confidence}
                        </div>
                        <div className="uppercase text-center text-md font-semibold tracking-wide text-yellow-700">{mask_res} </div>
                    </div>

                    <div className="mt-2 justify-self-center row-start-2 col-start-2 border-t-2 pt-6">
                        <div className="justify-self-center">
                            <div className="uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">{timestamp} </div>
                        </div>
                    </div>
            </div>

            <div className="flex justify-between items-end  bg-bgray-100 h-12 rounded-b-md pb-2">
                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide ">{cam}</div>
                <div
                    className="mr-2 border border-red-900 uppercase text-sm font-extrabold bg-red-100 text-red-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    <span>{status}</span>
                </div>
            </div>
        </div>


)
}