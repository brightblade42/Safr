namespace Paravision

open System
open System.Text
open System.Net.Http
open System.Threading
open System.Threading.Tasks
open Safr.Types.Paravision.Identification
open Safr.Types.Paravision.Streaming

//esentially mirrors the Paravision remote api
[<AutoOpen>]
module HTTPApi =

    type HttpApiResult<'T> =
        | Success of 'T
        | TimedOutError of string
        | UnhandledError of Exception
        | StreamAlreadyBeingDecoded of (string * string)
        | StreamNotBeingDecoded of (string * string)
        | HTTPResponseError of string
        | FaceImageInvalid of string

    let create_client (handler: HttpClientHandler option) =
        match handler with | Some h -> new HttpClient(h) | None -> new HttpClient()

    let create_url base_url endpoint = $"%s{base_url}/%s{endpoint}" |> Uri

    type UriBuilder = string -> Uri  //function type

    let private request (method: HttpMethod) (uri: Uri) = new HttpRequestMessage(method, uri)

    let private form_content () = new MultipartFormDataContent()

    type private FormContent =
        | String of (string * string)
        | ByteArray of (string * byte array)

    let private add_content (content: FormContent) (form_data: MultipartFormDataContent)  =
        match content with
        |  ByteArray c ->
            form_data.Add(new ByteArrayContent(snd c), fst c, "file.jpg")
            form_data
        | String c ->
            form_data.Add(new StringContent(snd c), fst c)
            form_data

    let private image_content (bytes: byte array)  =
        let form_content = new MultipartFormDataContent()
        form_content.Add(new ByteArrayContent(bytes), "image", "file.jpg")
        form_content

    let private encoded_face_image_content (b64: string)  =
        let form_content = new MultipartFormDataContent()
        form_content.Add(new StringContent(b64), "encoded_face_image")
        form_content
    let private json_content (json: string) = new StringContent(json, Encoding.UTF8, "application/json")
    //TODO:may need to be configurable 30 secs may not be the goldilocks zone
    //let ctok = new CancellationTokenSource(60000) //nothing lives more than 10 seconds


    let private get (client: HttpClient) (url :Uri) = async {

        try

            let ctok = new CancellationTokenSource(60000) //nothing lives more than 10 seconds
            let! resp = client.GetAsync(url, ctok.Token) |> Async.AwaitTask
            let! body = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true -> Success body
                | false ->  HTTPResponseError resp.ReasonPhrase
        with
        | :? TaskCanceledException as ex -> return TimedOutError "delete request Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex

    }
    let private delete (client: HttpClient) (uri: Uri) = async {
        let req =  (HttpMethod.Delete, uri) ||> request
        try

            let ctok = new CancellationTokenSource(60000) //nothing lives more than 60 seconds
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true -> Success res
                | false -> HTTPResponseError resp.ReasonPhrase
        with
        | :? TaskCanceledException as ex -> return TimedOutError "delete request Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex
    }



    let private send (client: HttpClient) (req: HttpRequestMessage) = async {

        try
            let ctok = new CancellationTokenSource(240000)
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Success res
                | false -> HTTPResponseError resp.ReasonPhrase
        with
        | :? TaskCanceledException as ex -> return TimedOutError "post_image call Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex
    }

    let private post_image (client: HttpClient) (uri: Uri) (bytes: byte array) = async {
        //printfn "PV API POST: uri: %A" uri
        let req = new HttpRequestMessage(HttpMethod.Post, uri)
        try

            let ctok = new CancellationTokenSource(240000) //nothing lives more than 10 seconds
            req.Content <- bytes |> image_content
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Success res
                | false -> HTTPResponseError resp.ReasonPhrase
        with
        | :? TaskCanceledException as ex -> return TimedOutError "post_image call Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex
    }
    let private post_b64image (client: HttpClient) (uri: Uri) (b64: string) = async {
        let req = new HttpRequestMessage(HttpMethod.Post, uri)
        try

            let ctok = new CancellationTokenSource(60000) //nothing lives more than 10 seconds
            req.Content <- b64 |> encoded_face_image_content
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Success res
                | false -> HTTPResponseError resp.ReasonPhrase

        with
        | :? TaskCanceledException as ex -> return TimedOutError "post_b64image call Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex

    }


    let private post_json (client: HttpClient) (uri: Uri) (body: string) = async {
        let req = (HttpMethod.Post, uri ) ||> request
        try

            let ctok = new CancellationTokenSource() //nothing lives more than 60 seconds
            req.Content <-  body |> json_content
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask
            //let resp = build_pv_error resp
            return
                match resp.IsSuccessStatusCode with
                | true -> Success res
                | false -> HTTPResponseError res
        with
        | :? TaskCanceledException as ex -> return TimedOutError "Post json call Timed out after 60 seconds"
        | :? AggregateException as ex -> return UnhandledError ex
        | :? Exception as ex -> return UnhandledError ex
    }

    let private start_decode_json (cam_stream: CameraStream) =
            let json_str = $""" {{ "name": "%s{cam_stream.name}",
                          "source": "%s{cam_stream.connection}",
                          "skip_identical_frames": true,
                          "detect_frame_rate": %i{cam_stream.detect_frame_rate},
                          "detect_mask": false
                        }}"""
            json_str


    let private stop_decode_json (cam_stream: CameraStream) = $""" {{"name": "%s{cam_stream.name}" }} """

     //models the paravision Streaming api
    module Streaming =
        let start_decode (client: HttpClient) (make_url: UriBuilder) (cam_stream: CameraStream) = async {
            let json = cam_stream |> start_decode_json
            return! (client, ("start_decode" |> make_url), json) |||> post_json
        }
        let stop_decode (client: HttpClient) (make_url: UriBuilder) (cam_stream: CameraStream) = async {
            let json = cam_stream |> stop_decode_json
            return! (client, ("stop_decode" |> make_url) , json) |||> post_json
        }
        let check_health (client: HttpClient) (make_url: UriBuilder) = async {
            let url = "health" |> make_url
            return! (client, url) ||> get
        }

        let get_streams (client: HttpClient) (make_url: UriBuilder) = async {
            return! (client, ("streams" |> make_url)) ||> get
        }

    //models the paravision Identification api
    module Identification =

        //TODO: there are optional request query  parameters that we'll ignore for now
        let get_identities (client: HttpClient) (make_url: UriBuilder) = async {
            return! (client, ("api/identities?limit=100000" |> make_url)) ||> get
        }

        //TODO: ident_id is a uuid. maybe we represent that in the type
        let get_identity (client: HttpClient) (make_url: UriBuilder) (req: GetIdentityReq) = async {
            return! (client, ($"api/identities/%s{req.id}" |> make_url)) ||> get
        }

        let create_identity (client: HttpClient) (make_url: UriBuilder) (img_bytes: byte []) = async {
           return! (client, ("api/identities" |> make_url), img_bytes) |||> post_image
        }


        let detect_identity (client: HttpClient) (make_url: UriBuilder) (face: FaceImage) = async {
            //let (Binary bar) = face //should match on other possibilities?
            //TODO: consider other available query string parameters. Max_Faces..
            match face with
            | B64Encoding bar ->
                let url = "api/lookup " |> make_url
                return! (client, url, bar) |||> post_b64image
            | Binary bin ->
                return! (client, ("api/lookup?num_faces=1" |> make_url), bin) |||> post_image
            | _ ->
                return failwith "unsupported FaceImage"
        }
        let delete_identity (client: HttpClient) (make_url: UriBuilder) (id: string) = async {
            return! (client, ($"api/identities/%s{id}" |> make_url)) ||> delete
        }


        let add_face_to_identity (client: HttpClient) (make_url: UriBuilder)  (req: AddFaceReq) = async {

            printfn "====== Add face to identity"
            //TODO: use req type to set confidence. hard coded to 0.8 at the moment

            return!
                match req.image with
                | Binary fb ->
                    let uri = $"api/identities/%s{req.id}/faces" |> make_url
                    let hreq = new HttpRequestMessage(HttpMethod.Post, uri)
                    let fc =
                        form_content ()
                        |> add_content (String ("confidence_threshold", "0.8"))
                        |> add_content (ByteArray ("image", fb))
                    hreq.Content <- fc
                    (client, hreq) ||> send
                | _ -> async { return FaceImageInvalid "Only a binary Face image is currently supported." }

        }
        let delete_face_from_identity (client: HttpClient) (make_url: UriBuilder) (req: DeleteFaceReq) = async {
            printfn "DELETING face from identity"
            let uri = $"api/identities/%s{req.id}/faces/%i{req.face_id}" |> make_url
            return! (client, uri) ||> delete

        }

        let get_faces (client: HttpClient) (make_url: UriBuilder) (id: string) = async {
            printfn "GETTING FACES"
            let uri = $"api/identities/%s{id}/faces/" |> make_url
            return! (client, uri) ||> get
        }

