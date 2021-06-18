import React from 'react';

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
                       Disabled
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

    return (

        <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
            <div className="uppercase
                 rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md
                 tracking-wide text-bgray-700 bg-bgray-300">{camname} </div>
            <div className="h-80 bg-gray-100">
                <media-stream-player
                    autoplay
                    format="RTP_H264"
                    hostname={hostname}/>
            </div>
        </div>
    );
}

export const VideoList = (props) => {

   let cams = props.available_cams

   let avail_cams = () => {

       if (cams.length === 0) {
           return (
               <div className="text-7xl m-auto text-gray-200">Cameras</div>
           )
       }

       let vid = (cam) => {
           if (cam.enabled) {
               return ( <AxVideo hostname={cam.ipaddress} camname={cam.name} /> )
           } else {
               return (<DisabledVideo camname={cam.name}/>)
           }
       }

       return cams.map(cam => {
            return ( <> {vid(cam)} </> )
       })

   };

    return (
        <div className="overflow-x-scroll flex bg-gray-50 pb-8 ml-4 min-h-[365px]">
            {avail_cams()}
        </div>
    )
}



