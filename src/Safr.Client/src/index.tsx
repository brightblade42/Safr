import React,{ useReducer, useState}  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppState, LoginState, mockstate, init_state, CameraStream, FRLog } from './AppState';
import {VideoList} from "./axvideo";
//import { App } from './bin/App';
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import {LoginComponent} from "./login";
//import {AppState} from "./bin/AppState";
import eye from './images/eye_logo2.png';
import {AppBar} from "./appbar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {GoodFaces} from "./goodface";
import {BadFaces} from "./badface";
import {CameraSettings} from "./camerasettings";
import {FRHistoryGrid} from "./frhistorygrid";

//import AppContext from "./AppContext";
import {RemoteApiBuilder} from "./RemoteApi";
import * as signalR from '@microsoft/signalr';

library.add(fas, far, fad, fal)


const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const  Home  = ({state, dispatch}) => {

   const load_camera_info = async () => {

       let api = RemoteApiBuilder();
       let res = await api.validate_user("admin", "njbs1968");

       console.log(res);
       try {
           console.log("Loading remote camera data")
           //signalR call goes here.
           await timeout(2000);
           console.log("Loaded remote camera data successfully")
       } catch(err) {
           console.log(`Load Cameras failed :  ${err}`);
       }
   }

   //i thought, empty array meant...run only once.
   React.useEffect(() => { load_camera_info() }, []);

    return (
       <div  className="flex flex-col" >
           <VideoList state={state} dispatch={dispatch} />
           <GoodFaces faces={state.matched_faces} />
           <BadFaces faces={state.fr_watchlist}/>
       </div>
    )
}

export const  About  = (props) => {
    return (
        <div>This is about us! Cool</div>
    )
}
export const  Users  = (props) => {
    return (
        <div >READ You DANG History1</div>
    )
}

//The state

type LoginStateChangedMsg = {
    action: "LoginStateChanged";
    payload: LoginState;
}


type FRHistoryLoadingMsg = {
    action: "FRHistoryLoading";
    payload: boolean;
}

type FRLogStateChangedMsg = {
    action: "FRLogStateChanged";
    payload: FRLog[];
}

type Msg = LoginStateChangedMsg | FRHistoryLoadingMsg | FRLogStateChangedMsg;


const assertUnreachable = (x: never): never => {
    throw new Error("Didn't expect to get here");
}

const update  = (state: AppState, msg:Msg) => {

    switch(msg.action) {
        case "LoginStateChanged": {
            return { ...state, login_status: msg.payload}
        }
        case "FRHistoryLoading": {
            return { ...state, fr_history_loading: msg.payload}
        }
        case "FRLogStateChanged": {
            return {...state, fr_logs: msg.payload}
        }
    }
    return assertUnreachable(msg);
}

function App (props) {

    let logout = props.logout;
    const dispatch = props.dispatch;
    let [show_camsettings,set_show_camsettings] = React.useState(true);

    const api = RemoteApiBuilder();

    const hub = new signalR.HubConnectionBuilder()
        //.withUrl("http://localhost:8085/socket/fr")
        .withUrl("http://localhost:8085/myhub")
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    hub.start().then(a => {
        console.log(`hub connection started.. ${a}` );
        hub.send("SendMessageToAll", "Hi there").then(a => {
            console.log(`hub method invoked bro ${a}`);
        });
    })

    hub.on("ReceiveMessage", msg => {
        console.log(`got the server message: ${msg}`);
    } )
    let toggle_settings = () => {
        set_show_camsettings(!show_camsettings);
    }

    //pass down some funky funcs!
    let cam_funcs = {
        start_all_streams: () => { console.log("starting ALL the streams!!")},
        stop_all_streams: () => { console.log("Stopping ALL the streams!!")},
        start_camera: (c: CameraStream) => { console.log(`Starting : ${c.name}`)},
        stop_camera: (c: CameraStream) => { console.log(`Stopping : ${c.name}`)}
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
            return (conf >= 1) ? "100%" : `${truncated}%`;
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
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/frhistory">
                        <FRHistoryGrid state={props.state} funcs={fr_history_funcs} />
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

    const login = () => {
        dispatch({action: "LoginStateChanged", payload: {type: "LoggedIn"}})
    }

    const logout = () => {
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


