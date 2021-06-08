import React from 'react';

export const AppBar = (props) => {

    function handle_nav(goto) {
        console.log("I have been called and I'm javascript now using props");
        console.log(props.model);
        props.onNav(goto);
    }

    return (

        <div className="flex  justify-between  bg-bgray-700 text-blue-100 p-2">
            <div className="flex space-x-4">
                <button className="btn-indigo ml-2"
                        onClick={(e) => handle_nav("index")}>Home</button>
                <button className="btn-indigo ml-2"
                        onClick={(e) => handle_nav("about")}>FR Log</button>
            </div>
            <div className="justify-items-end">
                <button className="btn-indigo ml-2"
                        onClick={(e) => handle_nav("settings")}>Settings</button>
                <button className="btn-indigo ml-2"
                        onClick={(e) => handle_nav("logout")}>Logout</button>

            </div>
        </div>
    )

}