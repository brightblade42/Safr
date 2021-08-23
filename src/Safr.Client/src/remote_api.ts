
export function default_settings (is_prod:boolean) {
    if (is_prod) {
        return {
            api_root: `${window.location.origin}/fr/`,
            hub: `${window.location.origin}/frhub`
        }
    }
    else {
        return {
            api_root: `http://localhost:8085/fr/`,
            hub: `http://localhost:8085/frhub/`
        }
    }
}

export function RemoteApiBuilder(is_prod) {

    //let api_root = `${window.location.href}fr/`;
    //api_root = `http://localhost:8085/fr/`; //if dev server proxy..
    let settings   = default_settings(is_prod);
    let api_root = settings.api_root;
    let hub = settings.hub;

    const create_json_post = (json) => {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }

    }

    async function validate_user (user, pwd)  {

        const endpoint = `${api_root}validate_user`

        const json_post =
               create_json_post( {
                    user: user,
                    password: pwd
               });

        let resp = await fetch(endpoint, json_post);
        return resp.json();

    }

    async function get_frlogs (start, end)  {

        const endpoint = `${api_root}logs`
        const json_post =
            create_json_post( {
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
        get_frlogs
    });
}