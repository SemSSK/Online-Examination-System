import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const JoinExamRoom = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/examRoom");
        if (ws !== null) {
            ws.onmessage = e => {
                const data = JSON.parse(e.data);
                if (data.type === "message") {
                    props.setInSession(false);
                    alert(data.payload);
                }
                else if (data.type === "data") {
                    props.setPresence(data.payload);
                    console.log(data.payload);
                }
                else if (data.type === "blocked") {
                    ws.close();
                    alert(data.payload);
                }
                console.log(data);
            };
            ws.onclose = e => {
                navigate("/etudiant");
            };
            props.setSocket(ws);
        }
    }, []);
    const joinSession = () => {
        props.setInSession(true);
        props.socket.send(props.code);
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
