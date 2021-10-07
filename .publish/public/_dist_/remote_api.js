export function default_settings(is_prod) {
  if (is_prod) {
    return {
      api_root: `${window.location.origin}/fr/`,
      hub: `${window.location.origin}/frhub`
    };
  } else {
    return {
      api_root: `http://localhost:8085/fr/`,
      hub: `http://localhost:8085/frhub/`
    };
  }
}
export function RemoteApiBuilder(is_prod) {
  let settings = default_settings(is_prod);
  let api_root = settings.api_root;
  let hub = settings.hub;
  async function create_profile(profile) {
    let b = profile.image;
    profile.image = void 0;
    console.log("about to create profile");
    console.log(profile);
    const api_endpoint = `${api_root}create-profile`;
    let form_data = new FormData();
    let nprof = {
      clntTid: profile.client_type,
      sttsId: profile.status,
      fName: profile.first,
      lName: profile.last
    };
    form_data.append("image", b, "file.jpg");
    form_data.append("profile", JSON.stringify(nprof));
    try {
      let res = await fetch(api_endpoint, {
        method: "POST",
        body: form_data
      });
      let json = await res.json();
      return json;
    } catch (e) {
      console.log(e);
    }
  }
  const create_json_post = (json) => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    };
  };
  async function validate_user(user, pwd) {
    const endpoint = `${api_root}validate_user`;
    const json_post = create_json_post({
      user,
      password: pwd
    });
    let resp = await fetch(endpoint, json_post);
    return resp.json();
  }
  async function get_client_types() {
    const endpoint = `${api_root}get-client-types`;
    let resp = await fetch(endpoint);
    return resp.json();
  }
  async function get_status_types() {
    const endpoint = `${api_root}get-status-types`;
    let resp = await fetch(endpoint);
    return resp.json();
  }
  async function get_frlogs(start, end) {
    const endpoint = `${api_root}logs`;
    const json_post = create_json_post({
      start_date: start,
      end_date: end
    });
    let resp = await fetch(endpoint, json_post);
    return resp.json();
  }
  return Object.freeze({
    root: api_root,
    hub,
    validate_user,
    get_frlogs,
    get_client_types,
    get_status_types,
    create_profile
  });
}
