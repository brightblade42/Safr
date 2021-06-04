import React from 'react';

export const GoodFace = (props) => {

    return (

        <div className="bg-gray-50 mt-4 shadow-xl flex flex-col flex-shrink-0 w-96 h-auto border border-green-700 rounded-md">

            <div className="flex justify-between items-baseline py-2 px-1 ">
                <h1 className="ml-1 uppercase font-semibold text-lg flex-shrink-0 tracking-wider text-green-900 text-center">Brianne
                    Montgomery Habeeb</h1>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 bg-white">

                <img className="mt-0 w-44 h-52 object-cover object-center col-start-1 row-start-1 row-span-2"
                     src="data:image/png;base64,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" />

                    <div className="col-start-2 row-start-1 ">
                        <div className="mt-8 text-2xl text-center font-extrabold text-green-800 tracking-wide">98.998%</div>
                        <div className="uppercase text-center text-md font-semibold tracking-wide text-green-800">mask</div>
                    </div>

                    <div className="mt-2 justify-self-center row-start-2 col-start-2 border-t-2 pt-6">
                        <div className="justify-self-center">
                            <div className="uppercase font-semibold mr-1.5 text-bgray-600 text-lg text-center ">01:15:00 PM
                            </div>
                        </div>
                    </div>
            </div>

            <div className="flex justify-between items-end items-center bg-bgray-100 h-12 rounded-b-md">
                <div className="text-lg ml-2  font-semibold text-bgray-600 tracking-wide ">Main Auxillary Exit</div>
                <div
                    className="mr-2 border border-green-900 uppercase text-sm font-extrabold bg-green-100 text-green-900 py-1 px-2 rounded-md flex-shrink-0 ">
                    <span>Out</span>
                </div>

            </div>
        </div>

    );
}

