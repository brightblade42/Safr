
export type LoginState =
    | { type: "NotLoggedIn"  | "InFlight" | "LoggedIn" }
    | { type: "Failed"; msg: string }



export type CameraStream = {
        id: number
        ipaddress: string
        connection: string
        name: string
        enabled: boolean
        user: string
        password: string
        direction: number
        streaming: boolean
        detect_frame_rate: number
        secure: boolean
        updating: boolean
    }


export type IdentifiedFace = {

    id: string;
    name: string;
    cam: string;
    confidence: number;
    timeStamp: string;
    image: Uint8Array; //this is gonna get weird, I know it. Convert to B64 as well.
    frame: Uint8Array;
    status: string;
    mask: number;
}

export type FRLog = {

        identity: string;
        detected_img: string; //option //image from a camera
        matched_face: string;//option  //image used as an enrollment.
        name: string;
        confidence: number;
        matched_on: string;
        status: string;
        location: string;
}

export interface AppState {
    login_status: LoginState;
    available_cameras: CameraStream[] ;
    matched_faces: IdentifiedFace[];
    fr_watchlist: IdentifiedFace[];
    fr_logs: FRLog[];
    fr_history_loading: boolean;
    streams_loading: boolean;
    starting_all_streams: boolean;
    stopping_all_streams: boolean;


}

//TODO: Maybe reimplement these state vars
/*
    MaxFaceList = 20
    MaxFRList = 20
 */

export const mockstate = {

 available_cameras: [
    {
        id: 1,
        ipaddress: "192.168.0.104",
        connection: "rtsp://root:3y3Metr1c@192.168.0.104/axis-media/media.amp",
        name: "Cam 1",
        enabled: true,
        user: "",
        password: "",
        direction: 1,
        streaming: false,
        detect_frame_rate: 1,
        secure: false,
        updating: false
    },


    {
        id: 2,
        ipaddress: "192.168.0.104",
        connection: "rtsp://root:3y3Metr1c@192.168.0.104/axis-media/media.amp",
        name: "Cam 2",
        enabled: true,
        user: "",
        password: "",
        direction: 1,
        streaming: false,
        detect_frame_rate: 1,
        secure: false,
        updating: false
    },


    {
        id: 3,
        ipaddress: "192.168.0.104",
        connection: "rtsp://root:3y3Metr1c@192.168.0.104/axis-media/media.amp",
        name: "Cam 3",
        enabled: true,
        user: "",
        password: "",
        direction: 1,
        streaming: false,
        detect_frame_rate: 1,
        secure: false,
        updating: false
    }

]};

export const init_state  = () :AppState => {
    return {
        login_status: { type: "LoggedIn"},
        available_cameras: mockstate.available_cameras,
        matched_faces: [],
        fr_watchlist: [],
        fr_logs: [],
        fr_history_loading: false,
        streams_loading: false,
        starting_all_streams: false,
        stopping_all_streams: false,

    };
}