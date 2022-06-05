import React,{useRef,useEffect,useState} from "react"
import Paper from '@mui/material/Paper';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import BlockIcon from '@mui/icons-material/Block';
import IconButton from "@mui/material/IconButton";
import studentList from './studentList.module.css'
import axios from "axios";

const CameraCard =({student, socket, code, session, peers, setPeers }) => {

const [focused,setFocused] = useState("");
const [flipClass,setFlipClass]= useState('');

const videoRef = useRef()
const videoRef2 = useRef();

    window.onbeforeunload = function (e) {
        stop();
    };
    function stop() {
        if (peers[student.etudiant].pc) {
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

    useEffect(()=>{
        setUpRecordStream();
        setUpCameraStream();


    },[])

    const setUpCameraStream = async () => {
        if(videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = peers[student.etudiant].cameraStream;
            console.log("stream: ",videoRef.current.srcObject)
            await videoRef.current.play()
                    .catch(e => console.log('Failed to play video ', e));
        }
    }
    const setUpRecordStream = async () => {
        if(videoRef2.current && !videoRef2.current.srcObject){
            videoRef2.current.srcObject = peers[student.etudiant].recordStream;
            console.log("stream: ",videoRef2.current.srcObject)
            await videoRef2.current.play()
                    .catch(e => console.log('Failed to play video ', e));
        }
    }

//peers[student.etudiant].cameraStream, peers[student.etudiant].recordStream
    const block = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${code}/block`;
        axios.put(url, student.etudiant, { withCredentials: true });
    };

    return (
        <div className={studentList.cameraCard}>
            <Paper elevation={3} className={studentList.cameraCard__paper}>
                <div className={studentList.cameraCard__container}>
                    {/* <h4>{student.fullName}</h4> */}
                    <div className={studentList.switch+ " " + focused}>
                        <input id="cb5" className={studentList.tgl + " " +studentList.tgl_flip} type="checkbox" />
                        <label className={studentList.tgl_btn}  htmlFor="cb5"
                               onClick={() => {
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
                    <div className={studentList.card__header + " " + focused}>
                        <div className={studentList.avatar}>
                            <div role="button" 
                                className={studentList.avatar__letters}
                                onClick={()=>setFocused(f => f === studentList.focused ? " " : studentList.focused)}
                            >

                                {student.etudiant.lastName.charAt(0) + student.etudiant.name.charAt(0)}
                            </div>
                        </div>

                        <div className={studentList.card__details}>
                            <div className={studentList.card__student_name}>
                                <h4>{student.etudiant.lastName +" " +student.etudiant.name }</h4>
                            </div>
                            <IconButton size="medium"  color="inherit"
                                onClick={()=>block()}
                            >
                                <RemoveCircleIcon style={{ fontSize: "1em", color: 'red' }}/>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default CameraCard;