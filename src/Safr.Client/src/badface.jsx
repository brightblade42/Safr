import React from 'react';

export const BadFace = (props) => {
    return (
        <div
            className="bg-wgray-50 ml-4 mt-2 shadow-xl flex flex-col flex-shrink-0 w-96 h-auto border border-red-700 rounded-md">

            <div className="flex justify-between items-baseline py-2 px-1 ">

                <h1 className="ml-1 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-red-900 text-center">Rocco
                    Allega</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">
                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                     src="data:image/png;base64,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" />


                    <div className="col-start-2 row-start-1 ">
                        <div className="mt-8 text-2xl text-center font-extrabold text-red-800 tracking-wide">99.911%
                        </div>
                        <div className="uppercase text-center text-md font-semibold tracking-wide text-yellow-700">no
                            mask
                        </div>
                    </div>

                    <div className="mt-2 justify-self-center row-start-2 col-start-2 border-t-2 pt-6">
                        <div className="justify-self-center">
                            <div className="uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">12:00:35
                                PM
                            </div>
                        </div>
                    </div>
            </div>

            <div className="flex justify-between items-end  bg-bgray-100 h-12 rounded-b-md pb-2">
                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide ">Main Auxillary Entrance</div>
                <div
                    className="mr-2 border border-red-900 uppercase text-sm font-extrabold bg-red-100 text-red-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    <span>Watch!</span>
                </div>
            </div>
        </div>


)
}