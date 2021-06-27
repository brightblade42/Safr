import React from 'react';
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";

export const DisabledVideo = ({camname}) => {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
               <span>{camname}</span>
               <div className="bg-gray-400 min-h-[288px]">
                   <span className="inline-block text-4xl text-gray-300 my-24">
                       Disabled
                   </span>
               </div>
            </div>
        </div>
    )
}

export const OfflineVideo = ({camname}) => {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
                <span>{camname}</span>
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
export const ConnectingVideo = ({camname, msg}) => {
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase rounded-t-md py-1 text-center
                            transform translate translate-y-4 font-bold mt-2
                            text-md tracking-wide text-bgray-700 bg-bgray-300">
                <span>{camname}</span>
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

export const AxVideo = ({ hostname,camname,doit }) => {

    React.useEffect(() => {
        console.log("we made it, baby");
    })

    // @ts-ignore
    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase
                 rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md
                 tracking-wide text-bgray-700 bg-bgray-300">{camname} </div>
            <div className="h-80 bg-gray-100">
                <media-stream-player
                    autoplay
                    format="RTP_H264"
                    hostname={hostname}
                />
            </div>
        </div>
    );
}


export const VideoList = (props) => {

   let app_state = props.model;
   let available_cams = props.available_cams;

   let avail_cams = () => {

       if (available_cams.length === 0) {
           return (
               <div className="text-7xl m-auto text-gray-200">Cameras</div>
           )
       }

       let vid = (cam) => {
           if (cam.enabled) {

               if (cam.streaming) {

                   if (app_state.StoppingAllStreams) {
                       return (<ConnectingVideo camname={cam.name} msg="Disconnecting.."/>)
                   }
                   return ( <AxVideo hostname={cam.ipaddress} camname={cam.name} /> )
               } else {
                   if (app_state.StartingAllStreams) {
                       return (<ConnectingVideo camname={cam.name} msg="Connecting.."/> )
                   }

                   return (<OfflineVideo camname={cam.name}/> )

               }

           } else {
               return (<DisabledVideo camname={cam.name}/>)
           }
       }

       return available_cams.map(cam => {
            return ( <> {vid(cam)} </> )
       })

   };

    return (
        <div className="overflow-x-scroll flex bg-gray-50 pb-8 px-1 min-h-[365px]">
            {avail_cams()}
        </div>
    )
}



