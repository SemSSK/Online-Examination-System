import React, { useEffect, useState } from "react";
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler,Resources, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip, AppointmentForm, DragDropProvider } from '@devexpress/dx-react-scheduler-material-ui';
import Paper from '@mui/material/Paper';
import axios from "axios";
import {convertPlanningToAppointments,convertAppoToPlan,convertPlanToAppo} from '../../Conversions';
import PlanningForm from './PlanningForm';
import newStyle from "../../appStyling/newStyle.module.css";
import {purple} from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import classNames from "clsx";
import Lens from "@mui/icons-material/Lens";
import AccessTime from "@mui/icons-material/AccessTime";
import {styled} from "@mui/material/styles";

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
    .catch ((err)=>{
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        }else{
            console.log(`Error: ${err.message}`);
        }
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
                width: '100%',
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
                <Scheduler data={appointments}  height={710} >
                        <ViewState defaultCurrentViewName="Week"></ViewState>
                        <EditingState onCommitChanges={onChanges}></EditingState>
                        <IntegratedEditing></IntegratedEditing>
                        <MonthView ></MonthView>
                        <WeekView startDayHour={7} endDayHour={17}></WeekView>
                        <DayView startDayHour={7} endDayHour={17}></DayView>
                        <Toolbar></Toolbar>
                        <ViewSwitcher></ViewSwitcher>
                        <DateNavigator></DateNavigator>
                        <TodayButton></TodayButton>
                        <Appointments appointmentComponent={Appointment}/>
                        <AppointmentTooltip showCloseButton showOpenButton showDeleteButton contentComponent={TooltipContent}></AppointmentTooltip>
                        <AppointmentForm  basicLayoutComponent={PlanningForm} ></AppointmentForm>
                        <Resources />
                        <DragDropProvider />
                </Scheduler>
            </Paper>
        </div>
    );
};

export default Planning;
