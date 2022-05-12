import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip, AppointmentForm, DragDropProvider } from '@devexpress/dx-react-scheduler-material-ui';
import { Container } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {convertPlanningToAppointments,convertAppoToPlan,convertPlanToAppo} from '../../Conversions';
import PlanningForm from './PlanningForm';

const changePlanning = (planning,appointments,setAppointments)=>{
    const url = "http://localhost:8080/admin/planning";
    axios.put(url,planning,{withCredentials:true})
    .then(response => {
        console.log(planning);
        if(response.status === 200){
            const newPlanning = response.data;
            const newAppo = convertPlanToAppo(newPlanning);
            setAppointments(appointments.map(appo=>(
                appo.id === newAppo.id ? newAppo : appo
            )))
        }
    })
}
const addPlanning = (planning,appointments,setAppointments)=>{
    const url = "http://localhost:8080/admin/planning";
    axios.post(url,planning,{withCredentials:true})
    .then(response => {
        console.log(response.data);
        if(response.status === 200){
            const newPlanning = response.data;
            const newAppo = convertPlanToAppo(newPlanning);
            setAppointments([...appointments,newAppo]);
            console.log(newAppo);
        }
        else{
            throw(response.data)
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}

const deletePlanning = (deletedId,appointments,setAppointments)=>{
    const url = `http://localhost:8080/admin/planning/${deletedId}`;
    axios.delete(url,{withCredentials:true})
    .then(response => {
        if(response.status === 200){
            const id = response.data;
            setAppointments(appointments.filter(appo => {
                return appo.id !== id;
            }))
        }
        else{
            throw(response.data);
        }
    })
    .catch(error=>{
        console.log(error);
    })
}

const getPlannings = (setAppointments) => {
    const url = "http://localhost:8080/admin/planning";
    axios.get(url, { withCredentials: true })
        .then(response => {
        if (response.status !== 200) {
            throw response.data;
        }
        const appointments = convertPlanningToAppointments(response.data); 
        console.log(appointments)
        setAppointments(appointments);
    })
        .catch((error) => {
        console.log(error); 
    });
};


const Planning = () => {
    const [appointments, setAppointments] = useState(new Array());

    useEffect(()=>{
        getPlannings(setAppointments);
    },[])

    const onChanges = ({added,changed,deleted})=>{
        if(added){
            console.log(added);
            const planning = convertAppoToPlan(added);
            addPlanning(planning,appointments,setAppointments);
        }
        if(changed){
            let newAppointments = appointments;
            console.log(appointments);
            newAppointments.forEach(appo => {
                if(changed[appo.id])
                {
                    appo = {...appo,...changed[appo.id]};
                    const planning = convertAppoToPlan(appo);
                    console.log("changed planning:");
                    console.log(changed[appo.id]);
                    changePlanning(planning,appointments,setAppointments);
                }
            })
        }
        if(deleted !== undefined){
            deletePlanning(deleted,appointments,setAppointments);
        }
    }

    return (<Container>
            <Scheduler data={appointments}>
                    <ViewState defaultCurrentViewName="Week"></ViewState>
                    <EditingState onCommitChanges={onChanges}></EditingState>
                    <IntegratedEditing></IntegratedEditing>
                    <MonthView ></MonthView>
                    <WeekView startDayHour={8} endDayHour={20}></WeekView>
                    <DayView startDayHour={8} endDayHour={20}></DayView>
                    <Toolbar></Toolbar>
                    <ViewSwitcher></ViewSwitcher>
                    <DateNavigator></DateNavigator>
                    <TodayButton></TodayButton>
                    <Appointments>
                    </Appointments>
                    <AppointmentTooltip showCloseButton showOpenButton showDeleteButton></AppointmentTooltip>
                    <AppointmentForm basicLayoutComponent={PlanningForm}></AppointmentForm>
                    <DragDropProvider>
                    </DragDropProvider>
            </Scheduler>
        </Container>);
};
export default Planning;
