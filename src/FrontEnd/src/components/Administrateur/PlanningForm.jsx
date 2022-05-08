
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { TextField ,Container,Select,MenuItem,FormControl,InputLabel,Grid} from "@mui/material";
import React,{useState,useEffect} from "react";
import axios from "axios";

const getModules =(setModuleList)=>{
    const url = "http://localhost:8080/admin/module"
    axios.get(url,{ withCredentials:true})
    .then(response => {
        if(response.status === 200){
            setModuleList(response.data);
        }
    })
}

const PlanningForm = ({onFieldChange,appointmentData,...restProps}) => {

    const [moduleList,setModuleList] = useState([]);

    useEffect(()=>{
        getModules(setModuleList);
    },[])

    const onModuleChange = (event)=>{
        const module = event.target.value
        onFieldChange({title:module.nomModule,module: module});
        console.log(appointmentData)
    }

    const OnTitleChange = (nextValue) => {
        onFieldChange({ title: nextValue });
        console.log(appointmentData)
    };

    const onStartDateChange = (nextValue)=>{
        onFieldChange({startDate:nextValue});
        console.log(appointmentData)
    }

    const onEndDateChange = (nextValue)=>{
        onFieldChange({endDate:nextValue});
        console.log(appointmentData)
    }

    return (
        <Container>
            <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select variant="standard" label="Module" placeholder="Module" onChange={e=>{onModuleChange(e)}}>
                    {moduleList.map(module=>{
                        return <MenuItem value={module} key={module.id}>{module.nomModule}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <Grid container marginTop={"3%"}>

                <Grid item xs={5}>
                    <AppointmentForm.Label text="Date début:"></AppointmentForm.Label>
                    <AppointmentForm.DateEditor onValueChange={onStartDateChange} value={appointmentData.startDate}></AppointmentForm.DateEditor>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={5}>
                    <AppointmentForm.Label text="Date fin:"></AppointmentForm.Label>
                    <AppointmentForm.DateEditor onValueChange={onEndDateChange} value={appointmentData.endDate}></AppointmentForm.DateEditor>
                </Grid>
            </Grid>
        </Container>
    );
};
export default PlanningForm;
