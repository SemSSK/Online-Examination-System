import { Container, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import {convertPlanningToAppointments} from '../../Conversions.js';
import React, { useEffect, useState } from "react";
import Schedule from "./Schedule";
import {purple, pink} from "@mui/material/colors";


const getAppointmentes = (setAppointments) => {
    const url = "http://localhost:8080/enseignant/planning/module";
    let currentAppos = [];

    axios.get(url, { withCredentials: true })
        .then(response => {
            if (response.status !== 200) {
                throw response.data;
            }
            const data = response.data;
            currentAppos = convertPlanningToAppointments(data).map(appointment => {
                return {...appointment,type: [2]};
            });
            console.log(currentAppos);
        })
        .then(()=>{
            const url2 = "http://localhost:8080/enseignant/planning/surveillance";
            axios.get(url2, { withCredentials: true })
                .then(response => {
                    if (response.status !== 200) {
                        throw response.data;
                    }
                    const data = response.data;
                    let appointments = convertPlanningToAppointments(data);
                    console.log(appointments);
                    appointments.forEach(appointment => {
                        const foundAppoIndex = currentAppos.findIndex(a => a.id === appointment.id);
                        if(foundAppoIndex == -1){
                            currentAppos.push({...appointment,type:[1]})
                        }
                        else{
                            console.log(currentAppos[foundAppoIndex] );
                            currentAppos[foundAppoIndex].type = [1,2];
                        }
                    })
                })
                .then(()=>{
                    console.log(currentAppos);
                    setAppointments(currentAppos);
                })
        })
        .catch(error => {
            console.log(error);
        });
};




const Planning = () => {
    const [resources,setResources] = useState([
        {
            fieldName:'type',
            allowMultiple:true,
            instances:[
                {id:1,text:"SURVEILLANCE",color: pink},
                {id:2,text:"ENSEIGNEMENT",color: purple}
            ]
        }
    ]);
    const [appointments,setAppointments] = useState([]);
    useEffect(() => {
        getAppointmentes(setAppointments);
        console.log(appointments)
    }, []);

    return (
        <Schedule appointments={appointments} resources={resources}></Schedule>
    )
};
export default Planning;