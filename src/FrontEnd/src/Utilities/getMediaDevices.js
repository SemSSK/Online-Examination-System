
export const  getUserMedia = async ( {video, audio, width, height}) => {
    try {
        if(video) {
            video =  {width: {exact: width}, height: {exact: height}, facingMode: "user"}
        }
        return  await navigator.mediaDevices.getUserMedia({video , audio});

    }catch (e) {
        console.log(e, video, audio);
        return null;
    }
}

export const getDisplayMedia = async (video) => {
    try {
        let constraint = {
            audio: false,
            video: false
        };
        if(video) {
            console.log("true of course")
            constraint = {
                audio: false,
                video : {width: {exact: 400}, height: {exact: 400}, facingMode: "user"}
            }
        }
        return await navigator.mediaDevices.getDisplayMedia(constraint.video);
    }catch (e) {
        console.log(e);
        return null;
    }
}


