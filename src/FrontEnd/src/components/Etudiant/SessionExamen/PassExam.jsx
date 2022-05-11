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
    const peer = useRef();
    const [presence, setPresence] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/examRoom");
        if (ws !== null) {
            ws.onmessage = e => {
                const data = JSON.parse(e.data);
                if (data.type === "message") {
                    setInSession(false);
                    alert(data.payload);
                }
                else if (data.type === "data") {
                    setPresence(data.payload);
                    console.log(data.payload);
                }
                else if (data.type === "blocked") {
                    ws.close();
                    alert(data.payload);
                }
                else if (data.type === "signal") {
                    console.log("answer")
                    peer.current.signal(data.payload);
                }
                console.log(data);
            };
            ws.onclose = e => {
                navigate("/etudiant");
            };
            setSocket(ws);
        }
    }, []);

    
    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {!inSession && <JoinExamRoom code={code} setCode={setCode} setInSession={setInSession} setPresence={setPresence} socket={socket} peer={peer}>
            </JoinExamRoom>}
            {inSession && <ExamRoom socket={socket} code={code} presence={presence} peer={peer}></ExamRoom>}
        </Box>);
};
export default PassExam;
