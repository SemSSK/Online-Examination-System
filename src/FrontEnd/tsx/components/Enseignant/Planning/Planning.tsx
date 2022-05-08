import { Container, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import convertPlanningToAppointments from "./ConvertPlanningToAppointment";
import Schedule from "./Schedule";

const setAppointments = (setModuleAppo,setSurveillanceAppo)=>{
    const url = "http://localhost:8080/enseignant/planning/module";
        axios.get(url,{withCredentials:true})
        .then(response => {
            if(response.status !== 200){
                throw response.data;
            }
            const data = response.data;
            setModuleAppo(convertPlanningToAppointments(data));
        })
        .catch(error => {
            console.log(error);
        })


    const url2 = "http://localhost:8080/enseignant/planning/surveillance";
        axios.get(url2,{withCredentials:true})
        .then(response => {
            if(response.status !== 200){
                throw response.data;
            }
            const data = response.data;
            setSurveillanceAppo(convertPlanningToAppointments(data));
        })
        .catch(error => {
            console.log(error);
        })
}

const Planning = ()=>{
    const [surveillanceAppo,setSurveillanceAppo] = useState<any>([]);
    const [moduleAppo,setModuleAppo] = useState<any>([]);
    const [mode,setMode] = useState("module");

    useEffect(()=>{
        setAppointments(setModuleAppo,setSurveillanceAppo);
    },[])

    return(
        <Container>
            <FormControl>
                <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    value={mode}
                    onChange={e=>{
                        setMode(e.target.value);
                    }}
                >
                    <FormControlLabel value="module" control={<Radio />} label="module" />
                    <FormControlLabel value="surveillance" control={<Radio />} label="surveillance" />
                </RadioGroup>
            </FormControl>
            {mode === "module" && <Schedule appointments={moduleAppo}></Schedule>}
            {mode === "surveillance" && <Schedule appointments={surveillanceAppo}></Schedule>}
        </Container>
    )
}

export default Planning;