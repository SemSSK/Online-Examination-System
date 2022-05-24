import React,{useRef,useEffect} from "react"
import Paper from '@mui/material/Paper';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import BlockIcon from '@mui/icons-material/Block';
import IconButton from "@mui/material/IconButton";
import studentList from './studentList.module.css'
import axios from "axios";

const CameraCard =({student, socket, code, session, peers, setPeers }) => {

const [focused,setFocused] = React.useState("");

const videoRef = useRef()
    useEffect(()=>{
        if(videoRef.current) {
            videoRef.current.srcObject = peers[student.etudiant].cameraStream;
            console.log("stream: ",videoRef.current.srcObject)
            videoRef.current.addEventListener('loadedmetadata',  function () {
                videoRef.current.play()
                    .catch(e => console.log('Failed to play video ', e));
            })
        }
    },[])
    const block = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${code}/block`;
        axios.put(url, student.etudiant, { withCredentials: true });
    };
    return (
        <div className={studentList.cameraCard}>
            <Paper elevation={3} className={studentList.cameraCard__paper}>
                <div className={studentList.cameraCard__container}>
                    {/* <h4>{student.fullName}</h4> */}
                    <div className={studentList.switch+ " " + focused}

                    >
                        <input id="cb5" className={studentList.tgl + " " +studentList.tgl_flip} type="checkbox" />
                        <label className={studentList.tgl_btn}  htmlFor="cb5"></label>
                    </div>
                    <video style={{height:"100%", width:"100%"}}  muted='muted' ref={videoRef}/>
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