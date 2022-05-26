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
import formStyle from "./Planning/formStyle.module.css";
import newStyle from "../appStyling/newStyle.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import logo from "../appStyling/StartCodingClubLogo.png";
import axios from "axios";
import {styled} from "@mui/material/styles";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton  size="medium"  color="inherit"  {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(-90deg)' : 'rotate(90deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Administrateur = () => {

    const navigate = useNavigate();
    const [expanded,setExpanded] = useState(false);
    const [expandedClass,setExpandedClass] = useState('');
    const [expandedMainClass,setExpandedMainClass] = useState('');
    useEffect(()=>{
        if(expanded) {
            setExpandedClass(newStyle.expanded)
            setExpandedMainClass(formStyle.mainExpanded)
        }else {
            setExpandedClass('')
            setExpandedMainClass('')
        }
    },[expanded])

    const menuItems = [
        {
            text: 'Schedule',
            icon: <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/admin/schedual",
            alwaysShow: true
        },
        {
            text: 'Modules',
            icon: <AttachFileIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/admin/listmodule",
            alwaysShow:true
        },
        {
            text: 'Teachers',
            icon: <SchoolIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/admin/listenseignant",
            alwaysShow:true
        },
        {
            text: 'Students',
            icon: <ManageAccountsIcon  style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/admin/listetudiant",
            alwaysShow:true
        },
        {
            text: 'Teaching Affectations',
            icon: <CompareArrowsIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/admin/affectationModule",
            alwaysShow:true
        },
    ];

    const logout = () => {
        axios.post("http://localhost:8080/logout", null, { withCredentials: true }).then(response => {
            if (response.status === 200) {
                navigate("/login");
            }
            else {
                throw response.data;
            }
        })
            .catch(e => {
                console.log(e);
            });
    };
    
    const goTo = (item) => {
        navigate(item.path);
    };

    return (
            <section className={newStyle.sidebarContainer + ' ' + expandedMainClass}>
                        <nav className={newStyle.main_menu + ' ' + expandedClass}>
                            <div className={newStyle.iconExpanding}>
                                <ExpandMore
                                    expand={expanded}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    <ExpandMoreIcon fontSize='medium'/>
                                </ExpandMore>
                            </div>
                            <div className={newStyle.menuList}>
                                {
                                    menuItems.map((item, index) => {
                                        return (
                                            <div key={index}
                                                 className={newStyle.menuItem }
                                                 onClick={() => {
                                                     goTo(item);
                                                 }}
                                            >
                                                <Avatar className={newStyle.itemAvatar}
                                                        sx={{backgroundColor: '#61718a', width: '65px', height: '65px'}}>
                                                    <IconButton>
                                                        {item.icon}
                                                    </IconButton>
                                                </Avatar>

                                                <div className={newStyle.itemTitle}>
                                                    <h3>{item.text}</h3>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className={newStyle.systemLogo}>
                                <div className={newStyle.logo}>
                                    <img src={logo} alt="logo image"/>
                                </div>
                                <div className={newStyle.systemTitle}>
                                    <h1><span>E</span>-EXAM</h1>
                                </div>
                            </div>
                        </nav>

                        <main className={newStyle.container__main}>
                            <header id={newStyle.customNavigationBar}>
                                <div className={newStyle.navContainer}>
                                    <div className={newStyle.nav_bar}>
                                        <ul className={newStyle.nav_list}>
                                            <Profile/>
                                            <li className={newStyle.logoutButton}>
                                                <a href="#" className={newStyle.button_17} onClick={()=>logout()}>
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </header>
                            <div>
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
                            </div>
                        </main>
                    </section>
    );
}
 
export default Administrateur;