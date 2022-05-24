import React,{useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
// import AffectationForum from './AffectationForum'
// import AffectationPage from './AffectationPage'
import avatar from './avatar.png'
import logo from './StartCodingClubLogo.png'
import newStyle from './newStyle.module.css'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Avatar from '@mui/material/Avatar';
import Schedual from "../Etudiant/Planning/Schedual";

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

function App() {

const [expanded,setExpanded] = useState(false);
const [expandedClass,setExpandedClass] = useState('');
  useEffect(()=>{
    if(expanded)
      setExpandedClass(newStyle.expanded)
    else
      setExpandedClass('')

  },[expanded])
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
          <div className={newStyle.menuItem}>
            <Avatar className={newStyle.itemAvatar} sx={{backgroundColor: '#61718a', width:'65px', height:'65px' }}>
              <IconButton>
                <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>
              </IconButton>
            </Avatar>
            
            <div className={newStyle.itemTitle}>
                <h3>Schedule</h3>
            </div>
          </div>
          <div className={newStyle.menuItem}>
            <Avatar className={newStyle.itemAvatar} sx={{backgroundColor: '#61718a', width:'65px', height:'65px' }}>
            <IconButton>
              <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>
            </IconButton>
            </Avatar>
            
            <div className={newStyle.itemTitle}>
                <h3>Schedule</h3>
            </div>
          </div>
          <div className={newStyle.menuItem}>
            <Avatar className={newStyle.itemAvatar} sx={{backgroundColor: '#61718a', width:'65px', height:'65px' }}>
            <IconButton>
              <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>
            </IconButton>
            </Avatar>
            
            <div className={newStyle.itemTitle}>
                <h3>Schedule</h3>
            </div>
          </div>

          <div className={newStyle.menuItem}>
            <Avatar className={newStyle.itemAvatar} sx={{backgroundColor: '#61718a', width:'65px', height:'65px' }}>
            <IconButton>
              <DateRangeIcon style={{ fontSize: 45, color: '#e6e6ea' }}/>
            </IconButton>
            </Avatar>
            
            <div className={newStyle.itemTitle}>
                <h3>Schedule</h3>
            </div>
          </div>
     
        </div>
        <div className={newStyle.systemLogo}>
          <div className={newStyle.logo }>
            <img src={logo} alt="logo image" />
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
              {/* <div className={newStyle.logo}>
                <img src={logo} alt="logo image" />

              </div>  */}
              <ul className={newStyle.nav_list}>
                <li className={newStyle.nav_item}>
                  <div className={newStyle.logo}>
                    <img src={avatar} alt="profile logo" />
                  </div>
                  <div className={newStyle.profileUsername}>
                    <a href="#" className={newStyle.nav_link}> 
                    Saada Khekhal Sem
                    </a>
                  </div>
                  <div className={newStyle.userProfile}>
                    <IconButton size='medium' color="inherit">
                      <ArrowDropDownCircleIcon fontSize='medium'/>
                    </IconButton>
                  </div>
                </li>
                {/* <li className={newStyle.module}>
                  <div className={newStyle.circle}></div>
                  <div className={newStyle.moduleTitle}>
                    <h1>Module</h1>
                  </div>
                </li> */}
                <li className={newStyle.logoutButton}> 
                  <a href="#" className={newStyle.button_17}> 
                      Logout
                  </a>
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

export default App;
