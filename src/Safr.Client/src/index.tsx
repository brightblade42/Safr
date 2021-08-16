import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppState, CameraStream, FRLog, IdentifiedFace, init_state,update, Msg, LoginState} from './appstate';
import {VideoList} from "./axvideo";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fal} from '@fortawesome/pro-light-svg-icons';
import {fas} from '@fortawesome/pro-solid-svg-icons';
import {far} from '@fortawesome/pro-regular-svg-icons';
import {fad} from '@fortawesome/pro-duotone-svg-icons';
import {LoginComponent} from "./login";
import {VideoEditor} from "./video_editor";
import {AppBar} from "./appbar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {GoodFaces, BadFaces} from "./facecards";
import {CameraSettings} from "./camerasettings";
import {FRHistoryGrid} from "./frhistorygrid";

import {RemoteApiBuilder} from "./remote_api";
import * as signalR from '@microsoft/signalr';
import {HubConnectionState} from '@microsoft/signalr';

library.add(fas, far, fad, fal)

function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Home({state, dispatch}) {

    return (
       <div  className="flex flex-col" >
           <VideoList  state={state} dispatch={dispatch} />
           <GoodFaces faces={state.matched_faces} />
           <BadFaces faces={state.fr_watchlist}/>
       </div>
    )
}


//TODO:add types
function update_available_cams  (cam_info, dispatch)  {

    let avail = cam_info.available_cams
    let s_res = cam_info.streams
    //NOTE: converted from F# ResultType. A bit nasty in javascript.
    //TODO: make this a function
    if (s_res.isOk) {
        let streams = s_res.resultValue.streams

        avail = avail.map(cam => {
            const is_running = streams.findIndex(s => cam.name === s.name)
            return (is_running > -1) ? {...cam, streaming: true} : {...cam, streaming: false}
        });
        //test auto start
       // if (streams.length < 1) { //no cameras are streaming at all.
       //    console.log("No cameras currently connected....")
       // }
    } else {
        console.log(s_res.errorValue);
    }

    let cam_state = { available_cameras: avail, streams_loading: false, starting_all_streams: false, stopping_all_streams:false }
    dispatch({action: "AvailableCamerasChanged", payload: cam_state });
    console.log(cam_info);
    //auto_start any available cams that are not streaming...
    //start_all or start_each avail in turn>
}


function update_face (face: IdentifiedFace, dispatch) {

    if (face.status.includes("FR")) {
        dispatch({action: "FRWatchlistChanged", payload: face})
    } else {
        dispatch({action: "MatchedFacesChanged", payload: face})
    }
}


function App (props) {

    let logout     = props.logout;
    const dispatch = props.dispatch;
    let [show_camsettings,set_show_camsettings] = React.useState(false);

    const api = RemoteApiBuilder();

    let endpoint = `${window.location.href}frhub`;
    endpoint = `http://localhost:8085/frhub`;

    function has_permission () {
        if (props.state.login_status.type === "LoggedIn") {
            return props.state.login_status.role === "Admin"
        } else {
            return false
        }
    }
    const hub = new signalR.HubConnectionBuilder()
        .withUrl(endpoint)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    //wrap a signalR hub call in a function that will check the connection state and reconnect if
    //we are in a disconnected state. It's currently unclear why we'd be in a disconnected state.
    function try_connect(fn) {
        return function () {
            if (hub.state === HubConnectionState.Disconnected) {

                console.log("Was NOT  connected...")
                hub.start().then(a => {
                    fn()
                })
            } else {
                console.log("Was connected...")
                fn()

            }
        }
    }


    function start_streams() {
        console.log("start streams of available cameras that are not already streaming.")

    }


    useEffect(() => {

        hub.on("ReceiveMessage", msg => {
            console.log(`got the server message: ${msg}`);
        } )
        hub.on("AvailableCameras", msg => {
            update_available_cams(msg, dispatch);
        } );

        hub.on("FaceIdentified", msg => {
            update_face(msg, dispatch)
        })

        hub.on("StreamsStarting", ()=> {
            console.log("Received Streams Starting Message");
        })
        hub.start().then(a => {
            hub.send("GetAvailableCameras").then(a => {
                console.log(`get cameras invoked ${a}`);
            }).catch(err => {
                console.log(`BOOM: ${err}`)
            });
        }).catch(err =>  {
            console.log("couldn't connect hub.")
            console.log(err)
        })
    }, []);

    let toggle_settings = () => {
        set_show_camsettings(!show_camsettings);
    }

    //pass down some funky funcs!
    let cam_funcs = {

        start_all_streams:() => {
            console.log(hub);
            try_connect( () => {
                hub.send("StartAllStreams").then(a => {
                    console.log("dispatching start all streams request");
                    dispatch({action: "StartingAllStreams", payload: true });

                }).catch((err)=> {
                    console.log("could not call StartAllStreams on hub");
                    console.log(err);
                });
            })()


        },

        stop_all_streams: () => {
            try_connect(() => {
                hub.send("StopAllStreams").then(a => {
                    console.log("dispatching StoppingAllStreams request");
                    dispatch({action: "StoppingAllStreams", payload: true });

                }).catch((err)=> {
                    console.log("could not call STOP AllStreams on hub");
                    console.log(err);
                });
            })()
        },

        start_camera: (cam: CameraStream) => {
            try_connect(() => {
                hub.send("StartStream", cam)
                    .then(a => console.log("Sent Start Stream request"))
                    .catch(err => console.log(`Error starting stream: ${err}`))

            })()
        },
        stop_camera: (cam: CameraStream) => {
            try_connect(() => {
                hub.send("StopStream", cam)
                    .then(a => console.log("Sent Stop Stream request"))
                    .catch(err => console.log(`Error stopping stream: ${err}`))

            })()

        },
        update_camera: (c: CameraStream) => {
            try_connect(() => {
                hub.send("UpdateCamera", c)
                    .then(a => console.log("sending update camera req"))
                    .catch(err => console.log(`Couldn't update camer: ${err}`))
            })()
        },
        add_camera: (c: CameraStream) => {
            try_connect(() => {
                hub.send("AddCamera", c)
                    .then(a => console.log("sending add camera req"))
                    .catch(err => console.log(`Couldn't add camera: ${err}`))
            })()
        },

        delete_camera: (id: number) => {
            try_connect(() => {
                hub.send("RemoveCamera", id)
                    .then(a => console.log("sending delete camera req"))
                    .catch(err => console.log(`Couldn't delete camera: ${err}`))
            })()
        },
        has_permission: has_permission

    }

    let fr_history_funcs = {
        on_load: async (start, end) => {
            try {

                dispatch({action: "FRHistoryLoading", payload: true});
                let res = await api.get_frlogs(start, end);
                let logs: FRLog[] = res.logs
                dispatch({action: "FRLogStateChanged", payload: logs})

            }
            catch (err ) {
               console.log("failed to load history logs..");
               console.log(err);
            } finally {
                dispatch({action: "FRHistoryLoading", payload: false});
            }
        },
        format_conf: (conf: number) => {
            let truncated = parseFloat(conf.toString().slice(0, (conf.toString().indexOf(".")) + 5)) * 100;
            return (conf >= 1) ? "100%" : `${truncated.toFixed(2)}%`;
        }

    }

    return (
        <Router>
            <AppBar logout={logout} toggle_settings={toggle_settings} />

            <div className="mt-20">
                <Switch>
                    <Route exact path="/">
                        <div>
                            { show_camsettings && <CameraSettings state={props.state} funcs={cam_funcs}/> }
                            <Home state={props.state} dispatch={props.dispatch} />
                        </div>
                    </Route>
                    <Route path="/frhistory">
                        <FRHistoryGrid state={props.state} funcs={fr_history_funcs} />
                    </Route>
                    <Route path="/videoedit">
                       <VideoEditor />
                    </Route>
                </Switch>
            </div>
        </Router>)
}

interface AppProps {
    state: AppState;
    dispatch: React.Dispatch<Msg>;
}

function Root () {

    let [state, dispatch] = React.useReducer(update, init_state());
    console.log(state);
    let api = RemoteApiBuilder();

    function login (user, pwd) {
        dispatch({action: "LoginStateChanged", payload: {type: "InFlight"}});

        api.validate_user(user, pwd)
            .then(a => {
                    console.log("Login result");
                    console.log(a);
                    let login_state: LoginState = a.valid ? {type: "LoggedIn", role: a.role} : {type: "Failed", msg: "Incorrect user name or password"};
                    console.log(login_state)
                    dispatch({action: "LoginStateChanged", payload: login_state});

            })
            .catch(err =>  {
                console.log(`Error logging in: ${err}`);
                dispatch({action: "LoginStateChanged", payload: {type: "Failed", msg: err}});
            })

    }

    function logout () {
        dispatch({action: "LoginStateChanged", payload: {type: "NotLoggedIn"}})
    }

    return (
            <div> {
               state.login_status.type !== "LoggedIn"
                    ? <LoginComponent model={state} onLogin={login}/>
                    : <App  state={state} dispatch={dispatch} logout={logout}/>
            }
            </div>

    )
}

ReactDOM.render( <Root />, document.getElementById('safer-app'));


