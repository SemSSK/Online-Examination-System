
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import {Container, Select, MenuItem, FormControl, InputLabel, Grid, Typography, Checkbox, Button} from "@mui/material";
import React,{useState,useEffect} from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import EtudiantList from "./EtudiantList";
import { Box } from "@mui/system";
import EnseignantList from "./EnseignantList";
import StudentSelections from "./StudentSelections";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import styles from "../AffectationModule/styles.module.css";
import formStyle from "./formStyle.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {styled} from "@mui/material/styles";
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import IconButton from "@mui/material/IconButton";
import ProctorSelections from "./ProctorSelections";


const getModules =(setModuleList)=>{
    const url = "http://localhost:8080/admin/module"
    axios.get(url,{ withCredentials:true})
    .then(response => {
        if(response.status === 200){
            setModuleList(response.data);
        }
    })
}

// const getEtudiants = (setEtudiantList)=>{
//     const url = "http://localhost:8080/admin/etu";
//     axios.get(url,{withCredentials:true})
//     .then(response=>{
//         if(response.status === 200){
//             setEtudiantList(response.data);
//         }
//         else{
//             throw response.status;
//         }
//     })
//     .catch(error=>{
//         console.log(error);
//     })
// }

const getEnseignant = (setEnseignantList)=>{
    const url = "http://localhost:8080/admin/ens";
    axios.get(url,{withCredentials:true})
    .then(response=>{
        if(response.status === 200){
            setEnseignantList(response.data);
        }
        else{
            throw response.data;
        }
    })
    .catch(error=>{ 
        console.log(error);
    })
}

const getSessions = (id,onFieldChange)=>{
    const url = `http://localhost:8080/admin/planning/session/${id}`;
    axios.get(url,{withCredentials:true})
    .then(response => {
        if(response.status === 200){
            onFieldChange({sessionExamens:response.data});
        }
        else{
            throw response.data;
        }
    })
    .catch(error=>{ 
        console.log(error);
    }) 
}

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(-90deg)' : 'rotate(90deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const PlanningForm = ({onFieldChange,appointmentData,...restProps}) => {

    const [moduleList,setModuleList] = useState([]);
    const [etudiantList,setEtudiantList] = useState([]);
    const [affectedEnseigantList,setAffectedEnseignantList] = useState([]);
    const [affectedEtudiantList,setAffectedEtudiantList] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleExpand2Click = () => {
        setExpanded2(!expanded2);
    };
    useEffect(()=>{
        getModules(setModuleList);
        // getEtudiants(setEtudiantList);
        // getEnseignant(setEnseignantList);
        if(appointmentData.id !== undefined){ 
            getSessions(appointmentData.id,onFieldChange);
        }
        else {
            onFieldChange({etudiants:[],sessionExamens:[]}); 
        }
        console.log(appointmentData);
    },[])

    useEffect(() => {
        appointmentData.etudiants = affectedEtudiantList;
        onFieldChange({etudiants: affectedEtudiantList});
        console.log(appointmentData)
    },[affectedEtudiantList])

    useEffect(() => {

        const examSessionsList = affectedEnseigantList.map((enseignant)=>{
            return  {
                            surveillant: enseignant
                     }
        })

        appointmentData.sessionExamens = examSessionsList;
        onFieldChange({sessionExamens: examSessionsList});
        console.log(appointmentData)
    },[affectedEnseigantList])

    function handleEtudiantsAffectation (newList){
        setAffectedEtudiantList(newList);
    }

    function handleEnseignantsAffectation (newList){
        setAffectedEnseignantList(newList);
    }

    const onModuleChange = (event)=>{
        const module = event.target.value;
        console.log(module);
        onFieldChange({title:module.nomModule,module: module});
        console.log(appointmentData) 
    }

    const onStartDateChange = (nextValue)=>{
        onFieldChange({startDate:nextValue});
        console.log(appointmentData)
    }

    const onEndDateChange = (nextValue)=>{
        onFieldChange({endDate:nextValue});
        console.log(appointmentData)
    }



    return (
        <Paper elevation={0}>
            <Grid  marginTop={"7%"}  marginX={"2%"} >
                <FormControl sx={{width: 1/1}}>
                    <Grid constainer>
                        <Grid item xs={1}>
                            <label className={formStyle.formDateLabel}>Choose Module :</label>
                        </Grid>
                        <Grid item xs={11}>
                            <Select variant="standard" value={appointmentData.module} label="Module" sx={{width : 1/1}} onChange={e=>{onModuleChange(e)}}>
                                {moduleList.map(module=>{
                                    return <MenuItem value={module} key={module.id}>{module.nomModule}</MenuItem>
                                })}
                            </Select>
                        </Grid>
                    </Grid>
                </FormControl>
            </Grid>
            
            <Grid container marginTop={"5%"}  marginX={"2%"} columns={16} alignItems="flex-end">


                    <Grid item xs={2} >
                        <label className={formStyle.formDateLabel}>Start Time :</label>
                    </Grid>
                    <Grid item xs={6}>
                           <AppointmentForm.DateEditor onValueChange={onStartDateChange} value={appointmentData.startDate}></AppointmentForm.DateEditor>
                    </Grid>
                    <Grid item xs={2} >
                        <label className={formStyle.formDateLabel}>End Time :</label>
                    </Grid>
                    <Grid item xs={6}>
                        <AppointmentForm.DateEditor onValueChange={onEndDateChange} value={appointmentData.endDate}></AppointmentForm.DateEditor>
                    </Grid>
                </Grid>

            <Grid container marginTop={"5%"}>
                <div className={formStyle.affectationButtonContainer}>
                    <div className={styles.btns}>
                        <a className={styles.btn +' '+ styles.bg} onClick={handleExpandClick}>Affecter Les Etudiants</a>
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

                            <StudentSelections
                                setNewEtudiantAffectationList={handleEtudiantsAffectation}
                                handleExpandClick={handleExpandClick}
                                expanded={expanded}

                            />
                        </Collapse>
                    </Card>

                </div>
            </Grid>


            <Grid container marginTop={"5%"}>
                <div className={formStyle.affectationButtonContainer}>
                    <div className={styles.btns}>
                        <a className={styles.btn +' '+ styles.bg} onClick={handleExpand2Click}>Affecter Les Surveillants</a>
                        <ExpandMore
                            expand={expanded2}
                            onClick={handleExpand2Click}
                            aria-expanded={expanded2}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </div>
                    <Card >
                        <Collapse in={expanded2} timeout="auto" unmountOnExit>

                            <ProctorSelections
                                setNewProctorAffectationList={handleEnseignantsAffectation}
                                handleExpandClick={handleExpand2Click}
                                expanded={expanded2}

                            />
                        </Collapse>
                    </Card>

                </div>
            </Grid>


        </Paper>
    );
};
export default PlanningForm;
