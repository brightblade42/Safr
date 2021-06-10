import React from 'react';

export const GoodFace = (props) => {

    let b64 = "data:image/png;base64," + props.face.Frame
    let mask_res;

    if (props.face.Mask.includes("%")) {
        mask_res = <div className="uppercase mt-1  text-center text-md font-semibold tracking-wide text-green-800">
                    <span className="opacity-90 mr-2">mask</span>
                    <span className="opacity-90 text-md">{props.face.Mask}</span>
                </div>
    } else {
        mask_res = <div className="opacity-90 uppercase mt-1 text-center text-md font-semibold tracking-wide text-yellow-700">no mask</div>
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
                    className="mr-2 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    <span>{props.face.Status}</span>
                </div>

            </div>
        </div>

    );
}

