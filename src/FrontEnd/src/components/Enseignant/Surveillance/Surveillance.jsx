import { Box } from "@mui/system";
import React, { useState } from "react";
import JoinSession from "./JoinSession";
import Session from "./Session";
const Surveillance = () => {
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState();
    const [listEtudiant, setListEtudiant] = useState([]);
    const [session, setSession] = useState();
    const [sessionLoaded, setSessionLoaded] = useState(false);
    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {(session == undefined) &&
            <JoinSession code={code} setCode={setCode} socket={socket} setSession={setSession} setSessionLoaded={setSessionLoaded} setSocket={setSocket} setListEtudiant={setListEtudiant}></JoinSession>}
            {(session !== undefined) &&
            <Session socket={socket} code={code} session={session} ListEtudiant={listEtudiant}></Session>}
        </Box>);
};
export default Surveillance;
