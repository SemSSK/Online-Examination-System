
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { Container,Select,MenuItem,FormControl,InputLabel,Grid, Typography, Checkbox} from "@mui/material";
import React,{useState,useEffect} from "react";
import axios from "axios";
import EtudiantList from "./EtudiantList";
import { Box } from "@mui/system";
import EnseignantList from "./EnseignantList";


const getModules =(setModuleList)=>{
    const url = "http://localhost:8080/admin/module"
    axios.get(url,{ withCredentials:true})
    .then(response => {
        if(response.status === 200){
            setModuleList(response.data);
        }
    })
}

const getEtudiants = (setEtudiantList)=>{
    const url = "http://localhost:8080/admin/etu";
    axios.get(url,{withCredentials:true})
    .then(response=>{
        if(response.status === 200){
            setEtudiantList(response.data);
        }
        else{
            throw response.status;
        }
    })
    .catch(error=>{
        console.log(error);
    })
}

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



const PlanningForm = ({onFieldChange,appointmentData,...restProps}) => {

    const [moduleList,setModuleList] = useState([]);
    const [etudiantList,setEtudiantList] = useState([]);
    const [enseigantList,setEnseignantList] = useState([]);
 
    useEffect(()=>{
        getModules(setModuleList);
        getEtudiants(setEtudiantList);
        getEnseignant(setEnseignantList);
        if(appointmentData.id !== undefined){
            getSessions(appointmentData.id,onFieldChange);
        }
        else {
            onFieldChange({etudiants:[],sessionExamens:[]}); 
        }
    },[])

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

    const onEtudiantListChange = (checkValue,etudiant)=>{
        console.log(checkValue)
        if(checkValue){
            console.log(etudiant);
            onFieldChange({etudiants:[...appointmentData.etudiants,etudiant]});
        }
        else{
            onFieldChange({etudiants:appointmentData.etudiants.filter(e=>{
                return e.userId !== etudiant.userId;
            })});
        }   
        console.log(appointmentData);
    }

    const onEnseignantListChange = (checkValue,enseignant)=>{
        console.log(checkValue);
        if(checkValue){
            const session = {
                surveillant:enseignant
            }
            console.log(session);
            onFieldChange({sessionExamens:[...appointmentData.sessionExamens,session]});
        }
        else{
            onFieldChange({sessionExamens:appointmentData.sessionExamens.filter(session=>{
                return session.surveillant.userId !== enseignant.userId;
            })});
        }
        console.log(appointmentData);
    }


    return (
        <Container>
                <FormControl fullWidth>
                    <InputLabel>{appointmentData.module ? appointmentData.module.nomModule : "Module"}</InputLabel>
                    <Select variant="standard" value={appointmentData.module}  onChange={e=>{onModuleChange(e)}}>
                        {moduleList.map(module=>{
                            return <MenuItem value={module} key={module.id}>{module.nomModule}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            
                <Grid container marginTop={"3%"}>

                    <Grid item xs={3}>
                        <AppointmentForm.Label text="Date début:"></AppointmentForm.Label>
                        <AppointmentForm.DateEditor onValueChange={onStartDateChange} value={appointmentData.startDate}></AppointmentForm.DateEditor>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3}>
                        <AppointmentForm.Label text="Date fin:"></AppointmentForm.Label>
                        <AppointmentForm.DateEditor onValueChange={onEndDateChange} value={appointmentData.endDate}></AppointmentForm.DateEditor>
                    </Grid>

                    <Grid item xs={12}>
                        <EtudiantList 
                            etudiantList={etudiantList} 
                            affectedEtudiant={appointmentData.etudiants} 
                            onEtudiantListChange={onEtudiantListChange}>
                        </EtudiantList>
                    </Grid>

                    <Grid item xs={12}>
                        <EnseignantList 
                        enseignantList={enseigantList} 
                        affectedEnseignant={appointmentData.sessionExamens}
                        onEnseigantListChange={onEnseignantListChange}>

                        </EnseignantList>
                    </Grid>
                </Grid>
        </Container>
    );
};
export default PlanningForm;
