// import { Box } from "@mui/system";
import React, { useState,useEffect } from "react";
import JoinSession from "./JoinSession";
// import Session from "./Session";
import { useNavigate } from "react-router-dom";
import presenceCheck from "./PresenceCheck.module.css";
import PresenceCheck from "./PresenceCheck";

const Surveillance = () => {
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState();
    
    const [listEtudiant, setListEtudiant] = useState([]);
    const [session, setSession] = useState();
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const navigate = useNavigate();
    const [peers, setPeers] = useState({})

    const updateList = (newList) => {
        // let resultList = newList;
        // resultList.forEach(function(presence,index) {
        //     console.log("looping")
        //     const foundIndex = listEtudiant.findIndex(p => {
        //         return p.etudiant.userId === presence.etudiant.userId;
        //     })
        //     console.log(foundIndex);
        //     if(foundIndex !== -1){
        //         console.log(listEtudiant[foundIndex]);
        //         if(listEtudiant[foundIndex].peer !== undefined){
        //             console.log("Altering Element");
        //             console.log(this[index])
        //             this[index].peer = listEtudiant[foundIndex].peer;
        //             console.log(this[index])
        //         }
        //     }
        // },resultList)
        console.log("new List: " ,newList);
        setListEtudiant(newList);
    }
    // useEffect(()=>{

    //     if(socket instanceof WebSocket){
    //     return ()=>{
    //         socket.close();
    //     }}
    // },[socket])

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
                // else if(data.type === "signal"){
                //     console.log("received signal");
                //     // const peer = new SimplePeer({
                //     //     initiator:false,
                //     //     trickle:false
                //     // });
                //     const sender = data.from;
                //     // peer.on("signal",(data)=>{
                //     //     ws.send(JSON.stringify({
                //     //         type:"signal",
                //     //         payload:data,
                //     //         to:sender
                //     //     }))
                //     // })
                //     // peer.on("connect",()=>{
                //     //     console.log("connected");
                //     // })
                //     // addPeerToPresence(peer,sender);
                //     // peer.signal(data.payload);
                // }
                };
                ws.onclose = e => {
                    navigate("/enseignant");
                };
            setSocket(ws);
        }


    },[])

    // useEffect(() => {
    //     if(socket !== undefined){
    //         socket.onmessage = e => {
    //         const data = JSON.parse(e.data);
    //         if (data.type === "message") {
    //             alert(data.payload);
    //             navigate("/surveillant");
    //         }
    //         else if (data.type === "data") {
    //             let newList = data.payload;
    //             updateList(newList);
    //         }
    //         else if (data.type === "session-info") {
    //             setSession(data.payload);
    //         }
    //         // else if(data.type === "signal"){

    //         //     console.log("received signal");

    //         //     const peer = new SimplePeer({
    //         //         initiator:false,
    //         //         trickle:false,
    //         //         config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
    //         //     });
    //         //     const sender = data.from;

    //         //     peer.on("signal",(data)=>{
    //         //         socket.send(JSON.stringify({
    //         //             type:"signal",
    //         //             payload:data,
    //         //             to:sender
    //         //         }))
    //         //     })

    //         //     peer.on("close",()=>{
    //         //         console.log("disconnected");
    //         //         peer.destroy();
    //         //     })

    //         //     addPeerToPresence(peer,sender);
    //         //     peer.on("connect",()=>{
    //         //         console.log("connected");
    //         //     })

    //         //     peer.signal(data.payload);

    //         // }
    //         console.log(data);
    //         };
    //         socket.onclose = e => {
    //             navigate("/enseignant");
    //         };
    //     }

            
    // }, [listEtudiant,session]);


    // const addPeerToPresence = (peer,sender)=>{
    //     console.log(listEtudiant);
    //     setListEtudiant(listEtudiant.map(presence => (
    //         presence.etudiant.userId === sender.userId ? {...presence,peer:peer} : presence
    //     )));
    //     console.log(listEtudiant);
    // }

    


    return (
    // <Box width={"100%"} height={"100%"} justifyContent={"center"}>
    <div className={presenceCheck.container}>
    {(session === undefined) &&
            <JoinSession 
                code={code} 
                setCode={setCode} 
                socket={socket} 
                setSession={setSession} 
                setSessionLoaded={setSessionLoaded} 
            ></JoinSession>}
            {(session !== undefined) &&
                // <Session 
                //     socket={socket} 
                //     code={code} 
                //     session={session} 
                //     ListEtudiant={listEtudiant}
                // >
                // </Session>
                 <div className={presenceCheck.main}>
                 <div className={presenceCheck.wrapper}>
                     <PresenceCheck
                        socket={socket} 
                        code={code} 
                        session={session} 
                        ListEtudiant={listEtudiant}
                        setListEtudiant={setListEtudiant}
                        peers={peers}
                        setPeers={setPeers}
                    />
                 </div>
 
                 <svg hidden="hidden">
                 <defs>
                     <symbol id="icon-arrow-left" viewBox="0 0 32 32">
                     <title>arrow-left</title>
                     <path
                         d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z"
                     ></path>
                     </symbol>
                     <symbol id="icon-arrow-right" viewBox="0 0 32 32">
                     <title>arrow-right</title>
                     <path
                         d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z"
                     ></path>
                     </symbol>
                 </defs>
                 </svg>
             </div>
            }
            </div> 
        // </Box>
        );
};
export default Surveillance;
