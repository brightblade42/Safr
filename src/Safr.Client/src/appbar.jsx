import React from 'react';

export const AppBar = (props) => {

    function handle_nav(goto) {
        console.log("I have been called and I'm javascript now using props");
        console.log(props.model);
        props.onNav(goto);
    }

    return (

        <div className="bg-bgray-700 text-blue-100 p-2">
            <button className="btn-indigo ml-2"
                    onClick={(e) => handle_nav("index")}>Home</button>
            <button className="btn-indigo ml-2"
                    onClick={(e) => handle_nav("about")}>FR Log</button>
            <button className="btn-indigo ml-2"
                    onClick={(e) => handle_nav("settings")}>Settings</button>
            <button className="btn-indigo ml-2"
                    onClick={(e) => handle_nav("logout")}>Logout</button>
        </div>
    )

}