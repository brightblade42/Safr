namespace EyemetricFR.TPass.Types

open System
open Thoth.Json
open Thoth.Json.Net
open EyemetricFR.Paravision.Types.Identification

type CompID =  string
type IDOrName = string  //a code or a name fragment for TPAss to use as a look up.
type PVID =  string //TODO: should really be a proper GUID
type CCode = CCode of string //perhaps an int
type SearchType = string
type SearchReq = IDOrName * SearchType * CompID
type Credential = | UserPass of (string * string)

type LoginCred =
    {
        user: string
        password: string
    }

    static member Decoder: Decoder<LoginCred> =
        Decode.object (fun get -> {
            user  = get.Required.At ["user"]  Decode.string
            password  = get.Required.At ["password"]  Decode.string
        })

    static member from json = Decode.fromString LoginCred.Decoder json

type AuthToken = string

type JWToken =
    {
        name: string
        role: string
        ccode: string
        exp: bigint
        iss: string
        aud: string
    }
     static member Decoder: Decoder<JWToken> =
        Decode.object (fun get -> {
            name  = get.Required.At ["Name"]  Decode.string
            role  = get.Required.At ["Role"]  Decode.string
            ccode = get.Required.At ["CCode"] Decode.string
            exp   = get.Required.At ["exp"]   Decode.bigint
            iss   = get.Required.At ["iss"]   Decode.string
            aud   = get.Required.At ["aud"]   Decode.string

    })

    static member from json = Decode.fromString JWToken.Decoder json

type TokenResponse =
    { token: string }

    static member Decoder: Decoder<TokenResponse> =
        Decode.object (fun get -> {
            token = get.Required.At ["token"] Decode.string
        })

    static member from json = Decode.fromString TokenResponse.Decoder json

type SearchKind = Student | All
type SearchTerm = SearchTerm of string

type EditProfileRequest =
    {
    ccode: bigint
    clntTid: int  //Visitor client type (required)
    sttsId: int //-- Active status (required)
    fName: String //-- First name (required)
    lName: string // Last name (required)
    //base64Image: string // base64string of the photo. This is optional
    //-- Below are the address information which are all optional
    //typ: string
    //street1: string
    //city: string
    //state: string
    //zipcode: string
    }
    static member Decoder: Decoder<EditProfileRequest> =
      Decode.object (fun get -> {
          ccode    = get.Required.At ["ccode"]     Decode.bigint
          clntTid    = get.Required.At ["clntTid"]     Decode.int
          sttsId     = get.Required.At [ "sttsId" ]    Decode.int
          fName      = get.Optional.At [ "fName" ]     Decode.string  |> Option.defaultValue ""
          lName      = get.Optional.At [ "lName" ]     Decode.string  |> Option.defaultValue ""
          //base64Image = get.Optional.At ["base64Image"] Decode.string |> Option.defaultValue ""
          //typ         = get.Required.At ["type"] Decode.string
          //street1     =  get.Optional.At ["street1"] Decode.string |> Option.defaultValue ""
          //city        =  get.Optional.At ["city"] Decode.string |> Option.defaultValue ""
          //state       = get.Optional.At ["state"] Decode.string |> Option.defaultValue ""
          //zipcode     = get.Optional.At ["zipcode"] Decode.string |> Option.defaultValue ""
    })

    static member from json = Decode.fromString EditProfileRequest.Decoder json


    static member to_str (req: EditProfileRequest) =
     let enc = Encode.object [
         "ccode",        Encode.bigint      req.ccode
         "clntTid",        Encode.int      req.clntTid
         "sttsId",         Encode.int      req.sttsId
         "fName",          Encode.string   req.fName
         "lName",          Encode.string   req.lName
     ]
     enc.ToString()


type NewClient =
    {
    clntTid: int  //Visitor client type (required)
    sttsId: int //-- Active status (required)
    fName: String //-- First name (required)
    lName: string // Last name (required)
    base64Image: string // base64string of the photo. This is optional
    //-- Below are the address information which are all optional
    typ: string
    street1: string
    city: string
    state: string
    zipcode: string
    }
    static member Decoder: Decoder<NewClient> =
      Decode.object (fun get -> {
          clntTid    = get.Required.At ["clntTid"]     Decode.int
          sttsId     = get.Required.At [ "sttsId" ]    Decode.int
          fName      = get.Optional.At [ "fName" ]     Decode.string  |> Option.defaultValue ""
          lName      = get.Optional.At [ "lName" ]     Decode.string  |> Option.defaultValue ""
          base64Image = get.Optional.At ["base64Image"] Decode.string |> Option.defaultValue ""
          typ         = get.Required.At ["type"] Decode.string
          street1     =  get.Optional.At ["street1"] Decode.string |> Option.defaultValue ""
          city        =  get.Optional.At ["city"] Decode.string |> Option.defaultValue ""
          state       = get.Optional.At ["state"] Decode.string |> Option.defaultValue ""
          zipcode     = get.Optional.At ["zipcode"] Decode.string |> Option.defaultValue ""
    })

    static member from json = Decode.fromString NewClient.Decoder json
    //static member to_str (new_client: NewClient) = Encode.Auto.toString(4, new_client)

    static member to_str (new_client: NewClient) =
     let enc = Encode.object [
         "clntTid",        Encode.int   new_client.clntTid
         "sttsId",         Encode.int      new_client.sttsId
         "fName",          Encode.string   new_client.fName
         "lName",          Encode.string   new_client.lName
         "base64Image",    Encode.string new_client.base64Image
         "type",           Encode.string new_client.typ
         "street1",        Encode.string new_client.street1
         "city",           Encode.string new_client.city
         "state",          Encode.string new_client.state
         "zipcode",        Encode.string new_client.zipcode
     ]
     enc.ToString()

type NewClientResponse =
    {
    ccode: int
    clntTid: int  //Visitor client type (required)
    sttsId: int //-- Active status (required)
    fName: String //-- First name (required)
    lName: string // Last name (required)
    base64Image: string // base64string of the photo. This is optional
    //-- Below are the address information which are all optional
    typ: string
    street1: string
    city: string
    state: string
    zipcode: string
    amPkId: int
    aptmnId: int
    photoFilename: string
    }
    static member Decoder: Decoder<NewClientResponse> =
      Decode.object (fun get -> {
          ccode    = get.Required.At ["ccode"]     Decode.int
          clntTid    = get.Required.At ["clntTid"]     Decode.int
          sttsId     = get.Required.At [ "sttsId" ]    Decode.int
          fName      = get.Optional.At [ "fName" ]     Decode.string  |> Option.defaultValue ""
          lName      = get.Optional.At [ "lName" ]     Decode.string  |> Option.defaultValue ""
          base64Image = get.Optional.At ["base64Image"] Decode.string |> Option.defaultValue ""
          typ         = get.Required.At ["type"] Decode.string
          street1     =  get.Optional.At ["street1"] Decode.string |> Option.defaultValue ""
          city        =  get.Optional.At ["city"] Decode.string |> Option.defaultValue ""
          state       = get.Optional.At ["state"] Decode.string |> Option.defaultValue ""
          zipcode     = get.Optional.At ["zipcode"] Decode.string |> Option.defaultValue ""
          amPkId    = get.Required.At ["amPkId"]     Decode.int
          aptmnId    = get.Required.At ["aptmnId"]     Decode.int
          photoFilename     = get.Required.At [ "photoFilename" ]  Decode.string
    })

    static member from json = Decode.fromString NewClientResponse.Decoder json
    //static member to_str (new_client: NewClient) = Encode.Auto.toString(4, new_client)

type EmployeeOrUser =
        {
            ccode: int
            compId: int
            clntTid: int
            sttsId: int
            idnumber: string
            lName: string
            fName: string
            mName: string
            name: string
            typ: string
            status: string
            address: string
            street1: string
            street2: string
            city: string
            zipcode: string
            cntryIso: string
            state: string
            company: string
            imgUrl: string
            imageFile: string
            amPkId: int
            aptmnId: int

        }
        static member Decoder: Decoder<EmployeeOrUser> =
          Decode.object (fun get -> {
              ccode      = get.Required.At ["ccode"]       Decode.int
              compId     = get.Optional.At ["compId"]      Decode.int     |> Option.defaultValue -1
              clntTid    = get.Optional.At ["clntTid"]     Decode.int     |> Option.defaultValue -1
              sttsId     = get.Optional.At [ "sttsId" ]    Decode.int     |> Option.defaultValue -1
              idnumber   = get.Optional.At [ "idnumber" ]  Decode.string  |> Option.defaultValue ""
              lName      = get.Optional.At [ "lName" ]     Decode.string  |> Option.defaultValue ""
              fName      = get.Optional.At [ "fName" ]     Decode.string  |> Option.defaultValue ""
              mName      = get.Optional.At [ "mName" ]     Decode.string  |> Option.defaultValue ""
              name       = get.Required.At [ "name" ]      Decode.string
              typ        = get.Required.At [ "type" ]      Decode.string
              status     = get.Optional.At [ "status" ]    Decode.string  |> Option.defaultValue ""
              address    = get.Optional.At [ "address" ]   Decode.string  |> Option.defaultValue ""
              street1    = get.Optional.At [ "street1" ]   Decode.string  |> Option.defaultValue ""
              street2    = get.Optional.At [ "street2" ]   Decode.string  |> Option.defaultValue ""
              city       = get.Optional.At [ "city" ]      Decode.string  |> Option.defaultValue ""
              zipcode    = get.Optional.At [ "zipcode" ]   Decode.string  |> Option.defaultValue ""
              cntryIso   = get.Optional.At [ "cntryIso" ]  Decode.string  |> Option.defaultValue ""
              state      = get.Optional.At [ "state" ]     Decode.string  |> Option.defaultValue ""
              company    = get.Optional.At [ "company" ]   Decode.string  |> Option.defaultValue ""
              imgUrl     = get.Optional.At [ "imgUrl" ]    Decode.string  |> Option.defaultValue ""
              imageFile  = get.Optional.At [ "imageFile" ] Decode.string  |> Option.defaultValue ""
              amPkId     = get.Optional.At [ "amPkId" ]    Decode.int     |> Option.defaultValue -1
              aptmnId    = get.Optional.At [ "aptmnId" ]   Decode.int     |> Option.defaultValue -1

          })

        static member from json = Decode.fromString EmployeeOrUser.Decoder json

type Visitor =
    {
        ccode: int
        clntTid: int
        sttsId: int
        lName: string
        fName: string
        name: string
        typ: string
        status: string
        address: string
        cntryIso: string
        state: string
        imgUrl: string
        imageFile: string
        amPkId: int
        aptmnId: int
    }
    static member Decoder: Decoder<Visitor> =
      Decode.object (fun get -> {
          ccode     = get.Required.At ["ccode"]       Decode.int
          clntTid   = get.Required.At ["clntTid"]     Decode.int
          sttsId    = get.Required.At [ "sttsId" ]    Decode.int
          lName     = get.Required.At [ "lName" ]     Decode.string
          fName     = get.Required.At [ "fName" ]     Decode.string
          name      = get.Required.At [ "name" ]      Decode.string
          typ       = get.Required.At [ "type" ]      Decode.string
          status    = get.Required.At [ "status" ]    Decode.string
          address   = get.Optional.At [ "address" ]   Decode.string |> Option.defaultValue ""
          cntryIso  = get.Optional.At [ "cntryIso" ]  Decode.string |> Option.defaultValue ""
          state     = get.Optional.At [ "state" ]     Decode.string |> Option.defaultValue ""
          imgUrl    = get.Optional.At [ "imgUrl" ]    Decode.string |> Option.defaultValue ""
          imageFile = get.Optional.At [ "imageFile" ] Decode.string |> Option.defaultValue ""
          amPkId    = get.Optional.At [ "amPkId" ]    Decode.int    |> Option.defaultValue -1
          aptmnId   = get.Optional.At [ "aptmnId" ]   Decode.int    |> Option.defaultValue -1

          })


    static member from json = Decode.fromString Visitor.Decoder json

type Student =
  {
      compId      :int
      sndCompId   :int
      ccode       :int
      clntTid     :int
      sttsId      :int
      actId       :int
      idnumber    :string
      proxCardId  :string
      lName       :string
      fName       :string
      mName       :string
      name        :string
      bdate       :DateTime
      typ         :string
      status      :string
      remarks     :string
      canUseKiosk :bool
      address     :string
      street1     :string
      city        :string
      zipcode     :string
      cntryIso    :string
      state       :string
      company     :string
      imgUrl      :string
      imageFile   :string
      grade       :string
      healthFlag  :bool
      amPkId      :int
      aptmnId     :int
  }
  static member Decoder: Decoder<Student> =
       Decode.object ( fun get -> {
         compId      = get.Optional.At [ "compId" ]        Decode.int        |> Option.defaultValue -1
         sndCompId   = get.Optional.At [ "sndCompId" ]     Decode.int        |> Option.defaultValue -1
         ccode       = get.Required.At [ "ccode" ]         Decode.int
         clntTid     = get.Required.At [ "clntTid" ]       Decode.int
         sttsId      = get.Required.At [ "sttsId" ]        Decode.int
         actId       = get.Optional.At [ "actId" ]         Decode.int        |> Option.defaultValue -1
         idnumber    = get.Optional.At [ "idnumber" ]      Decode.string     |> Option.defaultValue ""
         proxCardId  = get.Optional.At [ "proxCardId" ]    Decode.string     |> Option.defaultValue ""
         lName       = get.Required.At [ "lName" ]         Decode.string
         fName       = get.Required.At [ "fName" ]         Decode.string
         mName       = get.Optional.At [ "mName" ]         Decode.string     |> Option.defaultValue ""
         name        = get.Required.At [ "name" ]          Decode.string
         bdate       = get.Optional.At ["bdate"]           Decode.datetime   |> Option.defaultValue DateTime.Now
         typ         = get.Required.At [ "type" ]          Decode.string
         status      = get.Optional.At [ "status" ]        Decode.string     |> Option.defaultValue ""
         remarks     = get.Optional.At [ "remarks" ]       Decode.string     |> Option.defaultValue ""
         canUseKiosk = get.Optional.At [ "canUseKiosk" ]   Decode.bool       |> Option.defaultValue false
         address     = get.Optional.At [ "address" ]       Decode.string     |> Option.defaultValue ""
         street1     = get.Optional.At [ "street1" ]       Decode.string     |> Option.defaultValue ""
         city        = get.Optional.At [ "city" ]          Decode.string     |> Option.defaultValue ""
         zipcode     = get.Optional.At [ "zipcode" ]       Decode.string     |> Option.defaultValue ""
         cntryIso    = get.Optional.At [ "cntryIso" ]      Decode.string     |> Option.defaultValue ""
         state       = get.Optional.At [ "state" ]         Decode.string     |> Option.defaultValue ""
         company     = get.Optional.At [ "company" ]       Decode.string     |> Option.defaultValue ""
         imgUrl      = get.Optional.At [ "imgUrl" ]        Decode.string     |> Option.defaultValue ""
         imageFile   = get.Optional.At [ "imageFile" ]     Decode.string     |> Option.defaultValue ""
         grade       = get.Optional.At [ "grade" ]         Decode.string     |> Option.defaultValue ""
         healthFlag  = get.Optional.At [ "healthFlag" ]    Decode.bool       |> Option.defaultValue false
         amPkId      = get.Optional.At [ "amPkId" ]        Decode.int        |> Option.defaultValue -1
         aptmnId     = get.Optional.At [ "aptmnId" ]       Decode.int        |> Option.defaultValue -1

       })
  static member from json = Decode.fromString Student.Decoder json

type TPassClient =

    | Student of Student
    | Visitor of Visitor
    | EmployeeOrUser of EmployeeOrUser

    static member to_str tpass_client =
        match tpass_client with
        | Student s -> Encode.Auto.toString(4, s)
        | Visitor v -> Encode.Auto.toString(4, v)
        | EmployeeOrUser emp -> Encode.Auto.toString(4, emp)

    static member image_url tpass_client =
        match tpass_client with
        | Student s -> s.imgUrl
        | Visitor v -> v.imgUrl
        | EmployeeOrUser emp -> emp.imgUrl


    static member status tpass_client =
        match tpass_client with
        | Student s -> s.status
        | Visitor v -> v.status
        | EmployeeOrUser emp -> emp.status

    static member ccode tpass_client =
        match tpass_client with
        | Student s -> s.ccode
        | Visitor v -> v.ccode
        | EmployeeOrUser emp -> emp.ccode

type TPassClientWithImage = {
      client: TPassClient
      image: byte array option
}

type CheckInRecord =
   {
     pkid: int
     ccode: bigint
     compId: int
     flag: string
     date: DateTime
     timeIn: DateTime
   }

   static member create(pkid: int, ccode: bigint, compId: int, flag: string, date: DateTime, timeIn: DateTime) =
       { pkid=pkid; ccode=ccode; compId=compId; flag=flag; date=date; timeIn=timeIn }

   static member Decoder: Decoder<CheckInRecord> =
     Decode.object ( fun get -> {
       pkid   = get.Required.At ["pkid"]   Decode.int
       ccode  = get.Required.At ["ccode"]  Decode.bigint
       compId = get.Required.At ["compId"] Decode.int
       flag   = get.Required.At ["flag"]   Decode.string
       date   = get.Required.At ["date"]   Decode.datetime
       timeIn = get.Required.At ["timeIn"] Decode.datetime
     })

   static member from json = Decode.fromString CheckInRecord.Decoder json

   static member to_str checkin_rec =
     let enc =  Encode.object [
          "pkid",   Encode.int      checkin_rec.pkid
          "compId", Encode.int      checkin_rec.compId
          "ccode",  Encode.bigint   checkin_rec.ccode
          "flag",   Encode.string   checkin_rec.flag
          "date",   Encode.datetime checkin_rec.date
          "timeIn", Encode.datetime checkin_rec.timeIn
     ]
     enc.ToString()


//currently exactly the same as CheckInRecord
type CheckOutRecord =
   {
     pkid: int
     ccode: bigint
     compId: int
     flag: string
     date: DateTime
     timeOut: DateTime
   }
   static member create(pkid: int, ccode: bigint, compId: int, flag: string, date: DateTime, timeOut: DateTime) =
       { pkid=pkid; ccode=ccode; compId=compId; flag=flag; date=date; timeOut=timeOut }

   static member Decoder: Decoder<CheckOutRecord> =
     Decode.object ( fun get -> {
        pkid    = get.Required.At ["pkid"]    Decode.int
        ccode   = get.Required.At ["ccode"]   Decode.bigint
        compId  = get.Required.At ["compId"]  Decode.int
        flag    = get.Required.At ["flag"]    Decode.string
        date    = get.Required.At ["date"]    Decode.datetime
        timeOut = get.Required.At ["timeOut"] Decode.datetime
     })

   static member from json = Decode.fromString CheckOutRecord.Decoder json

   static member to_str checkout =
     let enc = Encode.object [
         "pkid",    Encode.int      checkout.pkid
         "compId",  Encode.int      checkout.compId
         "ccode",   Encode.bigint   checkout.ccode
         "flag",    Encode.string   checkout.flag
         "date",    Encode.datetime checkout.date
         "timeOut", Encode.datetime checkout.timeOut
     ]
     enc.ToString()

type TPassResult<'a> =
   | Success  of 'a
   | DownloadError of Exception  //TODO: Make more specific exception. Expect Http related exceptions
   | ConnectionError of Exception //TODO: Make more specific exception
   | InvalidTokenError
   | NotCheckedInError
   | PVNotRegisteredError of string
   | ClientNotFound of string
   | JSonParseError //sometimes we get junk json or no json...
   | TPassError of Exception //a generic TPass error. kind of a place holder atm.


  type EnrolledIdentity = {
        id: string
        pv_img: byte []
  }

//all the data we need to record a local enrollment
  type EnrollmentInfo = {
      identity: Identity //from paravison
      face: FaceImage
      tpass_client: TPassClient option
      general_info: string option //enrollment not necessarily generated from known tpass data.
  }


  type RecognizedItem = {
      id: string
      confidence: float
      bounding_box: BBox
      tpass_client: TPassClient
  }
