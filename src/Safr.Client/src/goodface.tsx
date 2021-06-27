import React from 'react';

export const GoodFaces  = ({faces}) => {

    //let faces = props.faces;

    let bf = () => {
        if (faces.length === 0) {
            return <div className="transition md:text-4xl lg:text-7xl m-auto ">Matched Faces</div>
        } else {
            return faces.map (f => {
                return <GoodFace face={f} />
            })
        }
    }

    return (
        <div className="flex overflow-x-scroll text-bgray-200 bg-bgray-100 pt-2 pb-6 mt-0 px-4 space-x-4 min-h-[365px]">
            {bf()}
        </div>

    )

}
export const GoodFace = (props) => {

    let b64 = "data:image/png;base64," + props.face.Frame
    let mask_res;
    let inout;
    if (props.face.Mask.includes("%")) {
        mask_res = <div className="uppercase mt-1  text-center text-md font-semibold tracking-wide text-green-800">
                    <span className="opacity-90 mr-2">mask</span>
                    <span className="opacity-90 text-md">{props.face.Mask}</span>
                </div>
    } else {
        mask_res = <div className="opacity-90 uppercase mt-1 text-center text-md font-semibold tracking-wide text-yellow-700">no mask</div>
    }

    if (props.face.Status.includes("in")) {
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
                <h1 className="ml-1 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center">{props.face.Name}</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                    src={b64}
                />

                    <div className="col-start-2 row-start-1 ">
                        <div className="mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide">{props.face.Confidence}</div>
                        {mask_res}

                    </div>

                    <div className="mt-2 justify-self-center row-start-2 col-start-2 border-t-2 pt-6">
                        <div className="justify-self-center">
                            <div className="uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">
                                {props.face.TimeStamp}
                            </div>
                        </div>
                    </div>
            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md">
                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide ">{props.face.Cam}</div>
                <div
                    className="flex space-x-1 mr-2 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    {inout}

                    <span>{props.face.Status}</span>
                </div>

            </div>
        </div>

    );
}

