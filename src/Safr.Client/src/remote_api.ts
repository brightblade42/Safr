


export function RemoteApiBuilder() {

    let api_root = `${window.location.href}fr/`;
    api_root = `http://localhost:8085/fr/`; //if dev server proxy..

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
        validate_user,
        get_frlogs
    });
}