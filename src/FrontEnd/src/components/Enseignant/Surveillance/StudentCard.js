import React,{useEffect, useRef, useState} from "react";
import axios from "axios";
import {  SwiperSlide } from "swiper/react";



import presenceCheck from './PresenceCheck.module.css';
import avatar from "../../appStyling/avatar.png";
import studentList from "./studentList.module.css";
import './swiperStudentStyle.css'

// export const peers = {};
const StudentCard = ({updateState,socket,peers,setPeers, ...props}) => {
    
    // const [studentCamera, setStudentCamera] = useState(null);
    // const [videoSource, setVideoSource] = useState("camera")
    const [flipClass,setFlipClass]= useState('');
    const etudiant = props.presence.etudiant;
    const videoRef = useRef();
    const videoRef2 = useRef();
    // const videoNavigateRef = useRef();
    // const recordRef = useRef();
    window.onbeforeunload = function (e) {
        stop();
    };
    const studentImage = avatar;
    const studentCardNumber= etudiant.userId;
    const studentFullName = etudiant.lastName +" "+ etudiant.name;
    const studentLevel = etudiant.niveau;
    const studentSection = etudiant.section;
    const studentGroup = etudiant.groupe;

    useEffect( () => {
        console.log(props);
        if(!peers[props.presence.etudiant]){
            setPeers(prevPeers => {
               let newPeers = prevPeers
                newPeers[etudiant] = {}
                return newPeers
            } )
        }
        if(socket){
            socket.addEventListener('message',messageHandler);
            sendNegotiateMessage();
        }
        console.log(props);

    },[socket]);

    //start creating peer connection with each student


    // function changeMedia(){
    //     if(videoSource === "camera"){
    //         if(videoRef.current ) {
    //             console.log("change to camera...");
    //             if(videoRef.current.srcObject)
    //                 videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    //             videoRef.current.pause();
    //             videoRef.current.srcObject = null;
    //             videoRef.current.srcObject = peers[etudiant].cameraStream;
    //             console.log("stream: ",videoRef.current.srcObject)
    //             videoRef.current.addEventListener('loadedmetadata',  function () {
    //                 videoRef.current.play()
    //                     .catch(e => console.log('Failed to play video ', e));
    //
    //             })
    //
    //         }
    //     }else {
    //         if(videoRef.current ) {
    //             console.log("change to screen ...");
    //             if(videoRef.current.srcObject)
    //                 videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    //             videoRef.current.pause();
    //             videoRef.current.srcObject = null;
    //             videoRef.current.srcObject = peers[etudiant].recordStream;
    //             console.log("stream: ",videoRef.current.srcObject)
    //             videoRef.current.addEventListener('loadedmetadata',  function () {
    //                 videoRef.current.play()
    //                     .catch(e => console.log('Failed to play video ', e));
    //
    //             })
    //
    //         }
    //     }
    // }
    //
    // useEffect(()=>{
    //     console.log("stream state:")
    //     if(peers[etudiant] && (peers[etudiant].cameraStream || peers[etudiant].screenStream))
    //         changeMedia()
    // },[videoSource])
    //
    // useEffect(()=>{
    //     if(videoSource==="camera"){
    //         setFlipClass('')
    //     }else{
    //         setFlipClass(studentList.flip)
    //     }
    //     console.log(flipClass)
    // },[videoSource])

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
                 break;
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

        setPeers((prevPeers) => {
            let newPeers = {...prevPeers}
            newPeers[props.presence.etudiant].pc.onnegotiationneeded = handleNegotiationNeededEvent
            return newPeers;
        })

        
    }

    function createPeerConnection() {
       
        let myLocalPeers = peers;
        // peer connection configuration (STUN & TURN server configuration)
        const peerConnectionConfig ={ 
            'iceServers': [ 
               {'urls': 'stun:stun.gmx.net:3478'},
               {'urls': 'stun:stun.stunprotocol.org:3478'},
               {'urls': 'stun:stun.l.google.com:19302'}
           ]
       };
        // };


        myLocalPeers[props.presence.etudiant].pc = new RTCPeerConnection(peerConnectionConfig);

        myLocalPeers[props.presence.etudiant].pc.ontrack = handleTrackEvent;

        myLocalPeers[props.presence.etudiant].pc.oniceconnectionstatechange =  (event) => {
            console.log('peer connection ice state ', myLocalPeers[props.presence.etudiant].pc.iceConnectionState , props.presence.etudiant);
            switch(myLocalPeers[props.presence.etudiant].pc.iceConnectionState) {
                case "connected":
                    console.log('ice connection is in state: connected');
                    // setTimeToGetMedia(true);
                    break;
                case "disconnected":
                case "failed":
                    console.log('ice connection ', myLocalPeers[props.presence.etudiant].pc.iceConnectionState , "event##", event);
                    
                    break;
                case "closed":
                    console.log('ice connection closed')
                    break;
                default:
                    break;
            }
        }

        myLocalPeers[props.presence.etudiant].pc.onsignalingstatechange = () => {

            switch (myLocalPeers[props.presence.etudiant].pc.signalingState) {

                case "stable":

                    if(!myLocalPeers[props.presence.etudiant].iceCandidate)
                        return;

                    let candidate = new RTCIceCandidate(myLocalPeers[props.presence.etudiant].iceCandidate);

                    if(candidate && myLocalPeers[props.presence.etudiant].pc.localDescription && myLocalPeers[props.presence.etudiant].pc.remoteDescription?.type)
                        myLocalPeers[props.presence.etudiant].pc.addIceCandidate(candidate)
                                            .catch((e) => console.log('ICE Error ', e));

                    break;

                case "closed":
                    console.log('Signaling State: Closed');
                    break;

                default:
                    break;
            }
        }

        myLocalPeers[props.presence.etudiant].pc.onconnectionstatechange = (event) => {
            console.log('Peer connection ', myLocalPeers[props.presence.etudiant].pc.connectionState)
            switch(myLocalPeers[props.presence.etudiant].pc.connectionState) {
                case "connected":
                    console.log('Peer connection is in state: connected');
                    // setTimeToGetMedia(true);
                    break;
                case "disconnected":
                case "failed":
                    console.log('Peer connection ', myLocalPeers[props.presence.etudiant].pc.connectionState , "event##", event);
                    
                    break;
                case "closed":
                    console.log('Peer connection closed')
                    break;
                default:
                    break;
            }
        }

        myLocalPeers[props.presence.etudiant].pc.onicegatheringstatechange = () => {
            switch(myLocalPeers[props.presence.etudiant].pc.iceGatheringState) {
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

        // myLocalPeers[props.presence.etudiant].pc.onnegotiationneeded = handleNegotiationNeededEvent;

        myLocalPeers[props.presence.etudiant].pc.onicecandidate = handleICECandidateEvent;

        setPeers(myLocalPeers)
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
        let myLocalPeers = peers;
        if(myLocalPeers[props.presence.etudiant].pc.signalingState !== 'stable' ) return ;

        myLocalPeers[props.presence.etudiant].pc.createOffer(
            { offerToReceiveAudio: true, offerToReceiveVideo: true }
        )
        .then((offer) => {
            return myLocalPeers[props.presence.etudiant].pc.setLocalDescription(offer);
        })
        .then(() => {
            sendToServer({
                from:props.session.surveillant,
                type: 'offer',
                sdp: myLocalPeers[props.presence.etudiant].pc.localDescription,
                to: props.presence.etudiant,
                sessionExamen: props.session
            });
        })
        .catch((e) => {
            console.log('Error ', e);
            // resetConnection();

        });


        setPeers(myLocalPeers);

    }

    function handleOfferMessage(message) {
        let myLocalPeers = peers;
        createPeerConnection();
        if(myLocalPeers[props.presence.etudiant].pc.signalingState !== 'stable' ) return ;

        if (message.sdp !== null) {
            myLocalPeers[props.presence.etudiant].pc.setRemoteDescription(message.sdp)
                .then(function () {
                    return myLocalPeers[props.presence.etudiant].pc.createAnswer(
                        {offerToReceiveAudio: true, offerToReceiveVideo: true}
                    );
                })
                .then(function (answer) {
                    return myLocalPeers[props.presence.etudiant].pc.setLocalDescription(answer);
                })
                .then(function () {
                    sendToServer({
                        from: props.session.surveillant,
                        type: 'answer',
                        sdp: myLocalPeers[props.presence.etudiant].pc.localDescription,
                        to: props.presence.etudiant,
                        sessionExamen: props.session
                    });
                    
                })
                .catch((e) => {
                    console.log('Error handleOfferMessage', e);
                    // resetConnection();
                })
        }

        setPeers(myLocalPeers)

        
    }

    function handleAnswerMessage(message) {
        setPeers(prevPeers => {
            let newPeers = {...prevPeers}
            newPeers[props.presence.etudiant].pc.setRemoteDescription(message.sdp)
                            .catch((e) => {
                                console.log('Error ', e);
                                // resetConnection()
                            });
            return newPeers
        })

    }

    async function handleTrackEvent (event) {
        console.log("track added ....")
        console.log("streams: ",event.streams);
        // setStudentCamera()
        if(!videoRef.current.srcObject) {
            setPeers(prevPeers => {
                let newPeers = {...prevPeers}
                newPeers[etudiant].cameraStream = event.streams[0]
                return newPeers
            })
            if(videoRef.current) {
                console.log("camera...");
                videoRef.current.srcObject = event.streams[0];
                console.log("stream: ",videoRef.current.srcObject)
                videoRef.current.addEventListener('loadedmetadata',  function () {
                    videoRef.current.play()
                        .catch(e => console.log('Failed to play video ', e));

                })
            }
        }
        else if(!videoRef2.current.srcObject && videoRef.current.srcObject.id !== event.streams[0].id){

            setPeers(prevPeers => {
                let newPeers = {...prevPeers}
                newPeers[etudiant].recordStream = event.streams[0]
                return newPeers
            })
            if(videoRef2.current) {
                console.log("screen...");
                videoRef2.current.srcObject = event.streams[0];
                console.log("stream: ",videoRef2.current.srcObject)
                videoRef2.current.addEventListener('loadedmetadata',  function () {
                    videoRef2.current.play()
                        .catch(e => console.log('Failed to play video ', e));

                })
            }
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
        let myLocalPeers = peers;
        if(myLocalPeers[props.presence.etudiant].pc) {
            if( myLocalPeers[props.presence.etudiant].pc.signalingState === 'stable') {
                let candidate = new RTCIceCandidate(message.candidate);
                if(candidate && myLocalPeers[props.presence.etudiant].pc.localDescription && myLocalPeers[props.presence.etudiant].pc.remoteDescription?.type )
                    myLocalPeers[props.presence.etudiant].pc.addIceCandidate(candidate)
                        .catch((e) => console.log('ICE Error ', e));

            } else {
                myLocalPeers[props.presence.etudiant].iceCandidate = message.candidate;
            }
        }

        setPeers(myLocalPeers)
    }




    const markPresent = () => {

        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/present`;
        console.log("url: ",url)
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
            if (videoRef2.current || videoRef2.current?.srcObject) {
                if(videoRef2.current.srcObject && videoRef2.current.srcObject.getTracks() !== null)
                    videoRef2.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef2.current.pause();
                videoRef2.current.srcObject = null;
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

        <SwiperSlide
            key={studentCardNumber}
            className="student_slider__item  swiper-slide"
        >
            <div  className="student__item">
                <div className={presenceCheck.student__header}>
                    <div className={presenceCheck.student_image}>
                    <img src={studentImage} alt="" />
                    </div>
                    <div className="usernameTitle">
                    <h1>{studentFullName}</h1>
                    </div>
                </div>
                {/*<div className={presenceCheck.student__title}>{studentLevel}</div>*/}

                <div className={presenceCheck.student__detail}>
                    <div >
                    <h4>Speciality :</h4>
                    <p>{studentSection}</p>
                    </div>
                    <div >
                    <h4>Level :</h4>
                    <p>{studentGroup}</p>
                    </div>
                    <div >
                        <h4>Card N° :</h4>
                        <p>{studentCardNumber}</p>
                    </div>
                </div>

                <div className={presenceCheck.student__camera}>
                    <div className={studentList.switch}

                    >
                        <input id="cb5" className={studentList.tgl + " " +studentList.tgl_flip} type="checkbox" />
                        <label className={studentList.tgl_btn}  htmlFor="cb5"
                               onClick={() => {
                                   console.log("class: ",flipClass)
                                   setFlipClass(s => s === '' ? studentList.flipIt : '');
                               }}
                        ></label>
                    </div>
                   <div className={studentList.videoContainer_flip +' '+ flipClass}
                   >
                       <div className={studentList.cameraVideo} >
                            <video style={{height:"100%", width:"100%"}} muted='muted' ref={videoRef}/>
                       </div>
                       <div className={studentList.screenVideo}>
                            <video  style={{height:"100%", width:"100%" ,transform: "scaleX(1)"}} muted='muted' ref={videoRef2}/>
                       </div>
                   </div>

                </div>


                <div className={presenceCheck.student__actions}>
                    <button className={presenceCheck.button +" "+ presenceCheck.btn_accept}
                            onClick={()=> {
                                document.querySelector('.student_slider__item.swiper-slide-active ')?.classList.add('joining');
                                setTimeout(() => {
                                    document.querySelector('.joining ')?.classList.remove('joining')
                                    markPresent()
                                    //updateState(etudiant,"PRESENT")
                                } ,1000)


                            }}
                    >
                    Accept
                    </button>
                    <button className={presenceCheck.button +" "+ presenceCheck.btn_refuse}
                            onClick={()=>{
                                document.querySelector('.student_slider__item.swiper-slide-active ')?.classList.add('leaving');
                                setTimeout(() =>{
                                        document.querySelector('.leaving ')?.classList.remove('leaving')
                                        block()
                                        // updateState(etudiant,"REFUSED")
                                        markAbsent()
                                    },1000
                                )


                            }}
                    >
                    Refuse
                    </button>
                </div>
            </div>
            <div className="item_bg"></div>


        </SwiperSlide>
    )
}

export default StudentCard;