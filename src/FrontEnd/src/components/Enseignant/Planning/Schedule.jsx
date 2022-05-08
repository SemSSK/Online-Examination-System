import React from "react";
import { Scheduler, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from "@devexpress/dx-react-scheduler";
const Schedule = (props) => {
    return (<Scheduler data={props.appointments} height={700}>
                <ViewState defaultCurrentViewName="Month"></ViewState>
                <MonthView></MonthView>
                <WeekView></WeekView>
                <DayView startDayHour={8} endDayHour={16}></DayView>
                <Toolbar></Toolbar>
                <ViewSwitcher></ViewSwitcher>
                <DateNavigator></DateNavigator>
                <TodayButton></TodayButton>
                <Appointments>
                </Appointments>
                <AppointmentTooltip showCloseButton></AppointmentTooltip>
            </Scheduler>);
};
export default Schedule;
