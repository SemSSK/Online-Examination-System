import { Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogOut from "../Authentication/LogOut";
import { Box } from "@mui/system";
import Planning from "./Planning/Planning"
import Profile from "../Profile";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AffectationPage from "./AffectationModule/AffectationPage";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import {Listenseignant} from "./GesEnseignant/Listenseignant";
import {Listetudiant} from "./GesEtudiant/Listetudiant";
import {Listmodule} from "./GesModule/Listmodule";
import AddModule from "./GesModule/AddModule";
import Addensienant from "./GesEnseignant/Addensienant";
import AddEtudiant from "./GesEtudiant/AddEtudiant";

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

const Administrateur = () => {

    const navigate = useNavigate();
    const classes = useStyle();

    const menuItems = [
        {
            text: 'Schedual',
            icon: <DateRangeIcon />,
            path: "/admin/schedual",
            alwaysShow: true
        },
        {
            text: 'Gestion des modules',
            icon: <AttachFileIcon/>,
            path: "/admin/listmodule",
            alwaysShow:true
        },
        {
            text: 'Gestion des enseignant',
            icon: <SchoolIcon/>,
            path: "/admin/listenseignant",
            alwaysShow:true
        },
        {
            text: 'Gestion des etudiant',
            icon: <ManageAccountsIcon/>,
            path: "/admin/listetudiant",
            alwaysShow:true
        },
        {
            text: 'Affectation a module',
            icon: <CompareArrowsIcon/>,
            path: "/admin/affectationModule",
            alwaysShow:true
        },
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

                                    <Route path="/schedual" element={<Planning></Planning>}></Route>
                                    <Route path="/affectationModule" element={<AffectationPage></AffectationPage>}></Route>

                                    <Route  path='/listmodule' element={<Listmodule/>} ></Route>
                                    <Route path='/add_module' element={<AddModule/>}></Route>
                                    <Route path='/edit_module/:id' element={<AddModule/>}></Route>

                                    <Route  path='/listenseignant' element={<Listenseignant/>} ></Route>
                                    <Route path='/add_enseignant' element={<Addensienant/>}></Route>
                                    <Route path='/edit-enseignant/:userId' element={<Addensienant/>}></Route>

                                    <Route  path='/listetudiant' element={<Listetudiant/>} ></Route>
                                    <Route path='/add_etudiant' element={<AddEtudiant/>}></Route>
                                    <Route path='/edit-etudiant/:userId' element={<AddEtudiant/>}></Route>

                                </Routes>
                            </Grid>
                        </Grid>
                    </Box>
        </>
    );
}
 
export default Administrateur;