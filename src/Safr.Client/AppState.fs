module Safr.Client.AppState

//module EyemetricFR.Client.State
open EyemetricFR
open Safr.Client //.RemoteApi
open Safr.Types.Paravision.Streaming
open Safr.Types.Eyemetric
open EyemetricFR.Shared
open Safr.Client.Router
open Elmish
open Feliz.Router


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

//possible handling of
//remote data state.
(*
type FRLogStatus =
    | NotLoaded
    | InFlight
    | Loaded
    | Failed of string
*)

type Theme =
    | Light
    | Dark
type Model = {
    CurrentPage: Page
    Theme: Theme
    LoginStatus: LoginState
    Message : string
    Count: int
    MatchedFaces: IdentifiedFace list
    FRWatchList: IdentifiedFace list
    AvailableCameras: CameraStream list //needs to be a seq or array. we'll convert it later
    LocalCameraList: LocalCamera list
    SelectedCamera: int
    EditedCamera: CameraStream option
    //garbage hack
    ECamName: string
    ECamIP: string
    ECamEnabled: string
    ECamDirection: string
    ECamSampleRate: string

    CamWidth: int
    CamHeight: int
    PicSize: int
    FRPicSize: int
    MaxFaceList: int
    MaxFRList: int
    CamSelectionModal: bool
    PlayAll: bool
    StreamsLoading: bool
    TriggerVideoRefresh: int
    DisplayDetectedImage: bool
    //Maybe this belongs in its own Elmish thing...
    FRLogs: seq<FRLog>
    //FRLogs: FRLog []
}

type Msg =
//    | Login of (string, string)
    | GetMessage

    | GotMessage of string
    | UpdateFace of IdentifiedFace
  //  | GetAvailableCameras
    | UpdateAvailableCameras of CameraInfo
    | UpdatePicSize of int
    | UpdateFRPicSize of int
    | ToggleCamSelectionModal //of bool
    | UpdateSelectedCamera of int
    | UpdateEditedCamera of CameraStream

    //garbage hack
    | UpdateECamName of string
    | UpdateECamIP of string
    | UpdateECamEnabled of string
    | UpdateECamDirection of string
    | UpdateECamSampleRate of string
    | ResetCameraList

    | ToggleCamEnabled of LocalCamera
    | PlayAllCameras of bool //TODO: this still a thing?
    | UpdateStreamsLoading of bool //anytime a stream action is in flight. stop the presses!
    | RefreshVideoPlayers
    | ToggleDetectedImage
    | Login of (string * string) //user password combination
    | LoginResponse of bool
    | Logout
    | GetFRLogs
    | GetFRLogsResponse of seq<FRLog>
    | UrlChanged of currentPage:Page

let init () =
        let nextPage = (Router.currentPath() |> Page.parseFromUrlSegments)
        {
            CurrentPage = nextPage
            Theme = Light
            LoginStatus = NotLoggedIn
            FRLogs = Seq.empty  //nuthin at first
            //LoginStatus = NotLoggedIn
            //LoginStatus = InFlight
            Message = "Click me!"
            Count = 50
            CamWidth = 480
            CamHeight = 320
            MaxFaceList = 20
            MaxFRList = 20

            PicSize = 150
            FRPicSize = 150
            MatchedFaces = []
            FRWatchList = []
            AvailableCameras = []
            LocalCameraList = [ ]
            CamSelectionModal =  false
            SelectedCamera = 0

            ECamName = ""
            ECamIP = ""
            ECamEnabled = "false" //string for now......
            ECamDirection = "1"
            ECamSampleRate = ""
            EditedCamera = None
            PlayAll = true   //is this still needed since we figured out autoplay?
            StreamsLoading = false
            TriggerVideoRefresh = 0
            DisplayDetectedImage = true
        }, Cmd.none
        //Cmd.ofSub(fun _-> Router.navigatePage nextPage)

let filter_unviewable (m: Model) (face: IdentifiedFace) =
        let is_good = m.LocalCameraList |> List.tryFindIndex(fun c -> c.Name.ToLower().Trim() = face.Cam.ToLower().Trim() && c.Visible )
        match is_good with
        | None -> m
        | Some _ -> { m with MatchedFaces = face :: m.MatchedFaces }
let update_face_model (m: Model) (face: IdentifiedFace)  =

    //split the good from the bad.
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


//local visibility, no server update.
let updateCam (m: Model) (c:LocalCamera) =
    m.LocalCameraList |> List.map(fun x ->
        if x.ID = c.ID then
          printfn $"Updated cam: %s{c.Name}"
          {x with Visible = (not c.Visible)}
        else
            x
       )

let reset_camera_list (m: Model) =

    {m with SelectedCamera = 0
            ECamName = ""
            ECamIP = ""
            ECamEnabled = ""
            ECamDirection = ""
            EditedCamera = None
    }
//the list of cameras we are allowed to view has changes so we must also change!
let update_available_cams (m: Model) (cam_info: CameraInfo ) =
    //we will also need to update, the local cameras, A Cmd seems the way we would go.
    //cmd dispatches to updateLocalCamera list or something..
    printfn "We have received updated camera info"
    printfn $"%A{cam_info}"

    //a seperated camera list for specific local settings. NOT SURE IF WE'll keep this around
    //let local_cams = cam_info.available_cams |> List.mapi (fun i x -> { ID= i; Name = x.name; IP = x.ipaddress; Visible = x.enabled; Order = i; } )

    //look into the returned streams and set avail camera streaming property to true or false
    let streaming_cams =
        match cam_info.streams with
        | Ok s ->
            cam_info.available_cams |> List.map(fun c ->
                   let is_running = s.streams |> List.exists (fun i -> i.name = c.name)
                   {c with streaming = is_running}
                )
        | Error e ->
            printfn $"ERROR GETTING STREAM STATE %s{e}"
            printfn "Returning available cams as is"
            cam_info.available_cams

    //let model = { m with AvailableCameras = streaming_cams; LocalCameraList = local_cams; StreamsLoading = false}
    let model = { m with AvailableCameras = streaming_cams;  StreamsLoading = false}
    reset_camera_list model
    //we want to sync the streaming flag with our list of currently streaming cameras.



let update_selected_cam (m:Model) (id: int) =
      let c = m.AvailableCameras |> List.tryFind(fun x -> x.id = id)
      match c with
      | Some cam ->
          {
           m with SelectedCamera = id
                  EditedCamera = Some cam
                  ECamName = cam.name // Garbage hack
                  ECamIP = cam.ipaddress
                  ECamEnabled = (string cam.enabled)
                  ECamDirection = (string cam.direction)
                  ECamSampleRate = (string cam.detect_frame_rate)
           }
      | None ->
          {m with SelectedCamera = id;}

let update_edited_cam (m: Model) (cam: CameraStream) =
    {m with EditedCamera = Some cam}

let edit_cam_name (m: Model) (name: string) =
    printfn $"In Edit Cam Name: %s{name}"
    {m with ECamName = name}, Cmd.none

let update_stream_load_state (m:Model) (is_loading:  bool) =
    //other model state may be affected
    {m with StreamsLoading = is_loading}

let refresh_video_players (m:Model) =
    let n_count = m.TriggerVideoRefresh + 1
    printfn $"refresher: %i{n_count}"
    {m with TriggerVideoRefresh = n_count}, Cmd.none

let toggle_detected_image (m:Model) =
    {m with DisplayDetectedImage = (not m.DisplayDetectedImage)}, Cmd.none

let do_login (cred: string * string ) = async {
    printfn "WHAT THE HECK BRO!"
    let! res = RemoteApi.service.Login cred
    printfn $"%b{res}"
    return res
    //return true
}

let on_login (m:Model) (msg: bool) =
    if msg then
        {m with LoginStatus = LoggedIn}, Cmd.none
    else
        {m with LoginStatus = Failed "could not log in with user name and password"}, Cmd.none
let withAsyncLoginCommand (m:Model) (cred: string * string) =
    printfn $"%A{cred}"
    let m = {m with LoginStatus = InFlight}
    m, Cmd.OfAsync.perform do_login cred LoginResponse


let get_fr_log_top () = async {
    printfn "In GET Log Top client"
    let! res = RemoteApi.service.GetLatestLog None
    printfn "In GET Log Top client"
    return
        match res with
        | Ok logs ->
            printfn "========= LOGS ========="
            printfn $"%A{logs}"
            logs
        | Error e ->
            printfn $"ERROR GETTING LOG: %A{e}"
            Seq.empty
}

let on_frlogs_recvd (m:Model) (msg: seq<FRLog>) = {m with FRLogs = msg}, Cmd.none

let withAsyncFRLogCommand (m:Model) (count: Option<int>) =
    printfn "Async Log command"
    m, Cmd.OfAsync.perform get_fr_log_top () GetFRLogsResponse

let update (msg:Msg) (model:Model) : Model * Cmd<Msg> =

    match msg with
    | GetMessage                  -> model, Cmd.OfAsync.perform RemoteApi.service.GetMessage () GotMessage //Dummy Code
    | GotMessage msg              -> { model with Message = msg }, Cmd.none  //Dummy Code
    | UpdateFace face             -> ((model, face) ||> update_face_model), Cmd.none
    | UpdateAvailableCameras cams -> ((model, cams ) ||> update_available_cams), Cmd.none
    //| UpdatePicSize v -> {model with PicSize = v}, Cmd.none
    | UpdatePicSize v             -> {model with CamWidth =  v}, Cmd.none
    | UpdateFRPicSize v           -> {model with CamHeight  = v}, Cmd.none
    | ToggleCamSelectionModal     -> { model with CamSelectionModal = (not model.CamSelectionModal) }, Cmd.none
    | ToggleCamEnabled cam        -> { model with LocalCameraList = (updateCam model cam) }, Cmd.none
    | UpdateSelectedCamera id     -> (update_selected_cam model id), Cmd.none
    | UpdateEditedCamera cam      -> (update_edited_cam model cam), Cmd.none

    //garbage hack ECamXX
    | UpdateECamName name         -> (model, name) ||> edit_cam_name
    | UpdateECamIP ip             -> {model with ECamIP = ip}, Cmd.none
    | UpdateECamEnabled enabled   -> {model with ECamEnabled = enabled}, Cmd.none
    | UpdateECamDirection dir     -> {model with ECamDirection = dir}, Cmd.none
    | UpdateECamSampleRate rate   -> {model with ECamSampleRate = rate}, Cmd.none
    | ResetCameraList             ->  model |> reset_camera_list, Cmd.none
    | UpdateStreamsLoading state  -> (model, state) ||> update_stream_load_state, Cmd.none
    | RefreshVideoPlayers         -> model |> refresh_video_players
    | ToggleDetectedImage         -> model |> toggle_detected_image
    //Login events
    | Login cred                   -> (model,cred) ||> withAsyncLoginCommand
    | LoginResponse msg            -> (model, msg) ||> on_login
    | Logout                       -> {model with LoginStatus = NotLoggedIn}, Cmd.none

    | GetFRLogs                    -> (model, Some(100)) ||> withAsyncFRLogCommand
    | GetFRLogsResponse msg        -> (model, msg) ||> on_frlogs_recvd
    | UrlChanged page              -> { model with CurrentPage = page }, Cmd.none
