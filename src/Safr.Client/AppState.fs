module Safr.Client.AppState
open Safr.Client //.RemoteApi
open Safr.Types.Paravision.Streaming
open Safr.Types.Eyemetric
open EyemetricFR.Shared
//open Safr.Client.Router
open Elmish
//open Feliz.Router

type LocalCamera = {
    ID: int
    Name: string
    IP: string
    Visible: bool
    Order: int
}

type LoginState =
    | NotLoggedIn
    | LoggedIn   //are we logged in
    | InFlight   //a login attempt is in progress
    | Failed of string  //we have failed to login, reason is string.

type FRHistoryRange = {
    StartDate: Option<string>
    EndDate: Option<string>
}
//possible handling of
//remote data state.
(*
type FRLogStatus =
    | NotLoaded
    | InFlight
    | Loaded
    | Failed of string
*)

type AppState = {

   // CurrentPage: Page
    LoginStatus: LoginState
    FRHistoryLoading: bool //TODO: consider a Union
    MatchedFaces: IdentifiedFace list
    FRWatchList: IdentifiedFace list
    AvailableCameras: CameraStream list //needs to be a seq or array. we'll convert it later
    LocalCameraList: LocalCamera list

    MaxFaceList: int
    MaxFRList: int
    CamSelectionModal: bool
    PlayAll: bool
    StreamsLoading: bool
    StartingAllStreams: bool
    StoppingAllStreams: bool
    StartingStream: CameraStream option
    StoppingStream: CameraStream option
    TriggerVideoRefresh: int
    DisplayDetectedImage: bool
    //Maybe this belongs in its own Elmish thing...
    FRLogs: seq<FRLog>
}

type Msg =
    | UpdateFace of IdentifiedFace
    | UpdateAvailableCameras of CameraInfo
    | ToggleCamSelectionModal //of bool
    | ResetCameraList
    | ToggleCamEnabled of LocalCamera
    | PlayAllCameras of bool //TODO: this still a thing?
    | StartingAllStreams of bool
    | StoppingAllStreams of bool
    | StartingStream of CameraStream option
    | StoppingStream of CameraStream option
    | UpdateStreamsLoading of bool //anytime a stream action is in flight. stop the presses!
    | RefreshVideoPlayers
    | ToggleDetectedImage
    | Login of (string * string) //user password combination
    | LoginResponse of bool
    | Logout
   // | GetFRLogs
    | GetFRLogsDateRange of FRHistoryRange
    | GetFRLogsResponse of seq<FRLog>
    //| UrlChanged of currentPage:Page

let init () =
        //let nextPage = (Router.currentPath() |> Page.parseFromUrlSegments)

        {
          //  CurrentPage = nextPage
            LoginStatus = NotLoggedIn
            FRHistoryLoading = false
            FRLogs = Seq.empty  //nuthin at first
            MaxFaceList = 20
            MaxFRList = 20
            MatchedFaces = []
            FRWatchList = []
            AvailableCameras = []
            LocalCameraList = [ ]
            CamSelectionModal =  false
            PlayAll = true   //is this still needed since we figured out autoplay?
            StreamsLoading = false
            StartingAllStreams = false
            StoppingAllStreams = false
            //kinda weird. only one stream at a time can be started in this case.
            StartingStream = None
            StoppingStream = None
            TriggerVideoRefresh = 0
            DisplayDetectedImage = true
        }, Cmd.none


module FRFuncs =
    let update_face_model (m: AppState) (face: IdentifiedFace)  =

        //split the good from the bad. Truncate the list so we don't just keep
        //adding things to the browser.
        if face.Status.Contains "FR" then
            if m.FRWatchList.Length >= m.MaxFRList then
                { m with FRWatchList = ((m.MaxFRList / 2), m.FRWatchList) ||> List.truncate  }
            else
                { m with FRWatchList = face :: m.FRWatchList  }
        else

            if m.MatchedFaces.Length >= m.MaxFaceList then
                { m with MatchedFaces = ((m.MaxFaceList / 2), m.MatchedFaces) ||> List.truncate }
            else
                { m with MatchedFaces = face :: m.MatchedFaces }
                //filter_unviewable m face //NOT using Local Cameras feature right now


module CameraFuncs =
    let updateCam (m: AppState) (c:LocalCamera) =
        m.LocalCameraList |> List.map(fun x ->
            if x.ID = c.ID then
              printfn $"Updated cam: %s{c.Name}"
              {x with Visible = (not c.Visible)}
            else
                x
           )


    //the list of cameras we are allowed to view has changes so we must also change!
    let update_available_cams (m: AppState) (cam_info: CameraInfo ) =
        //we will also need to update, the local cameras, A Cmd seems the way we would go.
        //cmd dispatches to updateLocalCamera list or something..
        printfn "updated camera info"
        printfn $"%A{cam_info.available_cams}"
        printfn "========================="
        printfn "updated stream info"
        printfn $"%A{cam_info.streams}"
        //a seperated camera list for specific local settings. NOT SURE IF WE'll keep this around
        //let local_cams = cam_info.available_cams |> List.mapi (fun i x -> { ID= i; Name = x.name; IP = x.ipaddress; Visible = x.enabled; Order = i; } )

        //look into the returned streams and set avail camera streaming property to true or false
        let streaming_cams =
            match cam_info.streams with
            | Ok s ->
                //compare what we can stream to what IS streaming and set each avail cam streaming flag.
                //we could probably handle error states here as well..
                //is the existence in the list itself good enough to determine it's stream state?
                cam_info.available_cams |> List.map(fun c ->
                       let is_running = s.streams |> List.exists (fun i ->  i.name = c.name)
                       {c with streaming = is_running}
                    )
            | Error e ->
                printfn $"ERROR GETTING STREAM STATE %s{e}"
                printfn "Returning available cams as is"
                cam_info.available_cams

        //let model = { m with AvailableCameras = streaming_cams; LocalCameraList = local_cams; StreamsLoading = false}
        { m with AvailableCameras = streaming_cams;  StreamsLoading = false; StartingAllStreams=false; StoppingAllStreams=false;}
        //we want to sync the streaming flag with our list of currently streaming cameras.


    let update_stream_load_state (m:AppState) (is_loading:  bool) =
        {m with StreamsLoading = is_loading}
    let starting_all_streams (m:AppState) (is_loading:  bool) =
        {m with StartingAllStreams = is_loading}
    let stopping_all_streams (m:AppState) (is_loading:  bool) =
        {m with StoppingAllStreams = is_loading}


    let refresh_video_players (m:AppState) =
        let n_count = m.TriggerVideoRefresh + 1
        printfn $"refresher: %i{n_count}"
        {m with TriggerVideoRefresh = n_count}, Cmd.none

    let filter_unviewable (m: AppState) (face: IdentifiedFace) =
        let is_good = m.LocalCameraList |> List.tryFindIndex(fun c -> c.Name.ToLower().Trim() = face.Cam.ToLower().Trim() && c.Visible )
        match is_good with
        | None -> m
        | Some _ -> { m with MatchedFaces = face :: m.MatchedFaces }

let toggle_detected_image (m:AppState) =
    {m with DisplayDetectedImage = (not m.DisplayDetectedImage)}, Cmd.none


module LoginFuncs =

    let do_login (cred: string * string ) = async {
        return false //RemoteApi.service.Login cred
    }

    let withAsyncLoginCommand (m:AppState) (cred: string * string) =
        let m = {m with LoginStatus = InFlight}
        m, Cmd.OfAsync.perform do_login cred LoginResponse

    let on_login_response (m:AppState) (msg: bool) =
        match msg with
        | true -> {m with LoginStatus = LoggedIn}, Cmd.none
        | _ -> {m with LoginStatus = Failed "could not log in with user name and password"}, Cmd.none

module FRHistoryFuncs =

    let  get_frlog_daterange (range: FRHistoryRange) = async {

        return Seq.empty
        (*let! res = RemoteApi.service.GetFRLogByDate range.StartDate range.EndDate

        return
            match res with
            | Ok logs -> logs
            | Error e ->
                printfn $"ERROR GETTING LOG: %A{e}"
                Seq.empty
                *)
    }

    //SIDE EFFECTS
    let withAsyncFRLogDateRangeCommand (m:AppState) (daterange: FRHistoryRange) =
        {m with FRHistoryLoading= true}, Cmd.OfAsync.perform get_frlog_daterange daterange  GetFRLogsResponse

    let on_frlogs_response (m:AppState) (msg: seq<FRLog>) =
        {m with FRLogs = msg; FRHistoryLoading=false}, Cmd.none

let update (msg:Msg) (model:AppState) : AppState * Cmd<Msg> =

    match msg with
    | UpdateFace face             -> ((model, face) ||> FRFuncs.update_face_model), Cmd.none
    | UpdateAvailableCameras cams -> ((model, cams ) ||> CameraFuncs.update_available_cams), Cmd.none
    | ToggleCamSelectionModal     -> { model with CamSelectionModal = (not model.CamSelectionModal) }, Cmd.none
    | ToggleCamEnabled cam        -> { model with LocalCameraList = (CameraFuncs.updateCam model cam) }, Cmd.none

    //not in use...
    | UpdateStreamsLoading state  -> (model, state) ||> CameraFuncs.update_stream_load_state, Cmd.none
    | StartingAllStreams state  -> (model, state) ||> CameraFuncs.starting_all_streams, Cmd.none
    | StoppingAllStreams state  -> (model, state) ||> CameraFuncs.stopping_all_streams, Cmd.none
    | RefreshVideoPlayers         -> model |> CameraFuncs.refresh_video_players
    | ToggleDetectedImage         -> model |> toggle_detected_image
    //Login events
    | Login cred                   -> (model,cred) ||> LoginFuncs.withAsyncLoginCommand
    | LoginResponse msg            -> (model, msg) ||> LoginFuncs.on_login_response
    | Logout                       -> {model with LoginStatus = NotLoggedIn}, Cmd.none

    //| GetFRLogs                    -> (model, Some(100)) ||> FRHistoryFuncs.withAsyncFRLogCommand
    | GetFRLogsDateRange range   -> (model, range) ||> FRHistoryFuncs.withAsyncFRLogDateRangeCommand
    | GetFRLogsResponse msg        -> (model, msg) ||> FRHistoryFuncs.on_frlogs_response
    //| UrlChanged page              -> { model with CurrentPage = page }, Cmd.none
