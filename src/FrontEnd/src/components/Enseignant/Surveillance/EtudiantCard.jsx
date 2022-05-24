import { Button, Card, CardContent, Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef ,useState} from "react";

export const peers = {};
const EtudiantCard = ({socket, ...props}) => {
    const [studentCamera, setStudentCamera] = useState(null);
    const etudiant = props.presence.etudiant;
    const videoRef = useRef();
    // const recordRef = useRef();
    window.onbeforeunload = function (e) {
        stop();
    };
    // useEffect(()=>{
        
    // },[studentCamera])

    useEffect( () => {
        console.log(props);
        if(!peers[props.presence.etudiant]){
            peers[props.presence.etudiant] = {}
        }
        if(socket){
            socket.addEventListener('message',messageHandler);
            sendNegotiateMessage();
        }
        console.log(props);

    },[socket]);

    //start creating peer connection with each student

     
    // let socketConnection;

    // function createSocketConnection() {
        
    //     if (window.location.protocol === 'http:')
    //         socketConnection = new WebSocket(`ws://localhost:8080/peer`);
    //     else
    //         socketConnection = new WebSocket(`wss://${window.location.host}/signal` );

    //     socketConnection.onopen = function () {

    //         console.log('Socket connection successful')
    //         setSocket(socketConnection);
    //     }

       

    //     // socketConnection.onclose = function() {
    //     //     history.push('/');
    //     // }

    //     socketConnection.onerror = function (event) {
    //         console.log('Socket connection error ', event);
    //     }

    // }

    // effect
    
    function messageHandler (msg) {
        let message = JSON.parse(msg.data);
        let from = message.from;
        let etudiant = props.presence.etudiant;
        console.log("message received from : "+from?.userId+" contenu: "+message+"  type of it: "+message.type);
        
        if(from){ 
            switch (message.type) {

            case 'negotiate': {
                if( message.sessionExamen.sessionId === props.session && from.userId ===  etudiant.userId) {
                    createOfferMessage();
                }
                break;
            }

            case 'reset': {
                // if(from === surveillant && message.to === etudiant && message.room === roomId) {
                //     // resetVideo();
                //     socketConnection.removeEventListener('message',messageHandler)
                // }
                // break;
            }

            case 'offer': {
                if(from.userId === etudiant.userId)
                    handleOfferMessage(message);
                break;
            }

            case "answer": {
                if(from.userId === etudiant.userId &&  peers[etudiant].pc )
                    handleAnswerMessage(message);
                break;
            }

            case "ice": {
                if(from.userId === etudiant.userId &&  peers[etudiant].pc)
                    handleNewICECandidateMessage(message);
                break;
            }

        

            default: {
                return;
            }

            }
        }
    }

    
    function createOfferMessage() {

        createPeerConnection();

        peers[props.presence.etudiant].pc.onnegotiationneeded = handleNegotiationNeededEvent;

        
    }

    function createPeerConnection() {
       
        navigator.mediaDevices.getUserMedia({ video: true })
        // peer connection configuration (STUN & TURN srever configuration)
        const peerConnectionConfig = { 
            'iceServers': [
                {'urls': 'stun:stun.l.google.com:19302'}, 
               {'urls': 'stun:stun.gmx.net:3478'},
               {'urls': 'stun:stun.stunprotocol.org:3478'}
           ]
       };
        // };
             
      
        peers[props.presence.etudiant].pc = new RTCPeerConnection(peerConnectionConfig);

        peers[props.presence.etudiant].pc.ontrack = handleTrackEvent;

        peers[props.presence.etudiant].pc.oniceconnectionstatechange =  () => {
            console.log('peer connection ice state ', peers[props.presence.etudiant].pc.iceConnectionState , props.presence.etudiant);
        }

        peers[props.presence.etudiant].pc.onsignalingstatechange = () => {

            switch (peers[props.presence.etudiant].pc.signalingState) {

                case "stable":

                    if(!peers[props.presence.etudiant].iceCandidate)
                        return;

                    let candidate = new RTCIceCandidate(peers[props.presence.etudiant].iceCandidate);

                    if(candidate && peers[props.presence.etudiant].pc.localDescription && peers[props.presence.etudiant].pc.remoteDescription?.type)
                        peers[props.presence.etudiant].pc.addIceCandidate(candidate)
                                            .catch((e) => console.log('ICE Error ', e));

                    break;

                case "closed":
                    console.log('Signaling State: Closed');
                    break;

                default:
                    break;
            }
        }

        peers[props.presence.etudiant].pc.onconnectionstatechange = (event) => {
            console.log('Peer connection ', peers[props.presence.etudiant].pc.connectionState)
            switch(peers[props.presence.etudiant].pc.connectionState) {
                case "connected":
                    console.log('Peer connection is in state: connected');
                    // setTimeToGetMedia(true);
                    break;
                case "disconnected":
                case "failed":
                    console.log('Peer connection ', peers[props.presence.etudiant].pc.connectionState , "event##", event);
                    
                    break;
                case "closed":
                    console.log('Peer connection closed')
                    break;
                default:
                    break;
            }
        }

        peers[props.presence.etudiant].pc.onicegatheringstatechange = () => {
            switch(peers[props.presence.etudiant].pc.iceGatheringState) {
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

        peers[props.presence.etudiant].pc.onnegotiationneeded = handleNegotiationNeededEvent;

        peers[props.presence.etudiant].pc.onicecandidate = handleICECandidateEvent;


        console.log("peer connection created");
       
        
        
    }

    function handleICECandidateEvent(event) {
        if (event.candidate) {
            sendToServer({
                from: etudiant,
                type: 'ice',
                candidate: event.candidate,
                to: props.presence.etudiant,
                sessionExamen : props.session
            });
        }
    }

    function handleNegotiationNeededEvent() {

        if(peers[props.presence.etudiant].pc.signalingState !== 'stable' ) return ;

        peers[props.presence.etudiant].pc.createOffer(
            { offerToReceiveAudio: true, offerToReceiveVideo: true }
        )
        .then((offer) => {
            return peers[props.presence.etudiant].pc.setLocalDescription(offer);
        })
        .then(() => {
            sendToServer({
                from:props.session.surveillant,
                type: 'offer',
                sdp: peers[props.presence.etudiant].pc.localDescription,
                to: props.presence.etudiant,
                sessionExamen: props.session
            });
        })
        .catch((e) => {
            console.log('Error ', e);
            // resetConnection();

        });

    }

    function handleOfferMessage(message) {
        
        createPeerConnection();
        if(peers[props.presence.etudiant].pc.signalingState !== 'stable' ) return ;

        if (message.sdp !== null) {
            peers[props.presence.etudiant].pc.setRemoteDescription(message.sdp)
                .then(function () {
                    return peers[props.presence.etudiant].pc.createAnswer(
                        {offerToReceiveAudio: true, offerToReceiveVideo: true}
                    );
                })
                .then(function (answer) {
                    return peers[props.presence.etudiant].pc.setLocalDescription(answer);
                })
                .then(function () {
                    sendToServer({
                        from: props.session.surveillant,
                        type: 'answer',
                        sdp: peers[props.presence.etudiant].pc.localDescription,
                        to: props.presence.etudiant,
                        sessionExamen: props.session
                    });
                    
                })
                .catch((e) => {
                    console.log('Error handleOfferMessage', e);
                    // resetConnection();
                })
        }

        
    }

    function handleAnswerMessage(message) {
        peers[props.presence.etudiant].pc.setRemoteDescription(message.sdp)
                            .catch((e) => {
                                console.log('Error ', e);
                                // resetConnection()
                            });

    }

    async function handleTrackEvent (event) {
        console.log("track added ....")
        console.log("streams: ",event.streams);
        // setStudentCamera()
        if(videoRef.current ) {
            console.log("camera...");
            //if(videoRef.current.srcObject && videoRef.current.srcObject.getTracks() !== null)
            // videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            // stop();
            // videoRef.current.pause();
            // videoRef.current.srcObject = null;
            videoRef.current.srcObject = event.streams[0];
            console.log("stream: ",videoRef.current.srcObject)
            videoRef.current.addEventListener('loadedmetadata',  function () {
                videoRef.current.play()
                    .catch(e => console.log('Failed to play video ', e));

            })
            
        }
    }

    function sendNegotiateMessage()  {
        console.log('sending negotiate message')
        console.log({
            from:props.session.surveillant,
            type: 'negotiate',
            to: props.presence.etudiant,
            sessionExamen:  props.session
        })
        sendToServer({
                from:props.session.surveillant,
                type: 'negotiate',
                to: props.presence.etudiant,
                sessionExamen:  props.session
        });
       
    }



    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);
        console.log(props);
        if(socket.readyState === WebSocket.OPEN ){
            console.log("it is open")
            socket.send(msgJSON);
         }   
    }

    function handleNewICECandidateMessage(message) {
        if(peers[props.presence.etudiant].pc) {
            if( peers[props.presence.etudiant].pc.signalingState === 'stable') {
                let candidate = new RTCIceCandidate(message.candidate);
                if(candidate && peers[props.presence.etudiant].pc.localDescription && peers[props.presence.etudiant].pc.remoteDescription?.type )
                    peers[props.presence.etudiant].pc.addIceCandidate(candidate)
                        .catch((e) => console.log('ICE Error ', e));

            } else {
                peers[props.presence.etudiant].iceCandidate = message.candidate;
            }
        }
    }




    const markPresent = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/présence`;
        axios.put(url, etudiant, { withCredentials: true });
    };
    const markAbsent = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/absent`;
        axios.put(url, etudiant, { withCredentials: true });
    };
    const block = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/block`;
        axios.put(url, etudiant, { withCredentials: true });
    };
    const unblock = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/unblock`;
        axios.put(url, etudiant, { withCredentials: true });
    };

    const displayPresenceActions = () => {
        const etat = props.presence.state;
        switch (etat) {
            case ("ABSENT"):
                return (<Button onClick={e => { markPresent(); }}>Marquer présent</Button>);
                break;
            case ("PRESENT"):
                return (<Button onClick={e => { markAbsent(); }}>Marquer Absent</Button>);
                break;
            default: return (<></>);
        }
    };

    const displayBlockingActions = () => {
        const etat = props.presence.state;
        switch (etat) {
            case ("BLOQUER"):
                return (<Button onClick={e => { unblock(); }}>Débloquer</Button>);
                break;
            default: return (<Button onClick={e => { block(); }}>Bloquer</Button>);
        }
    };

    function stop() {
        if (peers[props.presence.etudiant].pc) {
            // console.log('disconnect all our event listeners')
            // // disconnecting all the event listeners
            // peers[props.presence.etudiant].pc.onicecandidate = null;
            // peers[props.presence.etudiant].pc.ontrack = null;
            // peers[props.presence.etudiant].pc.onnegotiationneeded = null;
            // peers[props.presence.etudiant].pc.oniceconnectionstatechange = null;
            // peers[props.presence.etudiant].pc.onsignalingstatechange = null;
            // peers[props.presence.etudiant].pc.onicegatheringstatechange = null;
            // peers[props.presence.etudiant].pc.onnotificationneeded = null;
            // peers[props.presence.etudiant].pc.onremovetrack = null;
            // Stopping the videos
            if (videoRef.current || videoRef.current?.srcObject) {
                if(videoRef.current.srcObject && videoRef.current.srcObject.getTracks() !== null)
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }

            // peers[props.presence.etudiant].pc.removeTrack(peers[props.presence.etudiant].sender);
            // close the peer connection
            // peers[props.presence.etudiant].videoSender = null;
            // peers[props.presence.etudiant].audioSender = null;
            // peers[props.presence.etudiant].sender = null;
            // peers[props.presence.etudiant].pc.close();
            // peers[props.presence.etudiant].pc = null;

            // if(peers[props.presence.etudiant].iceCandidate) peers[props.presence.etudiant].iceCandidate = null;
            // // setMyPeerConnection(null);
        }
    }


    return (
    // <Card>
    //         <CardContent>
    //             <Typography>
    //                 nom: {etudiant.name}
    //             </Typography>
    //             <Typography>
    //                 prenom: {etudiant.lastName}
    //             </Typography>
    //         </CardContent>
    //         <CardContent>
    //             <Typography>
    //                 Présence: {props.presence.state}
    //             </Typography>
    //         </CardContent>
    //         <CardContent>
                
             <Box width={"300px"} height={"300px"} position={"absolute"}>
                    <video style={{width:"300px",height:"300px"  , zIndex:"999"}} ref={videoRef}  muted>

                    </video> 
             </Box> 
            // </CardContent>
        //     <CardContent>
                // {displayPresenceActions()}
                // {displayBlockingActions()}
        //     </CardContent>
        // </Card>
        
    
        );
};
export default EtudiantCard;
