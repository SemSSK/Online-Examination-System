import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';

import Schedual from "./Planning/Schedual"
import Profile from "../Profile";
import newStyle from "../appStyling/newStyle.module.css";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../appStyling/StartCodingClubLogo.png";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";



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


const Etudiant = () => {
    const navigate = useNavigate();
    const [expanded,setExpanded] = useState(false);
    const [expandedClass,setExpandedClass] = useState('');
    useEffect(()=>{
        if(expanded)
            setExpandedClass(newStyle.expanded)
        else
            setExpandedClass('')

    },[expanded])

    const menuItems = [
        {
            text: 'Schedule',
            icon: <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/etudiant/schedual",
            alwaysShow: true
        },
        {
            text: 'Start Exam',
            icon: <PlayArrowIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: '/examroom',
            alwaysShow: true
        }
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
        <section className={newStyle.sidebarContainer}>
            <nav className={newStyle.main_menu +' '+ expandedClass}>
                <div className={newStyle.iconExpanding}>
                    <ExpandMore
                        expand={expanded}
                        onClick={()=>setExpanded(!expanded)}
                    >
                        <ExpandMoreIcon fontSize='medium'/>
                    </ExpandMore>
                </div>
                <div className={newStyle.menuList}>
                                {
                                    menuItems.map((item, index) => {
                                        return (
                                            <div key={index} className={newStyle.menuItem} onClick={() => { goTo(item); }}>
                                                <Avatar className={newStyle.itemAvatar} sx={{backgroundColor: '#61718a', width:'65px', height:'65px' }}>
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
                    <div className={newStyle.logo }>
                        <img src={logo} alt="logo" />
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
                                <Profile />
                                <li className={newStyle.logoutButton}>
                                    <button className={newStyle.button_17} onClick={()=>logout()}>
                                        Logout
                                    </button>
                                </li>
                            </ul>

                        </div>
                    </div>
                </header>
                <div>
                    <Schedual></Schedual>
                </div>
            </main>
        </section>
    );
}
 
export default Etudiant;