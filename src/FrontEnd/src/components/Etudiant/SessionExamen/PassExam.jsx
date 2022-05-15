import { Box } from "@mui/material";
import React, { useState,useEffect } from "react";
import ExamRoom from "./ExamRoom";
import JoinExamRoom from "./JoinExamRoom";
import { useNavigate } from "react-router-dom";

const PassExam = () => {
    const [code, setCode] = useState('');
    const [inSession, setInSession] = useState(false);
    const [socket, setSocket] = useState();
    const [peer,setPeer] = useState();
    const [videoState,setVideoState] = useState();
    const [presence, setPresence] = useState(null);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(socket !== undefined){
            return (()=>{
                socket.close();
            })
        }
    },[socket])

    useEffect(()=>{
        if(socket !== undefined){
            socket.onmessage = e => {
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
                else if (data.type === "signal") {
                    console.log("answer")
                    peer.signal(data.payload);
                }
                console.log(data);
            };
        }
    },[peer])

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
                if(peer !== undefined){
                    peer.close();
                }
                navigate("/etudiant");
            };
            setSocket(ws);
        }
    }, []);

    
    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {!inSession && <JoinExamRoom code={code} setCode={setCode} setInSession={setInSession} setPresence={setPresence} socket={socket} peer={peer}>
            </JoinExamRoom>}
            {inSession && <ExamRoom socket={socket} code={code} presence={presence} setPeer={setPeer} setVideoState={setVideoState}></ExamRoom>}
        </Box>);
};
export default PassExam;
