import React from 'react';



export function LineupPage (props) {

    const [img1_data, set_img1_data] = React.useState(undefined);
    const [img1_file, set_img1_file] = React.useState(undefined); //this may go away.

    function create_image (im) {
        console.log("loading image");
        console.log(im);
        set_img1_file(im);
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            set_img1_data(reader.result);
        }, false);

        if (im) {
            reader.readAsDataURL(im);
        }
    }
    return (

    <div className="grid  grid-rows-2 grid-cols-2 ">
        <div className="flex border min-h-[400px]">
            <div className="ml-2">
                <input type="file" accept="image/*"
                       onChange={(e) => create_image(e.target.files?.item(0))} />
                <div className="mt-4">
                    {img1_data &&
                    <img src={img1_data} />
                    }
                </div>
                <button className="btn-light-indigo">Analyze</button>
            </div>
        </div>
        <div className="border">
            <div className="text-center justify-center">Cropped image</div>
        </div>
        <div className="col-span-2 bg-bgray-100">
             <div className="mt-24 transition md:text-4xl lg:text-7xl text-green-800 opacity-20 text-center  justify-center">Lineup</div>

        </div>
    </div>
    )
}