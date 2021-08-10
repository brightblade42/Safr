import React from 'react';

export const GoodFaces  = (props) => {

  let faces = props.face
  

  function build_faces (): any {
        if (faces.length === 0) {
            return <div className="transition md:text-4xl lg:text-7xl m-auto text-green-800 opacity-10 ">Matched Faces</div>
        } else {
            return faces.map (f => {
                return <GoodFace face={f} />
            })
        }
    }

    return (
        <div className="flex overflow-x-scroll text-bgray-200 bg-bgray-100 pt-2 pb-6 mt-0 px-4 space-x-4 min-h-[300px] ">
            {build_faces()}
        </div>

    )

}

export const BadFaces  = (props) => {

    let faces = props.faces;

    function build_faces() {
        if (faces.length === 0) {
            return <div className="transition md:text-4xl lg:text-7xl m-auto text-red-800 opacity-10 ">Watch List</div>
        } else {
            return faces.map (f => {
                return <BadFace face={f} />
            })
        }
    }

    return (
        <div className="flex overflow-x-scroll text-wgray-200 bg-wgray-100 pt-0 pb-6 -mt-1 space-x-4 min-h-[300px]">
            {build_faces()}
        </div>

    )

}

export const GoodFace = (props) => {

    let b64 = "data:image/png;base64," + props.face.frame
    let mask_res;
    let inout;

    function format_confidence (conf: number)  {
        let truncated = parseFloat(conf.toString().slice(0, (conf.toString().indexOf(".")) + 5)) * 100;
        return (conf >= 1) ? "100%" : `${truncated}%`;
    }

    let conf_str = format_confidence(props.face.confidence);

    if (props.face.status.includes("in")) {
        inout = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
    } else {

        inout =  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>

    }

    return (

        <div className="bg-gray-50 mt-4 shadow-xl flex flex-col flex-shrink-0 w-96 h-auto border border-green-700 rounded-md">

            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className="ml-1 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center">{props.face.name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                    src={b64}
                />

                <div className="col-start-2 row-start-1 ">
                    <div className="mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide">{conf_str}
                    </div>

                    <div className="justify-self-center pt-4 ">
                        <div className="uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">{props.face.timeStamp} </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md">
                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide ">{props.face.cam}</div>
                <div
                    className="flex space-x-1 mr-2 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    {inout}

                    <span>{props.face.status}</span>
                </div>

            </div>
        </div>

    );
}

export const BadFace = (props) => {

    let b64 = "data:image/png;base64," + props.face.frame
    let mask_res;


    function format_confidence (conf: number)  {
        let truncated = parseFloat(conf.toString().slice(0, (conf.toString().indexOf(".")) + 5)) * 100;
        return (conf >= 1) ? "100%" : `${truncated}%`;
    }

    /*
    if (props.face.mask.includes("%")) {
        mask_res = <div className="uppercase mt-1  text-center text-md font-semibold tracking-wide text-red-800">
            <span className="mr-2 opacity-90">mask</span>
            <span className="opacity-90 text-md">{props.face.mask}</span>
        </div>
    } else {
        mask_res = <div className="uppercase opacity-90 mt-1 text-center text-md font-semibold tracking-wide text-yellow-700">no mask</div>
    }

     */

    let name = props.face.name;
    let confidence = format_confidence(props.face.confidence);
    let timestamp = props.face.timeStamp
    let cam = props.face.cam;
    let status = props.face.status;

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

                    <div className="justify-self-center pt-4 ">
                        <div className=" uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">{timestamp} </div>
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
