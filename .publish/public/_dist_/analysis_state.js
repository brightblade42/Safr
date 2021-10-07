function init_profile() {
  return {
    ccode: -1,
    first: "",
    middle: "",
    last: "",
    status: void 0,
    client_type: void 0,
    image: void 0
  };
}
function assertUnreachable(x) {
  throw new Error("UNREACHABLE MSG: Didn't expect to get here");
}
function add_or_update_frame(state, frame) {
  if (frame.frame_num >= state.analysis.frames.length) {
    return {...state, analysis: {...state.analysis, frames: [frame]}};
  } else {
    console.log("We'd update an existing Analyzed frame that matched by frame_num or elapsed_time");
    return state;
  }
}
function update_profile_action(state, action) {
  switch (action.type) {
    case "None": {
      return {...state, profile_action_state: action, current_profile: init_profile()};
    }
    case "Editing": {
      return {...state, profile_action_state: action};
    }
    case "Saving": {
      return {...state, profile_action_state: action, current_profile: action.msg};
    }
    case "Completed": {
      return {...state, profile_action_state: action};
    }
    case "Failed": {
      return {...state, profile_action_state: action};
    }
  }
}
export function update(state, msg) {
  switch (msg.action) {
    case "AnalyzedFrameChanged": {
      return add_or_update_frame(state, msg.payload);
    }
    case "VideoPlayStateChanged": {
      console.log("VideoPlayStateChanged Msg");
      return {...state, video_play_state: msg.payload};
    }
    case "ProfileActionChanged": {
      console.log("ProfileActionChanged Msg");
      return update_profile_action(state, msg.payload);
    }
    case "ClientTypesChanged": {
      console.log("ClientTypesChanged Msg");
      return {...state, client_type_list: msg.payload};
    }
    case "StatusTypesChanged": {
      console.log("StatusTypesChanged Msg");
      return {...state, status_list: msg.payload};
    }
    case "SelectedDetectionChanged": {
      console.log("SelectedDetectionChanged Msg");
      return {...state, selected_detection: msg.payload};
    }
  }
}
const statuses = [
  {
    sttsId: 13,
    description: "High Roller",
    insrtDate: "2017-06-21T12:54:49.33",
    updtDate: "2021-09-12T11:46:13.927",
    insrtBy: "ADMIN",
    updtBy: "admin",
    client: []
  },
  {
    sttsId: 14,
    description: "FR Watch",
    insrtDate: "2020-09-08T20:46:56.093",
    updtDate: "2020-09-08T20:46:56.093",
    insrtBy: "Admin",
    updtBy: "Admin",
    client: []
  },
  {
    sttsId: 15,
    description: "Card Counter",
    insrtDate: "2021-09-12T11:49:59.013",
    updtDate: "2021-09-12T11:49:59.013",
    insrtBy: "admin",
    updtBy: "admin",
    client: []
  }
];
let client_types = [
  {
    clntTid: 23,
    description: "Suspect",
    insrtDate: "2021-10-01T14:44:39.167",
    updtDate: "2021-10-01T14:44:39.167",
    insrtBy: "admin",
    updtBy: "admin",
    client: [],
    subClientType: []
  }
];
export function init_state() {
  return {
    is_analyzing_frame: false,
    is_detecting_faces: false,
    is_recognizing_faces: false,
    profile_action_state: {type: "None"},
    status_list: statuses,
    client_type_list: client_types,
    current_profile: init_profile(),
    video_play_state: {type: "Stopped"},
    name: "Analysis 1",
    snapshot_time: 2e3,
    capture_mode: "auto",
    small_frame_step: {plus: 1, minus: 1},
    med_frame_step: {plus: 3, minus: 3},
    large_frame_step: {plus: 5, minus: 5},
    analysis: {file: "", reference_images: void 0, frames: []},
    selected_detection: void 0
  };
}
