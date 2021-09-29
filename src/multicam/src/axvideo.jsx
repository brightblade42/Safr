import React from 'react';
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import {CheckIn, CheckOut} from "./heroicons";
const InOut = ({direction}) => ( direction ? <CheckIn/> : <CheckOut/> )

export function DisabledVideo({cam})  {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">

               <span>{cam.name}</span>
               <div className="bg-gray-400 min-h-[288px]">
                   <span className="inline-block text-4xl text-gray-300 my-24">
                       Disabled
                   </span>
               </div>
            </div>
        </div>
    )
}

export function OfflineVideo({cam}) {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
                <span>{cam.name}</span>
                <div className="bg-gray-400 min-h-[288px]">
                   <span className="inline-block text-4xl text-gray-300 my-24">
                       OFFLINE
                   </span>
                    {/*
                        <p className="-mt-20 text-gray-500">( check address )</p>
                      */
                    }
                </div>
            </div>
        </div>
    )
}
export function ConnectingVideo({cam, msg}) {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
                <span>{cam.name}</span>
                <div className="bg-gray-400 min-h-[288px]">
                   <span className="inline-block text-4xl text-yellow-300/60 my-24">
                       {msg}
                   </span>

                    <span className={`animate-spin  inline-block ml-2 text-2xl`}>
                            <FAIcon className="text-yellow-300/70" size="2x" icon={['fad','spinner-third']}  />
                    </span>
                </div>
            </div>
        </div>
    )
}
export function UpdatingVideo({cam, msg})  {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
                <span>{cam.name}</span>
                <div className="bg-gray-400 min-h-[288px]">
                   <span className="inline-block text-4xl text-yellow-300/60 my-24">
                       {msg}
                   </span>

                    <span className={`animate-spin  inline-block ml-2 text-2xl`}>
                            <FAIcon className="text-yellow-300/70" size="2x" icon={['fad','spinner-third']}  />
                    </span>
                </div>
            </div>
        </div>
    )
}

export function AxVideo({cam}) {

    // @ts-ignore
    // secure
    let secure = false;
    //secure={secure}
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">

            <div className="uppercase
                 rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md
                 tracking-wide text-bgray-700 bg-bgray-300">
                <div className="flex justify-center space-x-4">
                    <div>{cam.name}</div>
                    <InOut direction={cam.direction}/>
                </div>
            </div>
            <div className="h-80 bg-gray-100">
                <media-stream-player
                    autoplay
                    format="RTP_H264"
                    hostname={cam.ipaddress}
                />
            </div>
        </div>
    );
}


export function VideoList(props) {

   let app_state = props.state;
   console.log("==== prop aroni =====")
  // console.log(props)
   let available_cams =app_state.available_cameras;

   const avail_cams = () => {

       if (available_cams.length === 0) {
           return (
               <div className="text-7xl m-auto text-gray-200">Cameras</div>
           )
       }

       const create_video = (cam) => {
           //changed being made to camera, addreess, name, enabled, things like that.
           if (cam.updating) {
               return  <UpdatingVideo cam={cam} msg="Updating.." />
           }
           if (cam.enabled) {

               if (cam.streaming) {

                   if (app_state.stopping_all_streams) {
                       return (<ConnectingVideo cam={cam} msg="Disconnecting.."/>)
                   }
                   return ( <AxVideo cam={cam} /> )
               } else {
                   if (app_state.starting_all_streams) {
                       return (<ConnectingVideo cam={cam} msg="Connecting.."/> )
                   }

                   return (<OfflineVideo cam={cam}/> )

               }

           } else {
               return (<DisabledVideo cam={cam}/>)
           }


       }

       return available_cams.map(cam => {
            return ( <> {create_video(cam)} </> )
       })

   };



    return (
        <div className="overflow-x-scroll flex -ml-1 -mt-10 bg-gray-50 pb-0 px-1 min-h-[365px]">
            {avail_cams()}
        </div>
    )
}

/*

 */


