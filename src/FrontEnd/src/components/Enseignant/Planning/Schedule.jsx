import React ,{useState} from "react";
import { Scheduler, MonthView, DayView, WeekView, ViewSwitcher, Toolbar, Appointments, DateNavigator, TodayButton, AppointmentTooltip,Resources, GroupingPanel } from '@devexpress/dx-react-scheduler-material-ui';
import { GroupingState, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";
import newStyle from "../../appStyling/newStyle.module.css";
import Paper from '@mui/material/Paper';
import {styled} from "@mui/material/styles";
import {purple,pink} from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import classNames from "clsx";
import Lens from "@mui/icons-material/Lens";
import AccessTime from "@mui/icons-material/AccessTime";

const Schedule = ({appointments,resources}) => {



    const Appointment = ({
                             children, style, ...restProps
                         }) => {

        const myColor = restProps.data.type[0] === 1 ? "#d81b60" : "#8e24aa";

        return(
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor:{myColor} /*'#1e88e5'*/,
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
    )};


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
                                appointmentData, formatDate, appointmentResources
                            }) => {



        return (
            <StyledTooltipContent className={classes.content} color={appointmentResources[0].color}>
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
                <Grid container alignItems="flex-start" className={classes.contentContainer}>
                    {
                        appointmentResources.map((resource,index) =>(
                                <Grid container key={index}>
                                    <Grid item xs={2} className={classNames(classes.textCenter)}>
                                        <Lens sx={{fontSize: 20, color: resource.color[600] }} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <div className={classes.text}>
                                            {resource.text}
                                        </div>
                                    </Grid>
                                </Grid>
                            ))

                }
                </Grid>
            </StyledTooltipContent>
        );
    };

    return (
        <div className={newStyle.scheduleContainer}>
            <Paper elevation={4}  >
                <Scheduler data={appointments} height={700}>
                    <ViewState defaultCurrentViewName="Week"></ViewState>
                    <MonthView></MonthView>
                    <WeekView startDayHour={1} endDayHour={20}></WeekView>
                    <DayView></DayView>
                    <Toolbar></Toolbar>
                    <ViewSwitcher></ViewSwitcher>
                    <DateNavigator></DateNavigator>
                    <TodayButton></TodayButton>
                    <Appointments appointmentComponent={Appointment}/>

                    <Resources
                        data={resources}
                        mainResourceName={"type"}
                    />
                    <AppointmentTooltip showCloseButton  contentComponent={TooltipContent} ></AppointmentTooltip>
                </Scheduler>
            </Paper>
        </div>
    );
};
export default Schedule;
