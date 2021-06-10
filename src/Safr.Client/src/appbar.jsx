import React from 'react';
import eye from './images/eye_logo.png';

export const AppBar = (props) => {

    function handle_nav(goto) {
        console.log("I have been called and I'm javascript now using props");
        console.log(props.model);
        props.onNav(goto);
    }

    /*

                <img src={eye}
                     className="w-[99px] h-[58px] opacity-90"
                     alt="eyemetric"/>

     */

    return (
        <div className="flex  justify-between  bg-blue-800 text-blue-300 p-1">
            <div className="flex space-x-4">

                <button className="mt-0  btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50 "
                        onClick={(e) => handle_nav("index")}>Home</button>
                <button
                    className="mt-0 btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("about")}>History</button>
            </div>

            <div className="justify-items-end">
                <button

                    className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("settings")}>Settings</button>
                <button
                    className="btn-indigo mt-0 ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("logout")}>Logout</button>

            </div>
        </div>
    )

}