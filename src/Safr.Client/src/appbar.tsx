import React from 'react';
import eye from './images/eye_logo2.png';

export const AppBar = (props) => {


    function go_home () {
        props.onNav("index");
    }
    function go_history () {
        props.onNav("frhistory");
    }
    function go_settings () {
        props.onNav("settings");
    }
    function go_scratch () {
        console.log("hello there")
        props.onNav("scratch");
    }

    function go_logout () {
        props.onNav("logout");
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10  flex justify-between items-end  bg-blue-800 text-blue-300 p-1">
            <div className="flex space-x-4 items-end">
                <img src={eye}
                     className="inline-block w-[99px] h-[58px] opacity-100 "
                     alt="eyemetric"/>

                <button className="mt-0  btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50 "
                        onClick={go_home}>
                   <div className="flex space-x-2 items-end">
                       <svg xmlns="http://www.w3.org/2000/svg" className="inline-block  h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                       </svg>
                       <span className="inline-block ml-4">Home</span>

                   </div>
                </button>


                <button
                    className="mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={go_history}>History</button>

                {/*
                <button
                    className="mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                    onClick={go_scratch}>Scratch</button>
                    */}
            </div>

            <div className="flex">
                <button

                    className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={go_settings}>

                    <div className="flex space-x-2 items-end">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="inline-block ml-4">Settings</span>

                    </div>

                    </button>
                <button
                    className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={go_logout}>Logout</button>

            </div>
        </div>
    )

}