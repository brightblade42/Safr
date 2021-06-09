import React from 'react';

export const AppBar = (props) => {

    function handle_nav(goto) {
        console.log("I have been called and I'm javascript now using props");
        console.log(props.model);
        props.onNav(goto);
    }

    return (
        <div className="flex  justify-between  bg-blue-800 text-blue-300 p-2">
            <div className="flex space-x-4">
                <button className="btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50 bg-indigo-600"
                        onClick={(e) => handle_nav("index")}>Home</button>
                <button
                    className="btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("about")}>History</button>
            </div>
            <div className="justify-items-end">
                <button

                    className="btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("settings")}>Settings</button>
                <button
                    className="btn-indigo ml-2 uppercase text-sm tracking-wide text-blue-50"
                        onClick={(e) => handle_nav("logout")}>Logout</button>

            </div>
        </div>
    )

}