import React from "react";
import { Scheduler, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip,Resources, GroupingPanel } from '@devexpress/dx-react-scheduler-material-ui';
import { GroupingState, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";

const Schedule = ({appointments,resources}) => {
    return (<Scheduler data={appointments} height={700}>
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
                <Resources
                    data={resources}
                    mainResourceName={"type"}
                />
                <AppointmentTooltip showCloseButton></AppointmentTooltip>
            </Scheduler>);
};
export default Schedule;
