
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
    analysis: Analysis
}

function assertUnreachable (x: never): never {
    throw new Error("UNREACHABLE MSG: Didn't expect to get here");
}

type AnalyzedFrameChanged = {
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

export type AnalysisMsg =
    | AnalyzedFrameChanged
    | DetectingFacesMsg
    | RecognizingFacesMsg
    | AnalyzingFrameMsg

function add_or_update_frame(state: AnalysisState, frame: AnalyzedFrame) {
    //TODO: finding the max frame_num might be better...
    if (frame.frame_num >= state.analysis.frames.length) {
        //add the new frame to the "back of the queue".
        return {...state, analysis: { ...state.analysis,  frames: [frame, ...state.analysis.frames]}}
    } else {
        console.log("We'd update an existing Analyzed frame that matched by frame_num or elapsed_time")
        //TODO: would we put the existing frame at the back of the queue to make it viewable in "filmstrip"?
        return state
    }

}
export function update(state: AnalysisState, msg: AnalysisMsg) {
    switch(msg.action) {
        case "AnalyzedFrameChanged": {
            return add_or_update_frame(state, msg.payload)
        }
    }
}


export function init_state () :AnalysisState {

    return {
        is_analyzing_frame: false,
        is_detecting_faces: false,
        is_recognizing_faces: false,
        name: "Analysis 1",
        snapshot_time: 2000, //milliseconds
        capture_mode: "auto",
        small_frame_step: { plus: 1, minus: 1},
        med_frame_step: { plus: 3, minus: 3},
        large_frame_step: { plus: 5, minus: 5},
        analysis: {file: "", reference_images : undefined, frames: []}
    }


}

