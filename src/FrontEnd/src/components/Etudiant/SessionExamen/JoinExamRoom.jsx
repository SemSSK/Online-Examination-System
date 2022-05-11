import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const JoinExamRoom = (props) => {

    const navigate = useNavigate();

    const joinSession = () => {
        props.setInSession(true);
        props.socket.send(JSON.stringify({
            type:"code",
            payload:props.code
        }));
    };
    
    return (<Grid container display={"flex"} justifyContent={"center"}>
            <Grid item xs={4}>
                <Card variant="outlined">
                    <CardHeader title={"Entrer le code de l'examen:"}></CardHeader>
                    <CardContent>
                        <TextField variant="outlined" placeholder="code examen" fullWidth onChange={(e) => {
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
export default JoinExamRoom;
