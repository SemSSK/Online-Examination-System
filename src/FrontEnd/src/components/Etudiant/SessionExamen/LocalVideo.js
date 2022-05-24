import React, {useEffect, useRef,useState} from "react";
import {getDisplayMedia, getUserMedia} from "../../../Utilities/getMediaDevices";
import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';
// // import BsCircle from '@mui/icons-material/Circle';
// import { BsCameraVideo, BsCameraVideoOff,BsFillCircleFill } from "react-icons/bs";
// import {GiCircle } from "react-icons/gi";
import{FcCollapse} from "react-icons/fc";

import "./LocalVideo.css"
// import { height } from "@mui/system";



const LocalVideo = ({ width, height, willCollapse,stream,setStream}) => {
    // const [anchorEl, setAnchorEl] =useState(null);
    // const open = Boolean(anchorEl);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // const options = ["Camera", "Screen Record"];
    
    const [micIsActive, setMicIsActive] = useState(true);
    const [camIsActive, setCamIsActive] = useState(true);
    // const micIcon = !micIsActive ? <MicOffIcon style={{ color: 'white' }} fontSize="medium"/> : <MicIcon style={{ color: 'white' }} fontSize="medium"/>;
    // const camIcon = !camIsActive ? <BsCameraVideoOff color='white' size="25"/> : <BsCameraVideo color='white' size="25"/>;
    // const circleMicIcon = !micIsActive ? <BsFillCircleFill  color='#c50000' size="50" /> : <GiCircle  color='white' size="50" />;
    // const circleCamIcon = !camIsActive ? <BsFillCircleFill  color='#c50000' size="50" /> : <GiCircle  color='white' size="50" />;
    const localVideoRef = useRef();
    const [isCollapsed,setIsCollapsed] = useState(false);
    let deviceSupport = {video : true, audio: true};

    useEffect(()=>{
        getSupportedDevices(  ({hasWebcam,hasMicrophone}) => {
            deviceSupport = { video: hasWebcam,  audio: hasMicrophone};
        });
    },[]);

    useEffect(() => {

        const {video , audio} = { video: camIsActive && deviceSupport.video,
                                  audio: micIsActive && deviceSupport.audio };
        console.log(video);
        getMedia(video, audio, width, height);

        if(stream ) {
            stream.getTracks().forEach( (track) => track.stop());
            setStream(null);
            localVideoRef.current.pause();
            localVideoRef.current.srcObject = null;
        }

    }, [micIsActive,camIsActive]);

    function getMedia(video, audio, width, height) {
        const mediaConstraints = {video , audio, width, height} ;


            getUserMedia(mediaConstraints)
                .then(getLocalMediaStream)


            // getDisplayMedia(true)
            //     .then(getLocalMediaStream)
            //     .finally(() => setMediaReady(true));


    }

    // function  changeConstraints ({video, audio}) {

    //     const constraints = {video: video, audio: audio};
    //     setMediaConstraints(constraints);

    // }

    async function getLocalMediaStream(mediaStream) {
        console.log("getting local media stream");

        if(!mediaStream) {
            setStream(null);
            return;
        }
        if(stream){
            stream.getTracks().forEach( (track) => track.stop());
        }

        if( localVideoRef.current) {
            console.log("id :", mediaStream.id);
            setStream(mediaStream);
            localVideoRef.current.pause();
            localVideoRef.current.srcObject = mediaStream;
            localVideoRef.current.muted =true;
            await  localVideoRef.current.play();
        }

    }

    function  getSupportedDevices  (callback) {
        let hasMicrophone = false;
        let hasSpeakers = false;
        let hasWebcam = false;

        navigator.mediaDevices.enumerateDevices().then(async function(devices){

            await devices.forEach((device) => {

                if (device.kind === 'audioinput') {
                    hasMicrophone = true;
                }

                if (device.kind === 'audiooutput') {
                    hasSpeakers = true;
                }

                if (device.kind === 'videoinput') {
                    hasWebcam = true;
                }
            });

            callback({hasWebcam, hasMicrophone});
        });


    }



    return (
        
        <div  className={isCollapsed ? "videoContainer videoIsCollapsed" : "videoContainer"}>
            <video  ref={localVideoRef}  />
            {
                willCollapse ? 
                               <div className={isCollapsed ? "collapseIconContainer iconCollapseActive" : "collapseIconContainer"}>
                                    <IconButton
                                        className={isCollapsed ? "collapseIcon" : "collapseIcon notCollapsed"}
                                        edge="end"
                                        color="inherit"
                                        aria-label="mode"
                                        onClick={() => setIsCollapsed(!isCollapsed)}
                                    >
                                        <FcCollapse color='black' size="50" />
                                    </IconButton> 
                                </div> 
                                    
                             : ''
            }
            {/* <div className="moreIcon">
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                    "aria-labelledby": "long-button"
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                    style: {
                        maxHeight: 126,
                        width: "30ch"
                    }
                    }}
                >
                    {options.map((option) => (
                    <MenuItem
                        key={option}
                        selected={option === "Pyxis"}
                        onClick={handleClose}
                    >
                        {option}
                    </MenuItem>
                    ))}
                </Menu>
            </div>
            <div className="cameraDashboard">
                <div className="circledIcons">
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="mode"
                    >
                        {circleMicIcon}
                    </IconButton> 

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="mode"
                        onClick={() => setMicIsActive(!micIsActive)}
                    >
                        {micIcon}
                    </IconButton>
                </div>

                <div className="circledIcons">
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="mode"
                    >
                        {circleCamIcon}
                    </IconButton> 

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="mode"
                        onClick={() => setCamIsActive(!camIsActive)}
                    >
                        {camIcon}
                    </IconButton> 
                </div>
                
                
            </div> */}
        </div>
       
    );
}


export default LocalVideo;