function assertUnreachable(x) {
  throw new Error("UNREACHABLE MSG: Didn't expect to get here");
}
function truncate_list(max, faces) {
  if (max === void 0) {
    return faces;
  }
  console.log("in truncate list");
  console.log(faces.length);
  if (faces.length >= max) {
    return faces.slice(0, faces.length / 2);
  } else {
    return faces;
  }
}
export function update(state, msg) {
  switch (msg.action) {
    case "LoginStateChanged": {
      return {...state, login_status: msg.payload};
    }
    case "FRHistoryLoading": {
      return {...state, fr_history_loading: msg.payload};
    }
    case "FRLogStateChanged": {
      return {...state, fr_logs: msg.payload};
    }
    case "AvailableCamerasChanged": {
      const cam_state = msg.payload;
      return {
        ...state,
        available_cameras: cam_state.available_cameras,
        stopping_all_streams: cam_state.stopping_all_streams,
        starting_all_streams: cam_state.starting_all_streams
      };
    }
    case "FRWatchlistChanged": {
      let fr_watchlist = truncate_list(state.max_faces, state.fr_watchlist);
      return {...state, fr_watchlist: [msg.payload, ...fr_watchlist]};
    }
    case "MatchedFacesChanged": {
      let matched_faces = truncate_list(state.max_faces, state.matched_faces);
      return {...state, matched_faces: [msg.payload, ...matched_faces]};
    }
    case "StartingAllStreams": {
      return {...state, starting_all_streams: msg.payload, should_autostart: true};
    }
    case "StoppingAllStreams": {
      return {...state, stopping_all_streams: msg.payload, should_autostart: false};
    }
  }
  return assertUnreachable(msg);
}
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
  ]
};
export const init_state = () => {
  return {
    login_status: {type: "NotLoggedIn"},
    available_cameras: [],
    matched_faces: [],
    fr_watchlist: [],
    max_faces: 100,
    fr_logs: [],
    should_autostart: true,
    fr_history_loading: false,
    streams_loading: false,
    starting_all_streams: false,
    stopping_all_streams: false
  };
};
