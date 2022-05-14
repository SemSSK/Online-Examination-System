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
        setListEtudiant(resultList);
    }
    useEffect(()=>{
        if(socket instanceof WebSocket){
        return ()=>{
            socket.close();
        }}
    },[socket])

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080/examRoom");
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
                else if(data.type === "signal"){
                    console.log("received signal");
                    const peer = new SimplePeer({
                        initiator:false,
                        trickle:false
                    });
                    const sender = data.from;
                    peer.on("signal",(data)=>{
                        ws.send(JSON.stringify({
                            type:"signal",
                            payload:data,
                            to:sender
                        }))
                    })
                    addPeerToPresence(peer,sender);
                    peer.on("connect",()=>{
                        console.log("connected");
                    })
                    peer.signal(data.payload);
                }
                console.log(data);
                };
                ws.onclose = e => {
                    navigate("/enseignant");
                };
            setSocket(ws);
        }
    },[])

    useEffect(() => {
        if(socket !== undefined){
            socket.onmessage = e => {
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
            else if(data.type === "signal"){

                console.log("received signal");

                const peer = new SimplePeer({
                    initiator:false,
                    trickle:false,
                    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
                });
                const sender = data.from;

                peer.on("signal",(data)=>{
                    socket.send(JSON.stringify({
                        type:"signal",
                        payload:data,
                        to:sender
                    }))
                })

                peer.on("close",()=>{
                    console.log("disconnected");
                    peer.destroy();
                })

                addPeerToPresence(peer,sender);
                peer.on("connect",()=>{
                    console.log("connected");
                })

                peer.signal(data.payload);

            }
            console.log(data);
            };
            socket.onclose = e => {
                navigate("/enseignant");
            };
        }

            
    }, [listEtudiant,session]);


    const addPeerToPresence = (peer,sender)=>{
        console.log(listEtudiant);
        setListEtudiant(listEtudiant.map(presence => (
            presence.etudiant.userId === sender.userId ? {...presence,peer:peer} : presence
        )));
        console.log(listEtudiant);
    }

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
            <Session socket={socket} code={code} session={session} ListEtudiant={listEtudiant}></Session>}
        </Box>);
};
export default Surveillance;
