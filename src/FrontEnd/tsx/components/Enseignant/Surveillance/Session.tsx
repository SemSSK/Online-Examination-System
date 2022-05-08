import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EtudiantCard from "./EtudiantCard";


const Session : React.FC<{socket,code,session,ListEtudiant}> = (props)=>{
    const navigate = useNavigate();
    
    const getSessionState = ()=>{
        return props.session.state;
    }

    const startSession = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url,{},{withCredentials:true});
    } 

    const endSession = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/advance-state`;
        axios.put(url,{},{withCredentials:true})
        .then(response => {
            if(response.status !== 200){
                throw(response.data);
            }
            props.socket.close();
            navigate("/enseignant");
        })
    }

    return(
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={11}></Grid>
                    <Grid item xs={1}>
                        { (getSessionState() === "OPENED") && <Button variant="contained" onClick={(e)=>{startSession()}}>start Session</Button>}
                        { (getSessionState() === "STARTED") && <Button variant="contained" onClick={(e)=>{endSession()}}>end Session</Button>}
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid container>
                    {props.ListEtudiant.map(e => {
                        return (
                            <Grid item xs={3} key={e.userId}>
                                <EtudiantCard presence={e} code={props.code}></EtudiantCard>
                            </Grid>
                            )
                    })}
                    
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Session;