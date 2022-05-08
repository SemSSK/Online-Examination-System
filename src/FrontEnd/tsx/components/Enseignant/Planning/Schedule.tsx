import { Container, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { ViewState } from "@devexpress/dx-react-scheduler";
import axios from "axios";
import convertPlanningToAppointments from "./ConvertPlanningToAppointment";

const Schedule : React.FC<{appointments}> = (props)=>{
    return(
            <Scheduler
                data={props.appointments}
                height={700}
            >
                <ViewState
                    defaultCurrentViewName="Month"
                ></ViewState>
                <MonthView></MonthView>
                <WeekView></WeekView>
                <DayView startDayHour={8} endDayHour={16}></DayView>
                <Toolbar></Toolbar>
                <ViewSwitcher></ViewSwitcher>
                <DateNavigator></DateNavigator>
                <TodayButton></TodayButton>
                <Appointments>
                </Appointments>
                <AppointmentTooltip
                    showCloseButton
                ></AppointmentTooltip>
            </Scheduler>
    )
}

export default Schedule;