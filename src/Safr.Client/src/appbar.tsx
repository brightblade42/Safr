import React from 'react';
import eye from './images/eye_logo2.png';
import {HomeIcon, SettingsIcon} from "./heroicons";

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
                       <HomeIcon />
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
                        <SettingsIcon/>
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