// const convertTimeToMilis = (time) => {
//     const [hours, minutes, seconds] = time.split(':');
//     return (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)) * 1000;
// };

const convertAppoToPlan = (appointment) => {
    const dateExame = new Date(appointment.startDate);
    const duration = new Date(appointment.endDate).getTime() - dateExame.getTime();
    console.log(duration);
    const title = appointment.module.nomModule;
    return {
        planId:appointment.id,
        dateOfExame: dateExame,
        duration:duration,
        module:appointment.module,
        etudiants: appointment.etudiants ? [...appointment.etudiants] : [],
        sessionExamens: appointment.sessionExamens ? [...appointment.sessionExamens] : null
    };
};



const convertPlanToAppo = (plan) => {
    const startDate = new Date(plan.dateOfExame);
    const endDate = new Date(startDate.getTime() + plan.duration );
    const title = plan.module.nomModule;
    return {
        id: plan.planId,
        startDate: startDate,
        endDate: endDate,
        title: title,
        module: plan.module,
        etudiants: plan.etudiants,
        sessionExamens: plan.sessionExamens,
        examType: 1
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

export {convertAppoToPlan,convertPlanToAppo,convertPlanningToAppointments};