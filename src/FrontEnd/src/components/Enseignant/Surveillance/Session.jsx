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

    /* function createPeerSocketConnection() {
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

    } */

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
    
    return (<Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={11}></Grid>
                    <Grid item xs={1}>
                        {(getSessionState() === "OPENED") && <Button variant="contained" onClick={(e) => { startSession(); }}>start Session</Button>}
                        {(getSessionState() === "STARTED") && <Button variant="contained" onClick={(e) => { endSession(); }}>end Session</Button>}
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid container>
                    {props.ListEtudiant.map(e => {
            return (<Grid item xs={3} key={e.etudiant.userId}>
                                <EtudiantCard 
                                        presence={e} 
                                        code={props.code}
                                        socket={socket}
                                        session={props.session}
                                >
                                </EtudiantCard>
                            </Grid>);
        })}
                    
                </Grid>
            </CardContent>
        </Card>);
};
export default Session;
