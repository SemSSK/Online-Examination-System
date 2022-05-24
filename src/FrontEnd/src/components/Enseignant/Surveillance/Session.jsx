import { Button, Card, CardContent, Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EtudiantCard from "./EtudiantCard";
const Session = ({socket, ...props}) => {

    const navigate = useNavigate();
    // const [socket, setPeerSocket] = useState();

    const getSessionState = () => {
        return props.session.state;
    };

    // useEffect(()=>{
    //     if(!socket)
    //         createPeerSocketConnection();

    // },[])

    function createPeerSocketConnection() {
        let peerSocketInstance;
        if (window.location.protocol === 'http:')
            peerSocketInstance = new WebSocket(`ws://localhost:8080/peer`);
        else
            peerSocketInstance = new WebSocket(`wss://${window.location.host}/signal` );

            peerSocketInstance.onopen = function () {

            console.log('Socket connection successful')
           
        }

        peerSocketInstance.onmessage = (msg)=>{
            const message = JSON.parse(msg.data);
            console.log(message);
        }
       

        // socketConnection.onclose = function() {
        //     history.push('/');
        // }

        peerSocketInstance.onerror = function (event) {
            console.log('Socket connection error ', event);
        }
        setPeerSocket(peerSocketInstance);

    }

    const startSession = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url, {}, { withCredentials: true });
    };
    const endSession = () => {
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url, {}, { withCredentials: true })
            .then(response => {
            if (response.status !== 200) {
                throw (response.data);
            }
            socket.close();
            navigate("/enseignant");
        });
    };
    
    return ( 
    // <Card>
            // {/* <CardContent>
            //     <Grid container>
            //         <Grid item xs={11}></Grid>
            //         <Grid item xs={1}>
            //             {(getSessionState() === "OPENED") && <Button variant="contained" onClick={(e) => { startSession(); }}>start Session</Button>}
            //             {(getSessionState() === "STARTED") && <Button variant="contained" onClick={(e) => { endSession(); }}>end Session</Button>}
            //         </Grid>
            //     </Grid>
            // </CardContent> */}
            <div className="container" >
                <Grid container>
                    {props.ListEtudiant.map(e => {
            return (
                <Grid item xs={3} key={e.etudiant.userId}>
                                <EtudiantCard 
                                        presence={e} 
                                        code={props.code}
                                        socket={socket}
                                        session={props.session}
                                >
                                </EtudiantCard>
                            </Grid>
                            );
                    })}
                </Grid>

                <div className="main">
                <div className="wrapper">
                    <StudentsSwiper students={students} />
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
                    
            </div>
        // {/* </Card> */}
        );
};
export default Session;
