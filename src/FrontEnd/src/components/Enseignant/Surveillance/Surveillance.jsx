import { Box } from "@mui/system";
import React, { useState,useEffect } from "react";
import JoinSession from "./JoinSession";
import Session from "./Session";
import SimplePeer from "simple-peer";
import { useNavigate } from "react-router-dom";

const Surveillance = () => {
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState();
    
    const [listEtudiant, setListEtudiant] = useState([]);
    const [session, setSession] = useState();
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const navigate = useNavigate();

    const updateList = (newList)=>{
        let resultList = newList;
        resultList.forEach(function(presence,index) {
            console.log("looping")
            const foundIndex = listEtudiant.findIndex(p => {
                return p.etudiant.userId === presence.etudiant.userId;
            })
            console.log(foundIndex);
            if(foundIndex !== -1){
                console.log(listEtudiant[foundIndex]);
                if(listEtudiant[foundIndex].peer !== undefined){
                    console.log("Altering Element");
                    console.log(this[index])
                    this[index].peer = listEtudiant[foundIndex].peer;
                    console.log(this[index])
                }
            }
        },resultList)
        console.log("new List");
        setListEtudiant(resultList);
    }

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080/examRoom");
        console.log(ws);
        if (ws !== null) {
            ws.onmessage = e => {
                    const data = JSON.parse(e.data);
                    if (data.type === "message") {
                        alert(data.payload);
                        navigate("/surveillant");
                    }
                    else if (data.type === "data") {
                        let newList = data.payload;
                        updateList(newList);
                    }
                    else if (data.type === "session-info") {
                        setSession(data.payload);
                    }
                };
                ws.onclose = e => {
                    navigate("/enseignant");
                };
            setSocket(ws);
        }


    },[])
    


    return (<Box width={"100%"} height={"100%"} justifyContent={"center"}>
            {(session == undefined) &&
            <JoinSession 
                code={code} 
                setCode={setCode} 
                socket={socket} 
                setSession={setSession} 
                setSessionLoaded={setSessionLoaded} 
            ></JoinSession>}
            {(session !== undefined) &&
                <Session 
                    socket={socket} 
                    code={code} 
                    session={session} 
                    ListEtudiant={listEtudiant}
                >
                </Session>
            }
        </Box>);
};
export default Surveillance;
