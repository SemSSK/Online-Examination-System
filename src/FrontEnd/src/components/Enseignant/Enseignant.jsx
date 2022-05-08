import { Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import QuestionConsultation from "./Questions/QuestionConsultation/QuestionConsultation";
import QuestionCreator from "./Questions/QuestionCreator/QuestionCreator";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuizIcon from '@mui/icons-material/Quiz';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LogOut from "../Authentication/LogOut";
import { Box } from "@mui/system";
import Module from "./Module/Module";
import axios from "axios";
import Profile from "./Profile";
import Examen from "./Examen/Examen";
import Planning from "./Planning/Planning";
const useStyle = makeStyles((theme) => {
    return {
        drawer: {
            width: "15%"
        },
        appBar: {
            width: "85%"
        }
    };
});
const Enseignant = () => {
    const navigate = useNavigate();
    const classes = useStyle();
    const [affectationModule, setAffectationModule] = useState();
    const [currentModule, setCurrentModule] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [enseignant, setEnseigant] = useState({});
    const menuItems = [
        {
            text: 'Schedule',
            icon: <DateRangeIcon />,
            path: "/enseignant/schedule",
            alwaysShow: true
        },
        {
            text: 'Question Manager',
            icon: <QuestionMarkIcon />,
            path: "/enseignant/questions",
            alwaysShow: true
        },
        {
            text: 'Exam Manager',
            icon: <QuizIcon />,
            path: "/enseignant/exam",
            alwaysShow: false
        },
        {
            text: 'Lancer un Examen',
            icon: <PlayArrowIcon />,
            path: '/surveillant',
            alwaysShow: true
        }
    ];
    useEffect(() => {
        const AffectationsURL = "http://localhost:8080/enseignant/module";
        axios.get(AffectationsURL, { withCredentials: true })
            .then(response => {
            if (response.data instanceof Array && response.data.length > 0) {
                setAffectationModule(response.data);
                console.log(affectationModule);
                setCurrentModule(response.data[0]);
                setEnseigant(response.data[0].enseignant);
            }
            setIsLoaded(true);
        })
            .catch(error => {
            console.log(error);
        });
    }, []);
    const goTo = (item) => {
        navigate(item.path);
    };
    return (<div className="enseignant-container">
            {isLoaded &&
            <>
                <Box sx={{ flexGrow: 1 }} position={"fixed"} width={"100%"} top={0}>
                    <AppBar position="static">
                        <Toolbar>
                            <Grid container alignItems={"center"} justifyContent={"end"}>
                                <Grid item xs={1}>
                                    <Module affectationList={affectationModule} currentModule={currentModule} setCurrentModule={setCurrentModule}></Module>
                                </Grid>
                                <Grid item xs={2} display={"flex"} justifyContent={"end"}>
                                    <Profile enseigant={enseignant}></Profile>
                                </Grid>
                                <Grid item xs={1} display={"flex"} justifyContent={"end"}>
                                    <LogOut></LogOut>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Drawer variant="permanent" anchor="left" classes={{ paper: classes.drawer }}>
                                <Typography variant="h3" color="primary">
                                    Options
                                </Typography>
                                <List>
                                    {menuItems.map(item => {
                    return (<ListItem key={item.text} button disabled={!(item.alwaysShow || (currentModule.type === "COURS"))} onClick={(e) => { goTo(item); }}>
                                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                                    <ListItemText primary={item.text}></ListItemText>
                                                </ListItem>);
                })}
                                </List>
                </Drawer>
                <Box width={"80%"} marginLeft={"15%"} marginTop={"5%"}>
                    <Grid container justifyContent={"center"} alignContent={"start"}>
                        <Grid item xs={12}>
                            <Routes>
                                <Route path="/schedule" element={<Planning></Planning>}></Route>
                                <Route path="/questions" element={<QuestionConsultation currentAffectation={currentModule}></QuestionConsultation>}></Route>
                                <Route path="/questions/add" element={<QuestionCreator currentAffectation={currentModule}></QuestionCreator>}></Route>
                                {(currentModule.type === "COURS") && <Route path="/exam" element={<Examen currentAffectation={currentModule}></Examen>}></Route>}
                            </Routes>
                        </Grid>
                    </Grid>
                </Box>
            </>}
        </div>);
};
export default Enseignant;
