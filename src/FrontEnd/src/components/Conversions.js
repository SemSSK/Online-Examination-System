const convertTimeToMilis = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    return (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)) * 1000;
};

const convertAppoToPlan = (appointment) => {
    const dateExame = new Date(appointment.startDate);
    const durationInDate = new Date((new Date(appointment.endDate).getTime() - dateExame.getTime()));
    const duration = `${durationInDate.getUTCHours()}:${durationInDate.getUTCMinutes()}:${durationInDate.getUTCSeconds()}`;
    console.log(duration);
    const title = appointment.module.nomModule;
    return {
        planId:appointment.id,
        dateOfExame: dateExame,
        duration:duration,
        module:appointment.module,
        etudiants: appointment.etudiants ? [...appointment.etudiants] : [],
        sessionExamens: appointment.sessionExamens ? [...appointment.sessionExamens] : []
    };
};

const convertAppointmentsToPlanning = (appointments) => {
    const size = appointments.length;
    const plannings = new Array(size);
    for (let i = 0; i < size; i++) {
        plannings[i] = convertAppoToPlan(appointments[i]);
    }
    return plannings;
};


const convertPlanToAppo = (plan) => {
    const startDate = new Date(plan.dateOfExame);
    const endDate = new Date(startDate.getTime() + convertTimeToMilis(plan.duration));
    const title = plan.module.nomModule;
    return {
        id:plan.planId,
        startDate: startDate,
        endDate: endDate,
        title: title,
        module:plan.module,
        etudiants:plan.etudiants,
        sessionsExamens:plan.sessionExamens
    };
};

const convertPlanningToAppointments = (plannings) => {
    const size = plannings.length;
    const appointments = new Array(size);
    for (let i = 0; i < size; i++) {
        appointments[i] = convertPlanToAppo(plannings[i]);
    }
    return appointments;
};

export {convertAppoToPlan,convertAppointmentsToPlanning,convertPlanToAppo,convertPlanningToAppointments};