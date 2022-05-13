import { Videocam } from "@mui/icons-material";
import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Copie from "./Copie";
import VideoSending from "./VideoSending"

const ExamRoom = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [copy, setCopy] = useState({});
    const navigate = useNavigate();

    const canAskForCopy = () => {
        return !(props.presence.sessionExamen.state === "STARTED" && props.presence.state === "PRESENT");
    };
    const canPostCopy = () => {
        return !(props.presence.state === "PRESENT");
    };

    const getCopy = () => {
        const url = `http://localhost:8080/etudiant/examen/${props.code}`;

        axios.post(url, {}, { withCredentials: true })
            .then(response => {
            let examen = response.data;
            const numberOfQuestions = examen.examenQuestions.length;
            let copy = {
                exam: examen,
                reponses: new Array(numberOfQuestions)
            };
            for (let i = 0; i < numberOfQuestions; i++) {
                copy.reponses[i] = {
                    content: '',
                    question: examen.examenQuestions[i].question
                };
            }
            setCopy(copy);
            setIsLoading(true);
        });
    };
    const postCopy = () => {
        const url = `http://localhost:8080/etudiant/examen/${props.code}/copie`;
        axios.post(url, JSON.stringify(copy), { withCredentials: true, headers: {
                'Content-Type': 'application/json'
            } })
            .then(response => {
            console.log(response.data);
            props.socket.close();
            navigate("/etudiant");
        })
            .catch(error => {
            console.log(error);
        });
    };

    return (<Box minWidth={"100vw"} height={"100vh"} display={"flex"} justifyContent={"center"}>
                {props.presence !== null ?
                    <>
                        <Box sx={{ flexGrow: 1 }} position={"fixed"} width={"100%"} top={0}>
                            <AppBar position="static">
                                <Toolbar>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <Typography>
                                                nom:{props.presence.etudiant.name}
                                            </Typography>
                                            <Typography>
                                                prenom:{props.presence.etudiant.lastName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography>
                                                Presence:{props.presence.state}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                        </Grid>
                                        <Grid item xs={1}>
                                            {!isLoading && <Button variant="contained" disabled={canAskForCopy()} onClick={e => { getCopy(); }}>
                                                    Demander copie
                                                </Button>}
                                            {isLoading && <Button variant="contained" disabled={canPostCopy()} onClick={e => { postCopy(); }}>
                                                    Rendre copie
                                                </Button>}
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                            </AppBar>
                        </Box>
                        <Grid container width={"90%"} marginTop={"5%"}>
                            <Grid item xs={3} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Box width={"400px"} height={"400px"}>
                                    <VideoSending 
                                    setVideoState={props.setVideoState}
                                    socket={props.socket} 
                                    surveillant={props.presence.sessionExamen.surveillant}
                                    setPeer={props.setPeer}>
                                    </VideoSending>
                                </Box>
                            </Grid>
                            <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                                {isLoading && <Copie code={props.code} copy={copy} setCopy={setCopy}></Copie>}
                            </Grid>
                        </Grid>
                    </> : 
                        <Typography>
                            Please wait...
                        </Typography>}
        </Box>);
};
export default ExamRoom;
