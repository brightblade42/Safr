
export type AnalyzedFrame = {
    id: number                 //what are we.
    elapsed_time: number | 0;  //when were we
    frame_num: number | 0;     //which frame is we am be?
    faces_detected: {};        //the faces detected in a video frame
    faces_identified: {};      //TODO: relate detected face with identified face?
    src_frame: string [] | Uint8Array [] | Uint8ClampedArray [] | undefined //the image copied from a video frome
}


export type Analysis = {
    file: string; //the video file being analyzed.
    //length: number; //the length of video
    reference_images: string [] | Uint8Array [] | Uint8ClampedArray [] | undefined   //the custom loaded faces to find in video
    frames: AnalyzedFrame [];

}

//number of frames to scrub forward or backward.
export type FrameStep =  { plus: number; minus: number }

export type ProfileActionState =
    | { type: "None"  | "Editing" |  "Completed" }
    | { type: "Saving"; msg: Profile} //the actual profie we'll be changing
    | { type: "Failed"; msg: string }

export type Profile = {
    ccode: number;
    first: string;
    middle: string;
    last: string;
    status: string;  //a list of options from TPass.
    image: string;   //base64 or what else?
}

function init_profile() {
    return {
        ccode: -1,
        first: "",
        middle: "",
        last: "",
        status: "",  //a list of options from TPass.
        image: ""  //base64 or what else?
    }
}

export interface AnalysisState {
    name: string,
    snapshot_time: number, //when to copy a frame for analysis in milliseconds
    capture_mode: "auto" | "scrub";
    small_frame_step: FrameStep;  //Mistuh Hotsteppah.
    med_frame_step: FrameStep;
    large_frame_step: FrameStep;
    //TODO: is_analyzing represents bot detection and recognition.. not sure if we want more fine grained with distinct phases
    is_detecting_faces: boolean;
    is_recognizing_faces: boolean;
    is_analyzing_frame: boolean;
    profile_action_state: ProfileActionState;
    current_profile: Profile;
    video_play_state: VideoPlayState;
    analysis: Analysis
}

function assertUnreachable (x: never): never {
    throw new Error("UNREACHABLE MSG: Didn't expect to get here");
}
type ProfileActionChangedMsg = {
    action: "ProfileActionChanged",
    payload: ProfileActionState
}
type AnalyzedFrameChangedMsg = {
    action: "AnalyzedFrameChanged",
    payload: AnalyzedFrame
}

type DetectingFacesMsg = {
    action: "DetectingFaces",
    payload: boolean
}
type RecognizingFacesMsg = {
    action: "RecognizingFaces",
    payload: boolean
}

type AnalyzingFrameMsg = {
    action: "AnalyzingFrame",
    payload: boolean
}

export type VideoPlayState = | { type: "Playing" | "Stopped" | "Paused" }

type VideoPlayStateChangedMsg = {
    action: "VideoPlayStateChanged";
    payload: VideoPlayState
}

export type AnalysisMsg =
    | AnalyzedFrameChangedMsg
    | DetectingFacesMsg
    | RecognizingFacesMsg
    | AnalyzingFrameMsg
    | VideoPlayStateChangedMsg
    | ProfileActionChangedMsg

function add_or_update_frame(state: AnalysisState, frame: AnalyzedFrame) {
    //TODO: finding the max frame_num might be better...
    //TODO: currently only holding the last frame... for demo constraints
    if (frame.frame_num >= state.analysis.frames.length) {
        //add the new frame to the "back of the queue".
        return {...state, analysis: { ...state.analysis,  frames: [frame]}} //, ...state.analysis.frames]}}
    } else {
        console.log("We'd update an existing Analyzed frame that matched by frame_num or elapsed_time")
        //TODO: would we put the existing frame at the back of the queue to make it viewable in "filmstrip"?
        return state
    }

}


//currently we are updating the current_profile when the profile action advances
//to None or Saving.
//Not sure if this should be it's own dispatched state change
function update_profile_action(state: AnalysisState, action: ProfileActionState) {
    switch(action.type) {
        case "None" : {
            return {...state, profile_action_state: action, current_profile: init_profile()}
        }
        case "Editing": {
            return {...state, profile_action_state: action}
        }
        case "Saving": {
            return {...state, profile_action_state: action, current_profile: action.msg }
        }
        case "Completed" : {
            return {...state, profile_action_state: action  }
        }
        case "Failed": {
            return {...state, profile_action_state: action  }
        }
    }

}

export function update(state: AnalysisState, msg: AnalysisMsg) {
    switch(msg.action) {
        case "AnalyzedFrameChanged": {
            return add_or_update_frame(state, msg.payload)
        }
        case "VideoPlayStateChanged": {
            console.log("VideoPlayStateChanged Msg");
            //return state
            return {...state, video_play_state: msg.payload }
        }
        case "ProfileActionChanged": {
            console.log("ProfileActionChanged Msg");
            return update_profile_action(state, msg.payload)  //also updates the current_profile
        }
    }
}


export function init_state () :AnalysisState {

    return {
        is_analyzing_frame: false,
        is_detecting_faces: false,
        is_recognizing_faces: false,
        profile_action_state: {type: "None"},
        current_profile: init_profile(), //no undefined or nulls please.
        video_play_state: {type: "Stopped"},
        name: "Analysis 1",
        snapshot_time: 2000, //milliseconds
        capture_mode: "auto",
        small_frame_step: { plus: 1, minus: 1},
        med_frame_step: { plus: 3, minus: 3},
        large_frame_step: { plus: 5, minus: 5},
        analysis: {file: "", reference_images : undefined, frames: []}
    }


}

