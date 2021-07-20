namespace EyemetricFR

open System
open System.Net.Http
open System.Net.Http.Headers
open System.Text
open EyemetricFR.TPass.Types
open Base64UrlEncoder

module TPassApi =

    type TokenPair = (AuthToken * Result<JWToken, string> option)

    let from_url64 (b64: string) = Encoder.Decode(b64)

    let from_url642 (b64: string) =
        let paddings = 3 - ((b64.Length + 3) % 4)
        let url64 =
            match paddings > 0 with
            | true -> b64 + new String('=', paddings)
            | false -> b64

        url64.Replace('-','+').Replace('_','/')
    let private from_b64 = from_url64 >> Convert.FromBase64String >> Encoding.UTF8.GetString

   // let private to_jwtoken2 = from_b64 >> JWToken.parse
    let private to_jwtoken tstr =
        let x = tstr |> from_b64
        printfn "TOKEN: %s" x
        x |> JWToken.parse
    (*
    let to_jwt tok =
        let jt = new JwtSecurityTokenHandler()
        let tok = jt.ReadJwtToken(tok)
        tok.Paylo
        *)
    ///a little easier to pass around the raw token with the decoded object
    let private to_token_pair token_resp: TokenPair  =
       (token_resp.token, None) //parsing jwt token is a nightmare
       //let jwt = token_resp.token.Split '.'
       //match jwt.Length with
       //| x when x > 2  ->  (token_resp.token, jwt.[1] |> to_jwtoken |> Some)
       //| _ -> failwith "Bad jwt token"


    let disable_cert_validation =

        let handler = new System.Net.Http.HttpClientHandler()

        handler.ClientCertificateOptions <- ClientCertificateOption.Manual
        handler.ServerCertificateCustomValidationCallback <-  (fun _ _ _ _ -> true)
        //TODO: the commented code below is only available in .net standard 2.1.
                                                                //HttpClientHandle
                                                                // .DangerousAcceptAnyServerCertificateValidator
        handler

    let create_client (handler: HttpClientHandler option)  =
        match handler with
        | Some h -> new HttpClient(h)
        | _ -> new HttpClient()

    let create_url base_url endpoint = (sprintf "%s/%s" base_url endpoint) |> Uri

    type UriBuilder = string -> Uri  //function typei

    let private request (method: HttpMethod) (uri: Uri) = new HttpRequestMessage(method, uri)
    let private image_content (bytes: byte array)  =
        let form_content = new MultipartFormDataContent()
        form_content.Add(new ByteArrayContent(bytes), "image", "file.jpg")
        form_content

    let private json_content (json: string) = new StringContent(json, Encoding.UTF8, "application/json")
    let to_auth_header (token_str: string) = new AuthenticationHeaderValue("Bearer", token_str)
    let private get (client: HttpClient) (uri :Uri) (token_pair: TokenPair option) = async {

        let req = (HttpMethod.Get , uri)  ||> request
        match token_pair with
        | Some tp ->
            req.Headers.Authorization <- (tp |> fst |> to_auth_header)
        | None -> ()

        let! resp = client.SendAsync(req) |> Async.AwaitTask
        let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask
        return
            match resp.IsSuccessStatusCode with
            | true -> Ok res
            | false ->  Error resp.ReasonPhrase
    }
    let private delete (client: HttpClient) (uri: Uri) = async {
        let req =  (HttpMethod.Delete, uri) ||> request
        let! resp = client.SendAsync(req) |> Async.AwaitTask
        let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

        return
            match resp.IsSuccessStatusCode with
            | true -> Ok res
            | false -> Error resp.ReasonPhrase
    }

    let private post_image (client: HttpClient) (uri: Uri) (bytes: byte array) = async {
        let req = new HttpRequestMessage(HttpMethod.Post, uri)
        req.Content <- bytes |> image_content
        let! resp = client.SendAsync(req) |> Async.AwaitTask
        let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

        return
            match resp.IsSuccessStatusCode with
            | true  -> Ok res
            | false -> Error resp.ReasonPhrase
    }

    let private post_json (client: HttpClient) (uri: Uri) (body: string) (token_pair: TokenPair option) = async {
        let req = (HttpMethod.Post, uri ) ||> request

        match token_pair with
        | Some tp ->
            req.Headers.Authorization <- (tp |> fst |> to_auth_header)
        | None -> ()

        req.Content <-  body |> json_content
        let! resp = client.SendAsync(req) |> Async.AwaitTask
        let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

        return
            match resp.IsSuccessStatusCode with
            | true -> Ok res
            | false -> Error resp.ReasonPhrase
    }
    let private put_json (client: HttpClient) (uri: Uri) (body: string) (token_pair: TokenPair option) = async {
        let req = (HttpMethod.Put, uri ) ||> request

        match token_pair with
        | Some tp ->
            req.Headers.Authorization <- (tp |> fst |> to_auth_header)
        | None -> ()

        req.Content <-  body |> json_content
        let! resp = client.SendAsync(req) |> Async.AwaitTask
        let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

        return
            match resp.IsSuccessStatusCode with
            | true -> Ok res
            | false -> Error resp.ReasonPhrase
    }

    let swap_img_uri (uri: Uri) =
        //TODO: This is hacky bullshit.
        let env_swap = Environment.GetEnvironmentVariable("IMG_URL_TYPE")
        match env_swap with
        //| "internal" ->
        | "internal" ->
             let ext_url = uri.ToString()
             ext_url.Replace("173.220.177.75", "192.168.3.12") |> Uri
        | _ ->
            uri


    let get_version (client: HttpClient) (make_url: UriBuilder) = async {
        return! (client, "version" |> make_url, None ) |||> get
    }

    let get_token (client: HttpClient) (cred: Credential) (make_url: UriBuilder) = async {
        let (UserPass (user, pass)) = cred
        let json = (sprintf """{"username": "%s", "password": "%s" } """ user pass)
        let! token =  (post_json client ("token" |> make_url) json None)

        let tkr = token |> Result.bind (fun x -> x |> TokenResponse.parse)

        return
            match tkr with
            | Ok t ->  t |> to_token_pair
            | Error e -> failwith (sprintf "could not parse JWT token from response: %s" e)

    }

    let get_companies (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) = async {

       //TODO: abandon this way. we don't need to get companies just yet.
       //let jwt = match (snd token_pair) with | Ok t -> t | Error e -> failwith "JWT Token is not valid"
       //printfn "%A" jwt
       //let uri = (sprintf "companies/restricted?groups=%s" jwt.role) |> make_url
       //Place holder
       let uri = "companies/restricted?groups=Admin" |> make_url

       return! (client, uri, Some token_pair) |||> get

    }

    let search_client (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) id typ compid = async {
       let uri =
           match typ with
           | "Student" -> (sprintf "clients/searchclient?id=%s&type=%s&compid=%s" id typ compid) |> make_url
           | "Personnel" -> (sprintf "clients/searchpersonnel?compid=%s&value=%s" compid id) |> make_url
           | "Visitor" -> (sprintf "clients/searchvisitor?&value=%s" id) |> make_url


       return! (client, uri, Some token_pair) |||> get
    }


    let register_pv_id  (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) ccode pv_id = async {
        let uri = "paravision/registerpvid" |> make_url
        let json = (sprintf """{"CCode": %s, "ID": "%s" } """ ccode pv_id)
        return! (post_json client uri json (Some token_pair))
    }

    let update_pv_id (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) ccode pv_id = async {
        let uri = "paravision/updatepvid" |> make_url
        let json = (sprintf """{"CCode": %s, "ID": "%s" } """ ccode pv_id)
        return! (put_json client uri json (Some token_pair))
    }
    let get_client_by_pv_id (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) pv_id = async {
        let uri = (sprintf "clients/loadbybiorec?id=%s" pv_id)|> make_url
        return!  (get client uri (Some token_pair))
    }

    let get_client_by_ccode (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) ccode = async {

        let uri = (sprintf "clients/load?id=%s" ccode) |> make_url
        return!  (get client uri (Some token_pair))
    }
    let download_image (client: HttpClient) (url: string) = async {

        //let uri = url |> Uri |> TPass.Utils.swap_img_uri
        let uri = url |> Uri |> swap_img_uri
        let req =  (HttpMethod.Get, uri) ||> request
        let! resp = client.SendAsync(req) |> Async.AwaitTask
        return! resp.Content.ReadAsByteArrayAsync() |> Async.AwaitTask
    }

    let get_last_checkin_record (client: HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) ccode compid (date: DateTime) = async {
        let dt = date.ToString("yyyy-MM-dd")
        let uri = (sprintf "studentlog/recent?compid=%s&ccode=%s&date=%s" compid ccode dt) |> make_url
        return! (get client uri (Some token_pair))
    }

    let check_in_student (client:  HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) (checkin_rec: CheckInRecord) = async {
        let json = checkin_rec |> CheckInRecord.to_str
        let uri = "studentlog/checkin" |>  make_url
        return! (post_json client uri json (Some token_pair))
    }
    let check_out_student (client:  HttpClient) (token_pair: TokenPair) (make_url: UriBuilder) (checkout_rec: CheckOutRecord) = async {
        let json = checkout_rec |> CheckOutRecord.to_str
        let uri = "studentlog/checkout" |> make_url
        return! (put_json client uri json (Some token_pair))

    }

