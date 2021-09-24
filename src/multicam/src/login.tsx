import React, {useState} from 'react';
import eye from "./images/eye_logo.png";
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import {AppState, LoginState} from './AppState';

export const LoginComponent = (props) => {

    let model: AppState = props.model;

    let [user,setUser] = React.useState("")
    let [pwd,setPwd] = React.useState("")

    function handle_login() {
        console.log ("-- login parent hand off --");
        let cUser = user
        let cPwd = pwd
        setUser("")
        setPwd("")

        props.onLogin(cUser, cPwd);

    }

    function handleUserChange (e) {
        setUser(e.target.value)
    }
    function handlePwdChange (e) {
        setPwd(e.target.value)
    }

    //maybe better as an F# callback. using the tag is a but of a hack.
    function toggle_msg () {
        return (model.login_status.type === "Failed") ? "opacity-100" : "opacity-0"
    }

    //this isn't quite right.
    function is_login_disabled (): boolean {
        return (model.login_status.type === "NotLoggedIn" && user.length < 1)
    }

    function is_in_flight () {
        return (model.login_status.type === "InFlight") ? "opacity-100" : "opacity-0"
    }

    const showpwd = "password"

    return (

        <div className="bg-bgray-50 min-h-screen bg-white flex flex-col justify-center sm:py-12">
            <div className="-mt-48 p-10 xs:p-0 mx-auto md:w-full md:max-w-md">

                <div
                    className={`${toggle_msg()} text-lg font-semibold text-red-700 mb-2 bg-red-100 p-2 rounded-lg text-center`}

                   >Incorrect user name or password.</div>
                <div className="shadow-2xl w-full rounded-lg divide-y divide-gray-200">
                    <div className="bg-white py-6 mb-2 " >
                        <img src={eye}
                             className="mx-auto"
                             alt="eyemetric"/>

                    </div>


                    <div className="bg-gray-100 px-5 py-7">

                        <label className="font-semibold text-sm text-gray-700 pb-1 block">User name</label>
                        <input type="text"
                               value={user}
                               onChange={(e)=> handleUserChange(e)}
                               className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>
                        <label className="font-semibold text-sm text-gray-700 pb-1 block">Password</label>
                        <input type={showpwd}
                               value={pwd}
                               onChange={(e)=> handlePwdChange(e)}
                               className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>
                        <button type="button"
                                disabled={is_login_disabled()}
                                onClick={() => handle_login()}
                                className="relative flex justify-center
                                items-center transition duration-200
                                bg-blue-500 hover:bg-blue-600 focus:bg-blue-700
                                disabled:font-bold disabled:bg-gray-400
                                disabled:cursor-not-allowed
                                focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                                text-white w-full py-2
                                rounded-lg text-sm
                                shadow-sm hover:shadow-md font-semibold text-center  inline-block">
                            <span className="inline-block mr-2 text-lg">Login</span>
                            <span className={` ${is_in_flight()} animate-spin  inline-block ml-1 text-2xl`}>
                                <FAIcon className="text-bgray-100" icon={['fad','spinner-third']}  />
                            </span>
                        </button>
                    </div>

                    <div className="bg-bgray-100 py-5">
                        <div className="grid grid-cols-2 gap-1">

                            <div className="text-center sm:text-left whitespace-nowrap">
                                <button
                                    className="transition duration-200 mx-4 px-4 py-4  cursor-pointer
                                    font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none
                                    focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <FAIcon icon={["far","lock-open-alt"]} className="mr-2"/>
                                    <span className="inline-block" >Reset Password</span>
                                </button>
                            </div>


                            <div className="hidden opacity-0 text-center sm:text-right  whitespace-nowrap">

                                <button
                                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" className="w-4 h-4 inline-block align-text-bottom	">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                    <span className="inline-block ml-1 ">Help</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}






