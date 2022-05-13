import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";



const VideoSending = ({surveillant,socket,setPeer,setVideoState}) => {

    const videoRef = useRef();
    const recordRef = useRef();
    const [videoStarted,setVideoStarted] = useState(false);
    const [recordStarted,setRecordStarted] = useState(false);

    const startWebCamStream = ()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:false})
        .then(mediaStream => {
            console.log("got webCam Stream");
            const video = videoRef.current;
            video.srcObject = mediaStream;
            video.play();
            setVideoState(videoRef);
            setVideoStarted(true);
        })
    }

    const startScreenStream = ()=>{
        navigator.mediaDevices.getDisplayMedia({video:true,audio:false})
        .then(mediaStream => {
            console.log("got Screen Stream")
            const video = recordRef.current;
            video.srcObject = mediaStream;
            video.play();
            setRecordStarted(true);
        })
    }

    const setupPeerConnection = ()=>{

        console.log("setting up peer");
        const webCamStream = videoRef.current.srcObject;
        const screenRecordStream = recordRef.current.srcObject;
        
        const sp = new SimplePeer({
            initiator:true,
            trickle:false,
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
            streams:[webCamStream,screenRecordStream]
        });
        
        console.log(webCamStream);
        console.log(screenRecordStream);

        sp.on("signal",(data)=>{
            console.log("signaling");
            socket.send(JSON.stringify({
                type:"signal",
                payload:data,
                to:surveillant
            }))
        })

        sp.on("connect",()=>{
            console.log("connected");
        })

        sp.on("close",()=>{
            console.log("on close event for peer")
        })
        console.log(sp)
        setPeer(sp);

    }

    useEffect(()=>{
        startScreenStream();   
        startWebCamStream();
    },[])

    useEffect(()=>{
        if(recordStarted && videoStarted){
            setupPeerConnection();
        }
    },[videoStarted,recordStarted])

    return ( 
        <>
            <video style={{width:"300px",height:"300px"}} ref={videoRef}></video> 
            <video style={{width:"300px",height:"300px"}} ref={recordRef}></video> 
        </>
    );
}
 
export default VideoSending;