import { useEffect, useState } from "react";
import {convertPlanningToAppointments} from '../../Conversions.js';
import { Scheduler, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from "@devexpress/dx-react-scheduler";
import axios from "axios";

const getAppointments = (setAppointments) => {
    const url = "http://localhost:8080/etudiant/planning";
    axios.get(url, { withCredentials: true })
        .then(response => {
        if (response.status !== 200) {
            throw response.data;
        }
        console.log(response.data);
        const data = response.data;
        setAppointments(convertPlanningToAppointments(data));
    })
        .catch(error => {
        console.log(error);
    });
}

const Schedual = () => {
    const [appointments,setAppointments] = useState([]);

    useEffect(()=>{
        console.log("getting Appointments")
        getAppointments(setAppointments);
    },[])

    return (
        <Scheduler data={appointments} height={700}>
            <ViewState defaultCurrentViewName="Month"></ViewState>
            <MonthView></MonthView>
            <WeekView startDayHour={1} endDayHour={20}></WeekView>
            <DayView></DayView>
            <Toolbar></Toolbar>
            <ViewSwitcher></ViewSwitcher>
            <DateNavigator></DateNavigator>
            <TodayButton></TodayButton>
            <Appointments>
            </Appointments>
            <AppointmentTooltip showCloseButton></AppointmentTooltip>
        </Scheduler>
    );
}
 
export default Schedual;