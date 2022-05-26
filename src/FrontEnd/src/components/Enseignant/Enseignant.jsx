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
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogOut from "../Authentication/LogOut";
import { Box } from "@mui/system";
import Module from "./Module/Module";
import axios from "axios";
import Profile from "../Profile";
import Examen from "./Examen/Examen";
import Planning from "./Planning/Planning"
import Correction from "./Correction/Correction";
import CorrectionForm from "./Correction/CorrectionForm";
import newStyle from "../appStyling/newStyle.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import logo from "../appStyling/StartCodingClubLogo.png";
import {styled} from "@mui/material/styles";

// const useStyle = makeStyles((theme) => {
//     return {
//         drawer: {
//             width: "15%",
//             position:"fixed"
//         },
//         appBar: {
//             width: "85%",
//             position:"fixed"
//         }
//     };
// });

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

const Enseignant = () => {
    const navigate = useNavigate();
    const [affectationModule, setAffectationModule] = useState();
    const [currentModule, setCurrentModule] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
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
            path: "/enseignant/schedual",
            alwaysShow: true
        },
        {
            text: 'Question Manager',
            icon: <QuestionMarkIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/enseignant/questions",
            alwaysShow: true
        },
        {
            text: 'Exam Manager',
            icon: <QuizIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: "/enseignant/exam",
            alwaysShow: false
        },
        {
            text: 'Lancer un Examen',
            icon: <PlayArrowIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>,
            path: '/surveillant',
            alwaysShow: true
        },
        {
            text: 'Corriger copies',
            icon: <RateReviewIcon/>,
            path: '/enseignant/correction',
            alwaysShow: currentModule !== null
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

    useEffect(() => {
        const AffectationsURL = "http://localhost:8080/enseignant/module";
        axios.get(AffectationsURL, { withCredentials: true })
            .then(response => {
            if (response.data instanceof Array && response.data.length > 0) {
                setAffectationModule(response.data);
                console.log(affectationModule);
                setCurrentModule(response.data[0]);
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



    return (
        <>
            {
                isLoaded ?
                    <section className={newStyle.sidebarContainer}>
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
                                        console.log("value: ",currentModule)
                                        const examManager = (!item.alwaysShow && !(currentModule.type === "COURSE"))  ? newStyle.disableItem : ''
                                        return (
                                            <div key={index}
                                                 className={newStyle.menuItem + ' ' + examManager }
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
                                            <li>
                                                <Module affectationList={affectationModule} currentModule={currentModule} setCurrentModule={setCurrentModule}></Module>
                                            </li>
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
                                        <Route path="/questions" element={<QuestionConsultation
                                            currentAffectation={currentModule}></QuestionConsultation>}></Route>
                                        <Route path="/questions/add" element={<QuestionCreator
                                            currentAffectation={currentModule}></QuestionCreator>}></Route>
                                        {(currentModule.type === "COURSE") && <Route path="/exam" element={<Examen
                                            currentAffectation={currentModule}></Examen>}></Route>}
                                        <Route path="/correction" element={<Correction currentModule={currentModule.module}></Correction>}></Route>
                                        <Route path='/correction/:copieId' element={<CorrectionForm></CorrectionForm>}></Route>
                                    </Routes>

                            </div>
                        </main>
                    </section>
                : <></>
            }
        </>
    );
};
export default Enseignant;
