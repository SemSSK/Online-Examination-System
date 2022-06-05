import React,{useState, useEffect,useRef} from "react";
import LocalVideoContainer from "./LocalVideoContainer"
import CircularProgress from '@mui/material/CircularProgress';
import './GetReady.css';


export const peers = {};

const GetReady = ({stream , setStream, readyToJoin, setReadyToJoin,surveillant,socket,etudiant,sessionExamen}) => {

    // const[mediaReady,setMediaReady]= useState(false)

    const videoRef = useRef();
    const recordRef = useRef();
    const [recordState,setRecordState] = useState(null);
    const [videoState,setVideoState] = useState(null);
    const [videoStarted,setVideoStarted] = useState(false);
    const [recordStarted,setRecordStarted] = useState(false);
    const [timeToAddTrack,setTimeToAddTrack] = useState(false);
    // const [socket , setSocket] = useState(null);
    const stopVideo = (video)=>{
        video.srcObject.getTracks().forEach((track) => {
            track.stop();
        });
    }

    // const startWebCamStream =  () => {
    //
    //     const constraints = {video: true, audio: false};
    //     getUserMedia(constraints)
    //     .then( (mediaStream) => {
    //         getLocalMediaStream(mediaStream)
    //
    //     }).then(()=> setVideoStarted(true))
    // }

    // async function getLocalMediaStream(mediaStream){
    //     console.log("got webCam Stream");
    //     if(!mediaStream) {
    //         console.log("nullllllll")
    //         setVideoState(null);
    //         return;
    //     }
    //     if(videoState){
    //         videoState.getTracks().forEach( (track) => track.stop());
    //     }
    //     setVideoState(mediaStream);
    //     videoRef.current.pause();
    //     videoRef.current.srcObject = mediaStream;
    //     videoRef.current.muted =true;
    //     await videoRef.current.play();
    // }

    const startScreenStream = ()=>{
        navigator.mediaDevices.getDisplayMedia({video:true,audio:false})
        .then(mediaStream => {
            console.log("got Screen Stream")
            setRecordState(mediaStream)
            // setRecordStarted(true);
        })
    }

    window.onbeforeunload = function (e) {
        stop();
    };

    useEffect(()=>{
        if(stream) {
            setVideoState(stream);
             setVideoStarted(true)
        }
    },[stream])
    useEffect(()=>{
        if(recordState) {
            setRecordStarted(true)
        }
    },[recordState])

    useEffect(()=>{
        if(!peers[surveillant]){
            peers[surveillant] = {}
        }
        if(socket && videoStarted && recordStarted && readyToJoin ){
            socket.addEventListener('message',messageHandler);
            sendNegotiateMessage();
        }
    },[socket,videoStarted,recordStarted,readyToJoin])

    useEffect(()=>{
       if(readyToJoin)
            startScreenStream();
    },[readyToJoin])

    useEffect(()=>{
        console.log("timeToAddTrack ",timeToAddTrack);
        console.log("videoState ",videoState)
        if(timeToAddTrack && videoState && recordState && readyToJoin)
            getMedia();
    },[videoState,recordState,timeToAddTrack,readyToJoin])

    function getMedia(){
        console.log("peers[surveillant]?.pc ",peers[surveillant]?.pc);
        console.log("videoState ",videoState);
        console.log("!peers[surveillant].sender ",!peers[surveillant].sender);
        console.log("timeToAddTrack ",timeToAddTrack)
        if( peers[surveillant]?.pc && videoState && recordState && timeToAddTrack){
            // console.log("adding track");
            videoState.getTracks().forEach( (track) =>
                    peers[surveillant].pc.addTrack(track, videoState) );

            recordState.getTracks().forEach( (track) =>
                    peers[surveillant].pc.addTrack(track, recordState) );

            peers[surveillant].myCameraStream  = videoState;
            peers[surveillant].myScreenStream  = recordState;

        }
    }



    //Utility methods


    function messageHandler (msg) {
        let message = JSON.parse(msg.data);
        let from = message.from;
        console.log("message received from : "+from.userId+"  type of it: "+message.type+" contenu: "+message);
        switch (message.type) {

            case 'negotiate': {
                if( message.sessionExamen.sessionId === sessionExamen.sessionId && from.userId ===  surveillant.userId) {
                    createOfferMessage();
                }
                break;
            }


            case 'offer': {
                if(from.userId === surveillant.userId)
                    handleOfferMessage(message);
                break;
            }

            case "answer": {
                if(from.userId === surveillant.userId &&  peers[surveillant].pc )
                    handleAnswerMessage(message);
                break;
            }

            case "ice": {
                if(from.userId === surveillant.userId &&  peers[surveillant].pc)
                    handleNewICECandidateMessage(message);
                break;
            }

            default: {
                return;
            }

        }
    }

    function createOfferMessage() {
        createPeerConnection();
        setTimeToAddTrack(true);
        // getMedia();

        handleNegotiationNeededEvent();



    }

    function createPeerConnection() {
        if(peers[surveillant].pc)
            stop();


        // peer connection configuration (STUN & TURN srever configuration)
        const peerConnectionConfig = {
            'iceServers': [
                {'urls': 'stun:stun.l.google.com:19302'},
                {'urls': 'stun:stun.gmx.net:3478'},
                {'urls': 'stun:stun.stunprotocol.org:3478'}
            ]
        };


        // console.log('stream is null? --> ',stream);
        peers[surveillant].pc = new RTCPeerConnection(peerConnectionConfig);

        peers[surveillant].pc.oniceconnectionstatechange =  () => {
            console.log('peer connection ice state ', peers[surveillant].pc.iceConnectionState , surveillant);
        }


        peers[surveillant].pc.onsignalingstatechange = () => {

            switch (peers[surveillant].pc.signalingState) {

                case "stable":

                    if(!peers[surveillant].iceCandidate)
                        return;

                    let candidate = new RTCIceCandidate(peers[surveillant].iceCandidate);

                    if(candidate && peers[surveillant].pc.localDescription && peers[surveillant].pc.remoteDescription?.type)
                        peers[surveillant].pc.addIceCandidate(candidate)
                            .catch((e) => console.log('ICE Error ', e));

                    break;

                case "closed":
                    console.log('Signaling State: Closed');
                    break;

                default:
                    break;
            }
        }



        peers[surveillant].pc.onconnectionstatechange = (event) => {
            console.log('Peer connection ', peers[surveillant].pc.connectionState)
            switch(peers[surveillant].pc.connectionState) {
                case "connected":
                    console.log('Peer connection is in state: connected');

                    // setTimeToGetMedia(true);
                    break;
                case "disconnected":
                case "failed":
                    console.log('Peer connection ', peers[surveillant].pc.connectionState , "event##", event);
                    // resetConnection();
                    break;
                case "closed":
                    console.log('Peer connection closed')
                    break;
                default:
                    break;
            }
        }

        peers[surveillant].pc.onicegatheringstatechange = () => {
            switch(peers[surveillant].pc.iceGatheringState) {
                case "new":
                    console.log('Ice New')
                    break;
                case "gathering":
                    console.log('Ice Gathering')
                    break;
                case "complete":
                    console.log('Ice  Complete');
                    break;
                default:
                    break;
            }
        };

        peers[surveillant].pc.onnegotiationneeded = handleNegotiationNeededEvent;

        peers[surveillant].pc.onicecandidate = handleICECandidateEvent;
        console.log(" peer connection created")

    }

    function handleICECandidateEvent(event) {
        if (event.candidate) {
            sendToServer({
                from: etudiant,
                type: 'ice',
                candidate: event.candidate,
                to: surveillant,
                sessionExamen : sessionExamen
            });
        }
    }

    function handleNegotiationNeededEvent() {
        console.log("negotiation needed let's create an offer")
        if(peers[surveillant].pc.signalingState !== 'stable' ) return ;

        peers[surveillant].pc.createOffer(
            { offerToReceiveAudio: true, offerToReceiveVideo: true }
        )
            .then((offer) => {
                return peers[surveillant].pc.setLocalDescription(offer);
            })
            .then(() => {
                sendToServer({
                    from: etudiant,
                    type: 'offer',
                    sdp: peers[surveillant].pc.localDescription,
                    to: surveillant,
                    sessionExamen: sessionExamen
                });
                console.log("SDP: ",peers[surveillant].pc.localDescription.sdp)
            })
            .catch((e) => {
                console.log('Error ', e);
                // resetConnection();

            });

    }

    function handleOfferMessage(message) {

        createPeerConnection();
        if(peers[surveillant].pc.signalingState !== 'stable' ) return ;

        if (message.sdp !== null) {
            peers[surveillant].pc.setRemoteDescription(message.sdp)
                .then(function () {
                    return peers[surveillant].pc.createAnswer(
                        {offerToReceiveAudio: true, offerToReceiveVideo: true}
                    );
                })
                .then(function (answer) {
                    return peers[surveillant].pc.setLocalDescription(answer);
                })
                .then(function () {
                    sendToServer({
                        from: etudiant,
                        type: 'answer',
                        sdp: peers[surveillant].pc.localDescription,
                        to: surveillant,
                        sessionExamen: sessionExamen
                    });

                })
                .catch((e) => {
                    console.log('Error handleOfferMessage', e);
                    // resetConnection();
                })
        }


    }

    function handleAnswerMessage(message) {
        peers[surveillant].pc.setRemoteDescription(message.sdp)
            .catch((e) => {
                console.log('Error ', e);
                // resetConnection()
            });

    }

    function sendNegotiateMessage()  {
        console.log("sending negotiate message");
        sendToServer({
            from: etudiant,
            type: 'negotiate',
            to: surveillant,
            sessionExamen: sessionExamen
        });

    }

    function handleNewICECandidateMessage(message) {
        if(peers[surveillant].pc) {
            if( peers[surveillant].pc.signalingState === 'stable') {
                let candidate = new RTCIceCandidate(message.candidate);
                if(candidate && peers[surveillant].pc.localDescription && peers[surveillant].pc.remoteDescription?.type )
                    peers[surveillant].pc.addIceCandidate(candidate)
                        .catch((e) => console.log('ICE Error ', e));

            } else {
                peers[surveillant].iceCandidate = message.candidate;
            }
        }
    }

    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);
        if(socket.readyState === WebSocket.OPEN ){
            console.log("socket opened")
            socket.send(msgJSON);
        }
    }

    function stop() {
        if (peers[surveillant].pc) {
            console.log('disconnect all our event listeners')
            // disconnecting all the event listeners
            peers[surveillant].pc.onicecandidate = null;
            peers[surveillant].pc.ontrack = null;
            peers[surveillant].pc.onnegotiationneeded = null;
            peers[surveillant].pc.oniceconnectionstatechange = null;
            peers[surveillant].pc.onsignalingstatechange = null;
            peers[surveillant].pc.onicegatheringstatechange = null;
            peers[surveillant].pc.onnotificationneeded = null;
            peers[surveillant].pc.onremovetrack = null;
            // Stopping the videos
            if (videoRef.current || videoRef.current?.srcObject) {
                if(videoRef.current.srcObject && videoRef.current.srcObject.getTracks() !== null)
                    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }

            // peers[surveillant].pc.removeTrack(peers[surveillant].sender);
            // close the peer connection

            peers[surveillant].pc.close();
            peers[surveillant].pc = null;

            if(peers[surveillant].iceCandidate) peers[surveillant].iceCandidate = null;
            // setMyPeerConnection(null);
        }
    }




    return (
        <div className="getReady">
            <div className="localCamera">
                <LocalVideoContainer etudiant={etudiant} stream={stream} setStream={setStream}  width={490} height={300} />
            </div>

            {
                readyToJoin  ?
                    <div className="RUReady">
                        <div className="readyTitle">
                            <h1>Waiting to Join !</h1>
                        </div>
                        <CircularProgress />
                        <div className="readyPrgph">
                            <p>
                                Wait for the proctor to accept you in this exam session  
                            </p>
                        </div>
                        
                    </div>
                :
                    <div className="RUReady">
                        <div className="readyTitle">
                            <h1>Ready to Join ?</h1>
                        </div>
                        <div className="getReadyButton">
                            <button className="button-85"
                                onClick={()=>setReadyToJoin(!readyToJoin)}
                            >
                                Join Now
                            </button>
                        </div> 
                    </div>
            }
        </div>

    )
}



export default GetReady;





