import { Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LogOut from "../Authentication/LogOut";
import { Box } from "@mui/system";
import Schedual from "./Planning/Schedual"
import Profile from "../Profile";
import { PlayArrow } from "@mui/icons-material";


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


const Etudiant = () => {
    const navigate = useNavigate();
    const classes = useStyle();

    const menuItems = [
        {
            text: 'Schedual',
            icon: <DateRangeIcon/>,
            path: "/etudiant/schedual",
            alwaysShow: true
        },
        {
            text: 'Join exam',
            icon: <PlayArrow/>,
            path: "/examroom",
            alwaysShow: true
        }
    ];

    
    const goTo = (item) => {
        navigate(item.path);
    };

    return (
                <>
                    <Box sx={{ flexGrow: 1 }} position={"fixed"} width={"100%"} top={0}>
                        <AppBar position="static">
                            <Toolbar>
                                <Grid container alignItems={"center"} justifyContent={"end"}>
                                    <Grid item xs={2} display={"flex"} justifyContent={"end"}>
                                        <Profile></Profile>
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
                                            return (<ListItem key={item.text} button onClick={(e) => { goTo(item); }}>
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
                                    <Route path="/schedual" element={<Schedual></Schedual>}></Route>
                                </Routes>
                            </Grid>
                        </Grid>
                    </Box>
        </>
    );
}
 
export default Etudiant;