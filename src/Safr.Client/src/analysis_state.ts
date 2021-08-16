
type AnalyzedFrame = {
    id: number
    elapsed_time: number | 0;
    frame_num: number | 0;
    faces_detected: {}; //the faces detected in a video frame
    faces_identified: {};
    src_image: string [] | Uint8Array [] | Uint8ClampedArray [] | undefined //the image copied from a video frome

}


type Analysis = {
    file: string; //the video file being analyzed.
    //length: number;
    reference_images: string [] | Uint8Array [] | Uint8ClampedArray [] | undefined
    frames: AnalyzedFrame [];

}



interface AnalysisState {
    name: string,
    snapshot_time: number, //when to copy a frame for analysis in milliseconds
    capture_mode: "auto" | "scrub";
    analysis: Analysis []
}
