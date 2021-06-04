import React from 'react';

export const AVideo = ({ hostname,camname,doit }) => {

    let [count, setCount] = React.useState(1)

    React.useEffect(() => {
        doit();
    })

    return (

       <div className="w-full max-w-lg flex-shrink-0 flex flex-col mr-1">
                <div className="uppercase
                 rounded-t-md py-1 text-center transform translate translate-y-4 font-bold mt-2 text-md
                 tracking-wide text-bgray-700 bg-bgray-300">{camname} {count}</div>
                <div className="h-80">
                    <media-stream-player
                        autoplay
                        format="RTP_H264"
                        hostname={hostname} />
                </div>
            </div>


    );

}
