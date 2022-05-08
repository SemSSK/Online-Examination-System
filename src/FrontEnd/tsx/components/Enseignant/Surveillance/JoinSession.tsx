import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../Authentication/ErrorMessage";


const JoinSession : React.FC<{code,setCode,socket,setSession,setSessionLoaded,setSocket,setListEtudiant}>= (props)=>{
    const navigate = useNavigate();

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080/examRoom");
        if(ws !== null){
            ws.onmessage = e => {
                const data = JSON.parse(e.data);
                if(data.type === "message"){
                    alert(data.payload);
                    navigate("/surveillant");
                }
                else if(data.type === "data"){
                    props.setListEtudiant(data.payload);
                }
                else if(data.type === "session-info"){
                    props.setSession(data.payload);
                }
                console.log(data);
            }
            ws.onclose = e => {
                navigate("/enseignant");
            }
            props.setSocket(ws);
        }
    },[]);

    const joinSession = ()=>{
        props.socket.send(props.code);
    }

    return(
        <Grid container display={"flex"} justifyContent={"center"}>
            <Grid item xs={4}>
                <Card variant="outlined">
                    <CardHeader title={"Entrer votre code de surveillant:"}></CardHeader>
                    <CardContent>
                        <TextField variant="outlined" placeholder="code surveillant" fullWidth
                            onChange={(e)=>{
                                props.setCode(e.target.value)
                            }}
                        >
                        </TextField>
                    </CardContent>
                    <CardContent style={{margin:"auto"}}>
                        <Button 
                            variant="outlined"
                            onClick={(e)=>{
                               joinSession();
                            }}
                            >
                            Start
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default JoinSession;