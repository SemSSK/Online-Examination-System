import { Box } from "@mui/material";
import React, { useState,useEffect, useRef } from "react";
import ExamRoom from "./ExamRoom";
import JoinExamRoom from "./JoinExamRoom";
import { useNavigate } from "react-router-dom";
import GetReady from "./GetReady"
import newStyle from '../../appStyling/newStyle.module.css'

const PassExam = () => {
    const [code, setCode] = useState('');
    const [inSession, setInSession] = useState(false);
    const [socket, setSocket] = useState();
    const [stream, setStream] = useState(null);
    const [readyToJoin, setReadyToJoin] = useState(false);
    const [presence, setPresence] = useState(null);
    const [timeToAskForCopy,setTimeToAskForCopy] = useState(false);
    const navigate = useNavigate();
    
    

    // useEffect(()=>{
    //     console.log("reload socket");
    //     console.log(peer);
    //     if(socket !== undefined){
    //         socket.onmessage = e => {
    //         const data = JSON.parse(e.data);
    //         console.log(data);
    //         if (data.type === "message") {
    //             setInSession(false);
    //             alert(data.payload);
    //         }
    //         else if (data.type === "data") {
    //             setPresence(data.payload);
    //             console.log(data.payload);
    //         }
    //         else if (data.type === "blocked") {
    //             socket.close();
    //             alert(data.payload);
    //         }
    //         else if (data.type === "signal") {
    //             console.log("answer")
    //             peer.signal(data.payload);
    //         }
    //         console.log(data);
    //     };
    //     socket.onclose = e => {
    //             console.log("close Event")
    //             navigate("/etudiant");
    //         } 
    //     }
    // },[peer,videoState])


    //creation of websocket connection should be after checking of exam code so better to be in GetReady component
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/examRoom");
        if (ws !== null) {
            ws.onmessage = e => {
                const data = JSON.parse(e.data);
                console.log(data);
                if (data.type === "message") {
                    setInSession(false);
                    alert(data.payload);
                }
                else if (data.type === "data") {
                    setPresence(data.payload);
                    console.log(data.payload);
                }
                else if (data.type === "blocked") {
                    alert(data.payload);
                }
                
                console.log(data);
            };
            ws.onclose = e => {
                console.log("close Event")
                
                navigate("/etudiant");
            };
            setSocket(ws);
        }
    },[]);

    
    return (
        <Box width={"100%"} height={"100%"} justifyContent={"center"}>
        {
         !inSession ?

            <JoinExamRoom code={code} setCode={setCode} setInSession={setInSession} setPresence={setPresence} socket={socket} >
            </JoinExamRoom>
        :

            presence ?
                !(presence.state === "PRESENT") ?
                    <GetReady
                        readyToJoin={readyToJoin}
                        setReadyToJoin={setReadyToJoin}
                        stream={stream}
                        setStream={setStream}
                        surveillant={presence.sessionExamen.surveillant}
                        etudiant={presence.etudiant}
                        sessionExamen={presence.sessionExamen}
                        socket={socket}
                    />
                : <ExamRoom  socket={socket} code={code} presence={presence} ></ExamRoom>
            : <div className={newStyle.loadingContainer}><div className={newStyle.loader}> <span>Loading...</span> </div></div>
        }

        </Box>);
};
export default PassExam;
