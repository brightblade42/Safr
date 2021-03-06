open System
#r "nuget: FSharp.Data"
#r "nuget: Newtonsoft.Json"
open FSharp.Data

let url = "http://10.211.55.16/fr/enrollment/create"
let comps = ["1029"] //;"1036";"1037";"1038"]
let make_enroll_req (compid: string) (search_val: string) =
        $""" {{
                   "command": "enroll",
                   "candidates": [
                       {{
                           "ccode": "",
                           "id_or_name": "%s{search_val}",
                           "typ": "Personnel",
                           "comp_id": "%s{compid}"
                       }}

                   ]
           }} """

open FSharp.Data.HttpRequestHeaders

let enroll (compid:string) (search_val: string) =
    Http.RequestString (url,
                        headers = [ContentType HttpContentTypes.Json ],
                        body = TextRequest (make_enroll_req compid search_val)

                                               )

for comp in comps do
    printfn "======================================"
    printfn "=========  %s  ======================" comp
    printfn "======================================"
    for i in ['A'..'Z'] do
            for j in ['A'..'Z'] do
            let lname = (sprintf "%s%s" (string i) (string j))
            printfn "Enrolling by last name.....%s" lname
            let tst = enroll comp lname //(string i)
            printfn "%s" tst
