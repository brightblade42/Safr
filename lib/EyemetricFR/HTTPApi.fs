namespace EyemetricFR

open System
open System.Text
open System.Net.Http
open System.Net.Http.Headers
open System.Threading
open System.Threading.Tasks
open EyemetricFR.TPass.Types
open EyemetricFR.Paravision.Types.Streaming
open EyemetricFR.Paravision.Types.Identification
open System.IdentityModel.Tokens.Jwt
open Base64UrlEncoder

module HTTPApi =

    type HttpResult<'T> =
        | Success of 'T
        | TimedOutError of string
        | UnhandledError of Exception
        | StreamAlreadyBeingDecoded of (string * string)
        | StreamNotBeingDecoded of (string * string)
        | HTTPResponseError of string
        | FaceImageInvalid of string //seems out of place

    module Auth =

        //type TokenPair = AuthToken * Result<JWToken, string> option
        type TokenPair = AuthToken * Result<JwtSecurityToken, string> option

        let to_auth_header (token_str: string) =  AuthenticationHeaderValue("Bearer", token_str)

        let from_url64 (b64: string) = Encoder.Decode(b64)

        //alt
        let from_url642 (b64: string) =
            let paddings = 3 - ((b64.Length + 3) % 4)
            let url64 =
                match paddings > 0 with
                | true -> b64 + new String('=', paddings)
                | false -> b64

            url64.Replace('-','+').Replace('_','/')

        let private from_b64 = from_url64 >> Convert.FromBase64String >> Encoding.UTF8.GetString

        let private to_jwtoken tok_str =
            try
                Ok (JwtSecurityToken(tok_str))
            with
            | :? Exception as ex -> Error "could not parse JWT token"

        let to_token_pair token_resp: TokenPair  =
           let jwt_arr = token_resp.token.Split '.'
           match jwt_arr.Length with
           | x when x > 2  ->  (token_resp.token, Some (to_jwtoken token_resp.token))
           | _ -> failwith "Could not parse JWT token! Boo"


    let disable_cert_validation =
        let handler = new HttpClientHandler()
        handler.ClientCertificateOptions <- ClientCertificateOption.Manual
        handler.ServerCertificateCustomValidationCallback <-  (fun _ _ _ _ -> true)
        handler


    let create_client handler = match handler with | Some h -> new HttpClient(h) | None -> new HttpClient()

    let create_url base_url endpoint = Uri $"%s{base_url}/%s{endpoint}"

    type UriBuilder = string -> Uri  //function type

    //Some helper functions for building HTTP requests
    module Requests =

        type FormContent =
            | String of (string * string)
            | ByteArray of (string * byte array)

        let  request (method: HttpMethod) (uri: Uri) = new HttpRequestMessage(method, uri)

        let  form_content () = new MultipartFormDataContent()

        let add_content (content: FormContent) (form_data: MultipartFormDataContent)  =
            match content with
            | ByteArray c -> form_data.Add(new ByteArrayContent(snd c), fst c, "file.jpg")
            | String    c -> form_data.Add(new StringContent(snd c), fst c)

            form_data

        let image_content (bytes: byte array)  =
            let form_content = new MultipartFormDataContent()
            form_content.Add(new ByteArrayContent(bytes), "image", "file.jpg")
            form_content

        let images_content (image1: byte array, image2: byte array) =
            let form_content = new MultipartFormDataContent()
            form_content.Add(new ByteArrayContent(image1), "image1", "image1.jpg")
            form_content.Add(new ByteArrayContent(image2), "image2", "image2.jpg")
            form_content

        let json_content (json: string) = new StringContent(json, Encoding.UTF8, "application/json")

        let encoded_face_image_content (b64: string)  =
            let form_content = new MultipartFormDataContent()
            form_content.Add(new StringContent(b64), "encoded_face_image")
            form_content


        let get (client: HttpClient) (url :Uri)  = async {
            try
                let ctok  = new CancellationTokenSource(60000) //nothing lives more than 10 seconds
                let! resp = client.GetAsync(url, ctok.Token) |> Async.AwaitTask
                let! body = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success body
                    | false ->  HTTPResponseError resp.ReasonPhrase
            with
            | :? TaskCanceledException as ex -> return TimedOutError "delete request Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex

        }

        ///like get but with a Token!
        let get_with_tok (client: HttpClient) (uri :Uri) (token_pair: Auth.TokenPair option) = async {
            let req = request HttpMethod.Get uri
            match token_pair with
            | Some tp -> req.Headers.Authorization <- (tp |> fst |> Auth.to_auth_header)
            | None    -> ()

            let! resp = client.SendAsync(req) |> Async.AwaitTask
            let! res  = resp.Content.ReadAsStringAsync() |> Async.AwaitTask
            return
                match resp.IsSuccessStatusCode with
                | true  ->  Ok res
                | false ->  Error resp.ReasonPhrase
        }


        let delete (client: HttpClient) (uri: Uri) = async {
            let req = request HttpMethod.Delete uri
            try
                let ctok = new CancellationTokenSource(60000) //nothing lives more than 60 seconds
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success res
                    | false -> HTTPResponseError resp.ReasonPhrase
            with
            | :? TaskCanceledException as ex -> return TimedOutError "delete request Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex
        }


        let send (client: HttpClient) (req: HttpRequestMessage) = async {
            try
                let  ctok = new CancellationTokenSource(240000)
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res  = resp.Content.ReadAsStringAsync()  |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success res
                    | false -> HTTPResponseError resp.ReasonPhrase
            with
            | :? TaskCanceledException as ex -> return TimedOutError "post_image call Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex
        }

        let post_image (client: HttpClient) (uri: Uri) (bytes: byte array) = async {
            let req = request HttpMethod.Post uri
            try
                let ctok = new CancellationTokenSource(240000) //nothing lives more than 10 seconds
                req.Content <- image_content bytes
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res  = resp.Content.ReadAsStringAsync()  |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success res
                    | false -> HTTPResponseError resp.ReasonPhrase
            with
            | :? TaskCanceledException as ex -> return TimedOutError "post_image call Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex
        }

        let post_images (client: HttpClient) (uri: Uri) (bytes1: byte array) (bytes2: byte array) = async {
            let req = request HttpMethod.Post uri
            try
                let ctok = new CancellationTokenSource(240000) //nothing lives more than 10 seconds
                req.Content <- images_content (bytes1, bytes2)
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res  = resp.Content.ReadAsStringAsync()  |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success res
                    | false -> HTTPResponseError resp.ReasonPhrase
            with
            | :? TaskCanceledException as ex -> return TimedOutError "post_images call Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex

        }


        let post_b64image (client: HttpClient) (uri: Uri) (b64: string) = async {
            let req = request HttpMethod.Post uri
            try

                let ctok = new CancellationTokenSource(60000) //nothing lives more than 10 seconds
                req.Content <- encoded_face_image_content b64
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res  = resp.Content.ReadAsStringAsync()  |> Async.AwaitTask

                return
                    match resp.IsSuccessStatusCode with
                    | true  -> Success res
                    | false -> HTTPResponseError resp.ReasonPhrase

            with
            | :? TaskCanceledException as ex -> return TimedOutError "post_b64image call Timed out after 60 seconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex

        }


        let post_json (client: HttpClient) (uri: Uri) (body: string) = async {
            let req = request HttpMethod.Post uri
            try

                let ctok = new CancellationTokenSource() //nothing lives more than 60 seconds
                req.Content <-  json_content body
                let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
                let! res  = resp.Content.ReadAsStringAsync()  |> Async.AwaitTask
                return
                    match resp.IsSuccessStatusCode with
                    | true -> Success res
                    | false -> HTTPResponseError res
            with
            | :? TaskCanceledException as ex -> return TimedOutError "Post json call Timed out after 60 sseeconds"
            | :? AggregateException as ex -> return UnhandledError ex
            | :? Exception as ex -> return UnhandledError ex
        }


        let post_json_with_tok (client: HttpClient) (uri: Uri) (body: string) (token_pair: Auth.TokenPair option) = async {
            let req =  request HttpMethod.Post uri

            match token_pair with
            | Some tp -> req.Headers.Authorization <- (tp |> fst |> Auth.to_auth_header)
            | None    -> ()

            req.Content <-  json_content body
            let! resp = client.SendAsync(req)            |> Async.AwaitTask
            let! res  = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Ok res
                | false -> Error resp.ReasonPhrase
        }

        let put_json (client: HttpClient) (uri: Uri) (body: string) (token_pair: Auth.TokenPair option) = async {
            let req = request HttpMethod.Put uri

            match token_pair with
            | Some tp -> req.Headers.Authorization <- (tp |> fst |> Auth.to_auth_header)
            | None    -> ()

            req.Content <- json_content body
            let! resp = client.SendAsync(req)            |> Async.AwaitTask
            let! res  = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Ok res
                | false -> Error resp.ReasonPhrase
        }

        let delete_with_tok (client: HttpClient) (token_pair: Auth.TokenPair) (uri: Uri) = async {
            let req = request HttpMethod.Delete uri
            req.Headers.Authorization <- (token_pair |> fst |> Auth.to_auth_header)

            let ctok = new CancellationTokenSource(60000) //nothing lives more than 60 seconds
            let! resp = client.SendAsync(req, ctok.Token) |> Async.AwaitTask
            let! res = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            return
                match resp.IsSuccessStatusCode with
                | true  -> Ok res
                | false -> Error resp.ReasonPhrase

        }


    [<RequireQualifiedAccess>]
    module Paravision =

        open Requests

        let private start_decode_json (cam_stream: CameraStream) =
                $""" {{ "name": "%s{cam_stream.name}",
                              "source": "%s{cam_stream.connection}",
                              "skip_identical_frames": true,
                              "detect_frame_rate": %i{cam_stream.detect_frame_rate},
                              "detect_mask": false
                            }}"""

        let private stop_decode_json (cam_stream: CameraStream) = $""" {{"name": "%s{cam_stream.name}" }} """

        let start_decode (client: HttpClient) (make_url: UriBuilder) (cam_stream: CameraStream) = async {
            return! post_json client (make_url "start_decode") (start_decode_json cam_stream)
        }
        let stop_decode (client: HttpClient) (make_url: UriBuilder) (cam_stream: CameraStream) = async {
            return! post_json client (make_url "stop_decode" ) (stop_decode_json cam_stream)
        }
        let check_health (client: HttpClient) (make_url: UriBuilder) = async {
            return! get client (make_url "health")
        }

        let get_streams (client: HttpClient) (make_url: UriBuilder) = async {
            return! get client (make_url "streams")
        }
        //TODO: there are optional request query  parameters that we'll ignore for now
        let get_identities (client: HttpClient) (make_url: UriBuilder) = async {
            return!  get client (make_url "api/identities?limit=100000")
        }

        //TODO: ident_id is a uuid. maybe we represent that in the type
        let get_identity (client: HttpClient) (make_url: UriBuilder) (req: GetIdentityReq) = async {
            return! get client (make_url $"api/identities/%s{req.id}")
        }

        let create_identity (client: HttpClient) (make_url: UriBuilder) (img_bytes: byte []) = async {
           return! post_image client (make_url "api/identities") img_bytes
        }

        //Perhaps FACEIMAGE as a type name is not quite right..
        let detect_faces (client: HttpClient) (make_url: UriBuilder) (face: FaceImage) = async {
            //TODO: consider other available query string parameters. Max_Faces..
            match face with
            | Binary bin      -> return! post_image client (make_url "api/detect") bin
            | _               -> return  failwith "Detect faces only supports binary data"
        }

        //compare two images and see how probably that they are the same person.
        let verify_faces (client: HttpClient) (make_url: UriBuilder) (face1: FaceImage) (face2: FaceImage) = async {
            let f1 =
                match face1 with
                | Binary bin -> bin
                | _ -> Array.zeroCreate 0

            let f2 =
                match face2 with
                | Binary bin -> bin
                | _ -> Array.zeroCreate 0

            if f1.Length = 0 || f2.Length = 0 then
                return FaceImageInvalid "One of the provided face images was empty."
            else
                let! res = post_images client (make_url "api/verify") f1 f2
                return res

        }
        let detect_identity (client: HttpClient) (make_url: UriBuilder) (face: FaceImage) = async {
            //TODO: consider other available query string parameters. Max_Faces..
            match face with
            | B64Encoding bar -> return! post_b64image client (make_url "api/lookup ") bar
            | Binary bin      -> return! post_image client (make_url "api/lookup?num_faces=5") bin
            | _               -> return  failwith "unsupported FaceImage"
        }
        let delete_identity (client: HttpClient) (make_url: UriBuilder) (id: string) = async {
            return!  delete client (make_url $"api/identities/%s{id}")
        }

        let add_face_to_identity (client: HttpClient) (make_url: UriBuilder)  (req: AddFaceReq) = async {

            printfn "====== Add face to identity"
            //TODO: use req type to set confidence. hard coded to 0.8 at the moment

            return!
                match req.image with
                | Binary fb ->
                    let post_req = request HttpMethod.Post (make_url $"api/identities/%s{req.id}/faces")

                    let fc =
                        form_content ()
                        |> add_content (String ("confidence_threshold", "0.8"))
                        |> add_content (ByteArray ("image", fb))
                    post_req.Content <- fc
                    send client post_req
                | _ -> async { return FaceImageInvalid "Only a binary Face image is currently supported." }

        }

        let delete_face_from_identity (client: HttpClient) (make_url: UriBuilder) (req: DeleteFaceReq) = async {
            return!  delete client (make_url $"api/identities/%s{req.id}/faces/%i{req.face_id}")
        }

        let get_faces (client: HttpClient) (make_url: UriBuilder) (id: string) = async {
            return! get client (make_url $"api/identities/%s{id}/faces/")
        }

    [<RequireQualifiedAccess>]
    module TPass =

        open Requests

        let swap_img_uri (uri: Uri) =
            //TODO: This is hacky bullshit.
            match (Environment.GetEnvironmentVariable("IMG_URL_TYPE"))  with
            | "internal" -> Uri (uri.ToString().Replace("173.220.177.75", "192.168.3.12"))
            | _          -> uri

        ///get a jwt token from a TPass server
        let get_token (client: HttpClient) (cred: Credential) (make_url: UriBuilder) = async {
            let (UserPass (user, pass)) = cred
            let json   = $"""{{"username": "%s{user}", "password": "%s{pass}" }}"""
            let! token =  post_json_with_tok client (make_url "token") json None

            return
                match (Result.bind TokenResponse.from token) with
                | Ok t    ->  Auth.to_token_pair t
                | Error e -> failwith $"could not parse JWT token from response: %s{e}"

        }


        let get_companies (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) = async {
           return!  get_with_tok client (make_url "companies/restricted?groups=Admin") (Some token_pair)
        }

        let get_client_types (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) = async {
                return! get_with_tok client (make_url "clienttypes/getclienttype") (Some token_pair)
        }

        let get_status_types (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) = async {
                return! get_with_tok client (make_url "status") (Some token_pair)
        }

        let search_client (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) id typ compid = async {
           let uri =
               match typ with
               | "Student"   -> make_url $"clients/searchclient?id=%s{id}&type=%s{typ}&compid=%s{compid}"
               | "Personnel" -> make_url $"clients/searchpersonnel?compid=%s{compid}&value=%s{id}"
               | "Visitor"   -> make_url $"clients/searchvisitor?&value=%s{id}"
               | _ -> failwith $"Client type %s{typ} not supported"

           return! get_with_tok client uri (Some token_pair)
        }


        let register_pv_id  (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) ccode pv_id = async {
            let json = $"""{{"CCode": %s{ccode}, "ID": "%s{pv_id}" }} """
            return! post_json_with_tok client (make_url "paravision/registerpvid") json (Some token_pair)
        }

        let update_pv_id (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) ccode pv_id = async {
            let json = $"""{{"CCode": %s{ccode}, "ID": "%s{pv_id}" }} """
            return! (put_json client (make_url "paravision/updatepvid" ) json (Some token_pair))
        }
        let get_client_by_pv_id (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) pv_id = async {
            return!  (get_with_tok client (make_url $"clients/loadbybiorec?id=%s{pv_id}") (Some token_pair))
        }

        let get_client_by_ccode (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) ccode = async {
            let url =  (make_url $"clients/load?id=%s{ccode}")
            //printfn "CCODE URL"
            //printfn $"%A{url}"
            return!  get_with_tok client url (Some token_pair)
        }

        let download_image (client: HttpClient) (url: string) = async {
            let uri   =  swap_img_uri (Uri url)
            let req   =  request HttpMethod.Get uri
            let! resp =  client.SendAsync(req) |> Async.AwaitTask
            return! resp.Content.ReadAsByteArrayAsync() |> Async.AwaitTask
        }

        let get_last_checkin_record (client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) ccode compid (date: DateTime) = async {
            let dt = date.ToString("yyyy-MM-dd")
            return! get_with_tok client (make_url $"studentlog/recent?compid=%s{compid}&ccode=%s{ccode}&date=%s{dt}") (Some token_pair)
        }

        let create_profile(client: HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) (profile: NewClient) = async {
            let json = NewClient.to_str profile
            //printfn $"%A{json}"

            return! post_json_with_tok client (make_url "clients") json (Some token_pair)
        }

        let delete_profile(client: HttpClient) (token_pair: Auth.TokenPair)(make_url: UriBuilder) ccode = async {
            let url = (make_url $"clients/delete?ccode=%s{ccode}")
            return! delete_with_tok client token_pair url
        }

        let edit_profile(client: HttpClient) (token_pair: Auth.TokenPair)(make_url: UriBuilder) (req: EditProfileRequest) = async {
            let json = EditProfileRequest.to_str req
            return! (put_json client (make_url $"/client/{req.ccode}" ) json (Some token_pair))
        }

        let check_in_student (client:  HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) (checkin_rec: CheckInRecord) = async {
            let json = CheckInRecord.to_str checkin_rec
            return! post_json_with_tok client (make_url "studentlog/checkin") json (Some token_pair)
        }

        let check_out_student (client:  HttpClient) (token_pair: Auth.TokenPair) (make_url: UriBuilder) (checkout_rec: CheckOutRecord) = async {
            return! put_json client (make_url "studentlog/checkout") (CheckOutRecord.to_str checkout_rec)  (Some token_pair)
        }
