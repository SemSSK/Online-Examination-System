import { useEffect, useState } from "react";
import {convertPlanningToAppointments} from '../../Conversions.js';
import { Scheduler, Resources, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import {GroupingPanel, GroupingState, IntegratedGrouping, ViewState} from "@devexpress/dx-react-scheduler";
import Paper from '@mui/material/Paper';
import axios from "axios";
import Lens from '@mui/icons-material/Lens';
import AccessTime from '@mui/icons-material/AccessTime';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import classNames from 'clsx';
import { green, deepOrange, lightBlue,teal,blue ,purple,pink,red} from '@mui/material/colors';
import newStyle from "../../appStyling/newStyle.module.css";

const ExamTypes = [
    { text: 'Proctoring', id: 1, color: blue },
    { text: 'Teaching', id: 2, color: teal },
];


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
        getAppointments(setAppointments );
        console.log(appointments);
    },[])

    const Appointment = ({
                             children, style, ...restProps
                         }) => (
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor: '#8e24aa' /*'#1e88e5'*/,
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                width: '104%',
                height: '90%',
                marginBottom: '10px',
                boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
            }}
        >
            {children}
        </Appointments.Appointment>
    );


    const classes = {
        flexibleSpace: `flexibleSpace`,
        prioritySelector: `prioritySelector`,
        content: `content`,
        contentContainer: `contentContainer`,
        text: `text`,
        title: `title`,
        icon: `icon`,
        contentItemIcon: `contentItemIcon`,
        grayIcon: `grayIcon`,
        colorfulContent: `colorfulContent`,
        lens: `lens`,
        textCenter: `textCenter`,
        dateAndTitle: `dateAndTitle`,
        titleContainer: `titleContainer`,
        container: `container`,
        bullet: `bullet`,
        prioritySelectorItem: `prioritySelectorItem`,
        priorityText: `priorityText`,
        priorityShortText: `priorityShortText`,
        cellLowPriority: `cellLowPriority`,
        cellMediumPriority: `cellMediumPriority`,
        cellHighPriority: `cellHighPriority`,
        headerCellLowPriority: `headerCellLowPriority`,
        headerCellMediumPriority: `headerCellMediumPriority`,
        headerCellHighPriority: `headerCellHighPriority`,
    };

    const StyledTooltipContent = styled('div')(({ theme: { spacing, typography, palette }, color }) => ({
        [`&.${classes.content}`]: {
            padding: spacing(3, 1),
            paddingTop: 0,
            backgroundColor: palette.background.paper,
            boxSizing: 'border-box',
            width: '400px',
        },
        [`& .${classes.contentContainer}`]: {
            paddingBottom: spacing(1.5),
        },
        [`& .${classes.text}`]: {
            ...typography.body2,
            display: 'inline-block',
        },
        [`& .${classes.title}`]: {
            ...typography.h6,
            color: palette.text.secondary,
            fontWeight: typography.fontWeightBold,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
        },
        [`& .${classes.icon}`]: {
            verticalAlign: 'middle',
        },
        [`& .${classes.contentItemIcon}`]: {
            textAlign: 'center',
        },
        [`& .${classes.grayIcon}`]: {
            color: palette.action.active,
        },
        [`& .${classes.colorfulContent}`]: {
            color: color[600],
        },
        [`& .${classes.lens}`]: {
            width: spacing(4.5),
            height: spacing(4.5),
            verticalAlign: 'super',
        },
        [`& .${classes.textCenter}`]: {
            textAlign: 'center',
        },
        [`& .${classes.dateAndTitle}`]: {
            lineHeight: 1.1,
        },
        [`& .${classes.titleContainer}`]: {
            paddingBottom: spacing(2),
        },
        [`& .${classes.container}`]: {
            paddingBottom: spacing(1.5),
        },
    }));

    const TooltipContent = ({
                                appointmentData, formatDate, appointmentResources,
                            }) => {


        return (
            <StyledTooltipContent className={classes.content} color={purple}>
                <Grid container alignItems="flex-start" className={classes.titleContainer}>
                    <Grid item xs={2} className={classNames(classes.textCenter)}>
                        <Lens className={classNames(classes.lens, classes.colorfulContent)} />
                    </Grid>
                    <Grid item xs={10}>
                        <div>
                            <div className={classNames(classes.title, classes.dateAndTitle)}>
                                {appointmentData.title}
                            </div>
                            <div className={classNames(classes.text, classes.dateAndTitle)}>
                                {formatDate(appointmentData.startDate, { day: 'numeric', weekday: 'long' })}
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" className={classes.contentContainer}>
                    <Grid item xs={2} className={classes.textCenter}>
                        <AccessTime className={classes.icon} />
                    </Grid>
                    <Grid item xs={10}>
                        <div className={classes.text}>
                            {`${formatDate(appointmentData.startDate, { hour: 'numeric', minute: 'numeric' })}
              - ${formatDate(appointmentData.endDate, { hour: 'numeric', minute: 'numeric' })}`}
                        </div>
                    </Grid>
                </Grid>
                </StyledTooltipContent>
        );
    };


    return (
        <div className={newStyle.scheduleContainer}>
         <Paper elevation={4}  >

                <Scheduler data={appointments} height={700}  >
                    <ViewState  defaultCurrentViewName="Week" ></ViewState>
                    <MonthView></MonthView>
                    <WeekView startDayHour={7} endDayHour={17}></WeekView>
                    <DayView startDayHour={7}
                             endDayHour={17}></DayView>
                    <Toolbar></Toolbar>
                    <Appointments appointmentComponent={Appointment} />
                    <ViewSwitcher></ViewSwitcher>
                    <DateNavigator></DateNavigator>
                    <TodayButton></TodayButton>


                    <AppointmentTooltip showCloseButton   contentComponent={TooltipContent} ></AppointmentTooltip>
                </Scheduler>


         </Paper>
        </div>

    );
}

export default Schedual;