import { Box } from "@mui/material";
import React, { useState,useEffect, useRef } from "react";
import ExamRoom from "./ExamRoom";
import JoinExamRoom from "./JoinExamRoom";
import SimplePeer from "simple-peer";
import { useNavigate } from "react-router-dom";

const PassExam = () => {
    const [code, setCode] = useState('');
    const [inSession, setInSession] = useState(false);
    const [socket, setSocket] = useState();
   
    const [presence, setPresence] = useState(null);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(socket !== undefined){
            return(()=>{
                socket.close();
            })
        }
    },[socket])

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
            ws.addEventListener("close",(e)=>{
                console.log("close Event ",e.code," ",e.reason)
                navigate("/etudiant");
            })
            setSocket(ws);
        }
    },[]);

    
    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {!inSession && <JoinExamRoom code={code} setCode={setCode} setInSession={setInSession} setPresence={setPresence} socket={socket} >
            </JoinExamRoom>}
            {inSession && <ExamRoom socket={socket} code={code} presence={presence} ></ExamRoom>}
        </Box>);
};
export default PassExam;
