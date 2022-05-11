import { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";



const VideoSending = ({surveillant,socket,peer}) => {
    const videoRef = useRef();

    useEffect(()=>{
        navigator.mediaDevices.getDisplayMedia({video:true,audio:false})
        .then((mediaStream)=>{

            const video = videoRef.current;
            video.srcObject = mediaStream;
            video.play();

            const sp = new SimplePeer({
                initiator:true,
                trickle:false,
                stream:mediaStream
            });
            
            peer.current = sp;
            console.log(peer);

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
            
        })
    },[])

    return ( <video style={{width:"300px",height:"300px"}} ref={videoRef}></video> );
}
 
export default VideoSending;