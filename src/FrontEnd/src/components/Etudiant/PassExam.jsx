import { Box } from "@mui/material";
import React, { useState } from "react";
import ExamRoom from "./ExamRoom";
import JoinExamRoom from "./JoinExamRoom";
const PassExam = () => {
    const [code, setCode] = useState('');
    const [inSession, setInSession] = useState(false);
    const [socket, setSocket] = useState();
    const [presence, setPresence] = useState(null);
    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {!inSession && <JoinExamRoom code={code} setCode={setCode} setInSession={setInSession} setSocket={setSocket} setPresence={setPresence} socket={socket}>
            </JoinExamRoom>}
            {inSession && <ExamRoom socket={socket} code={code} presence={presence}></ExamRoom>}
        </Box>);
};
export default PassExam;
