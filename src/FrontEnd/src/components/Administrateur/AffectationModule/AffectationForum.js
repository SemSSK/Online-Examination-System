import styles from "./styles.module.css";
import styleSwitchButton from "./styleSwitchButton.module.css";
import "./react-select-search.css"
import SelectSearch from "react-select-search";
import React, { useRef,useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from './api/backendRestApi';
import axios from "axios";



const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AffectationForum({enseignements,setEnseignements}) {
  const [expanded, setExpanded] = React.useState(false);
    const [expandedClass, setExpandedClass] = React.useState('');

  const handleExpandClick = () => {
  setExpandedClass(!expanded ? styles.buttonOpned : ' ')
    setExpanded(!expanded);

  };
  
  


  const [cours,setCours] = useState("true");
  const searchInput = useRef();
  const search2Input = useRef();
  const [selectedModule,setSelectedModule] = useState("");
  const [selectedTeacher,setSelectedTeacher] = useState("");

  const [teachers, setTecahers] = useState([]);
  const [modules, setModules] = useState([]);
  const [teachersOptions, setTeachersOptions] = useState([]);
  const [modulesOptions, setModulesOptions] = useState([]);

  useEffect(() => {

    fetchModules();
    fetchTeachers();  
  
  },[]);

  useEffect(() => {
    renderModulesByLevels();
  },[modules])

  useEffect(()=>{
    renderTeachers();
  },[teachers])

  useEffect(() => {
    console.log("value: ",selectedModule);
    console.log("value: ",selectedTeacher);

  },[selectedModule,selectedTeacher])

  const fetchModules = async () => {

    try{
        const url = "http://localhost:8080/admin/module";
        const response =  await axios.get(url,{ withCredentials:true})
        
        if(response && response.data ) {
            setModules(response.data);
            // renderLevels();
            console.log("setted modules");
            // console.log(modules);
            // console.log(modulesOptions)
            
        }
        
      } catch(err) {
          if(err.response){
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
          }else{
              console.log(`Error: ${err.message}`);
          }

      }
  }
  
  const fetchTeachers = async () => {
    try {
        const response = await api.get('/admin/ens')
        if(response && response.data){
            setTecahers(response.data);
        }
    } catch(err){
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        }else{
            console.log(`Error: ${err.message}`);
        }

    }
  }

  async function addAffectationToDB(){

    const type = cours ? "COURSE" : "TD_TP";
    const affectationObject = 
      {
          "affectationModuleId": {
            "enseignantId": selectedTeacher,
            "moduleId": selectedModule
          },
          "type": type
      }
      try{
        const response = await api.post('/admin/affectationModule',affectationObject)
        setEnseignements((enseignements)=> ([...enseignements, response.data]))
        setSelectedModule(null);
        setSelectedTeacher(null);
      } catch (err){
        console.log(`Error: ${err.message}`);
      }
  }

  function renderOptions(props, option, snapshot, className) {
    const imgStyle = {
        borderRadius: '50%',
        verticalAlign: 'middle',
        marginRight: 10,
    };

    return (
        <button {...props} className={className} type="button">
            <span><img alt="" style={imgStyle} width="32" height="32" src={option.photo} /><span>{option.name}</span></span>
        </button>
    );
  }

  const handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return modulesOptions;
      }
      const updatedItems = items.map((list) => {
        const newItems = list.items.filter((item) => {
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        return { ...list, items: newItems };
      });
      return updatedItems;
    };
  };

  const handleProfFilter = (items) => {
    
    return (searchValue) => {
      if (searchValue.length === 0) {
        return teachersOptions;
      }
      const updatedItems = items.filter((item) => {
          console.log('item: ',item);
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      return updatedItems;
    };
  };


  const renderModulesByLevels  =  ( () => {
    // console.log("1- ", modules);
    const levels =  [...new Set(modules.map(item => item.niveau))];
    // console.log("2- ", levels);
    levels.forEach((item) => {
      console.log(item);
       setModulesOptions( (prev) => {
         return (
        [
          ...prev,
          {
            type: "group",
            name: item,
            items:[]
          }
        ])
      })
    })
    // console.log("3- ", levels);
    modules.forEach((module) => {
       setModulesOptions((prevModulesOptions) => { 
          const newModulesOptions = prevModulesOptions;
          newModulesOptions.forEach(element => {
          if(element.name === module.niveau){
            element.items = [
              ...element.items, 
              {
                name : module.nomModule,
                value : module.id
              }
            ]
          }
      }
          )
          return newModulesOptions;
      })
    });
    // console.log('les options: ',modulesOptions);
   
  });

  const renderTeachers  =  ( () => {

    // const levels =  [...new Set(teachers.map(item => item.niveau))];
    // console.log("2- ", levels);

    // levels.forEach((item) => {
    //   console.log(item);
    //    setTeachersOptions( (prev) => {
    //      return (
    //     [
    //       ...prev,
    //       {
    //         type: "group",
    //         name: item,
    //         items:[]
    //       }
    //     ])
    //   })
    // })
    // console.log("3- ", levels);
    let newTeachersOptions = []
    teachers.forEach((teacher) => {

       newTeachersOptions = 
        [
          ...newTeachersOptions,
          {
            name : `${teacher.lastName} ${teacher.name}`,
            value : teacher.userId,
            photo : "https://randomuser.me/api/portraits/men/34.jpg"
          }
        ]
    });
    
    setTeachersOptions(newTeachersOptions)
   
  });



 
  return (
    <div>    
      <div className={styles.btns}>
        <a className={styles.btn +' '+ styles.bg + ' '+ expandedClass} onClick={handleExpandClick}>Ajouter Affectation</a>
        <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
        </ExpandMore>
      </div>
      <Card >
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className={styles.affectationContainer}>
              {/*<div className={styles.affectationForum}>*/}
                  <SelectSearch
                      ref={searchInput}
                      options={modulesOptions}
                      filterOptions={handleFilter}
                      value={selectedModule}
                      name="module"
                      placeholder="Choose a module"
                      search
                      onChange={setSelectedModule}
                      closeOnSelect={true}

                  />
              
                  <SelectSearch
                      ref={search2Input}
                      options={teachersOptions}
                      renderOption={renderOptions}
                      filterOptions={handleProfFilter}
                      value={selectedTeacher}
                      name="enseignant"
                      placeholder="Choose a teacher"
                      search
                      onChange={setSelectedTeacher}
                      closeOnSelect={true}
                  />
                  <div className={styleSwitchButton.switch_button}>
                      <input className={styleSwitchButton.switch_button_checkbox}
                          type="checkbox" 
                          onClick={(event)=> setCours(!event.target.checked)}
                      >   
                      </input>
                      <label className={styleSwitchButton.switch_button_label} ><span className={styleSwitchButton.switch_button_label_span}>COURS</span></label>
                  </div>
              {/*</div>*/}
              <Divider orientation="vertical" flexItem />
              <div className={styles.affectationSubmit}>
                <button className={styles.button_29} role="button" onClick={addAffectationToDB}>Affecter</button>
              </div>
          </div>
        </Collapse>
      </Card>

      
    </div>
  );
}


