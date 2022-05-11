import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimplePeer from "simple-peer";

const JoinSession = (props) => {
    const navigate = useNavigate();


    

    const joinSession = () => {
        props.socket.send(JSON.stringify({
            type:"code",
            payload:props.code
        }));
    };
    
    return (<Grid container display={"flex"} justifyContent={"center"}>
            <Grid item xs={4}>
                <Card variant="outlined">
                    <CardHeader title={"Entrer votre code de surveillant:"}></CardHeader>
                    <CardContent>
                        <TextField variant="outlined" placeholder="code surveillant" fullWidth onChange={(e) => {
            props.setCode(e.target.value);
        }}>
                        </TextField>
                    </CardContent>
                    <CardContent style={{ margin: "auto" }}>
                        <Button variant="outlined" onClick={(e) => {
            joinSession();
        }}>
                            Start
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>);
};
export default JoinSession;
