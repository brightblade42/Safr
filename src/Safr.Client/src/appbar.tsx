import React from 'react';
import eye from './images/eye_logo2.png';
import {HomeIcon, SettingsIcon} from "./heroicons";
import { Link } from 'react-router-dom'
export const AppBar = (props) => {

    function logout() {
        props.logout();
    }
    function toggle_settings() {
        props.toggle_settings();
    }
    return (

        <div className="fixed inset-x-0 top-0 z-10  flex justify-between items-end  bg-blue-800 text-blue-300 p-1">
            <div className="flex space-x-4 items-end">
                <img src={eye}
                     className="inline-block w-[99px] h-[58px] opacity-100 "
                     alt="eyemetric"/>

                <Link to="/"
                      className="mt-0  btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50 "
                >
                    <div className="flex space-x-2 items-end">
                        <HomeIcon />
                        <span className="inline-block ml-4">Home</span>

                    </div>
                </Link>

                <Link to="/frhistory"
                      className="mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                >History</Link>

                {/*
                <Link to="/videoedit" className="mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                >Analyze Video</Link>
                */}
            </div>

            <div className="flex">
                <button
                    onClick={toggle_settings}
                    className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                >

                    <div className="flex space-x-2 items-end">
                        <SettingsIcon/>
                        <span className="inline-block ml-4">Settings</span>
                    </div>

                </button>
                <button className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={logout}
                >Logout</button>

            </div>
        </div>
    )

}

