
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    DayView,
    WeekView,
    ViewSwitcher,
    Toolbar,
    Appointments,
    DateNavigator,
    TodayButton,
    AppointmentTooltip,
    AppointmentForm
  } from '@devexpress/dx-react-scheduler-material-ui';
import { Container, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import convertPlanningToAppointments from '../Enseignant/Planning/ConvertPlanningToAppointment';

const getPlannings = (setAppointments)=>{
    const url = "http://localhost:8080/admin/planning";
    axios.get(url,{withCredentials:true})
    .then(response => {
        if(response.status !== 200){
            throw response.data;
        }
        const appointments = convertPlanningToAppointments(response.data);
        setAppointments(appointments);
    })
    .catch((error)=>{
        console.log(error);
    });
}

const Admin = ()=>{
    const [appointments,setAppointments] = useState(new Array<any>());
    const [addedAppointment,setAddedAppointment] = useState<any>();

    useEffect(()=>{
        getPlannings(setAppointments);
    },[]);



    return(
        <Container>
            <Scheduler data={appointments}>
                    <ViewState
                        defaultCurrentViewName="Month"
                    ></ViewState>
                    <EditingState onCommitChanges={(changes)=>{}}
                    ></EditingState>
                    <IntegratedEditing></IntegratedEditing>
                    <MonthView></MonthView>
                    <WeekView></WeekView>
                    <DayView></DayView>
                    <Toolbar></Toolbar>
                    <ViewSwitcher></ViewSwitcher>
                    <DateNavigator></DateNavigator>
                    <TodayButton></TodayButton>
                    <Appointments>
                    </Appointments>
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                        showDeleteButton
                    ></AppointmentTooltip>
                    <AppointmentForm 
                    ></AppointmentForm>
            </Scheduler>
        </Container>
    );
}

export default Admin;