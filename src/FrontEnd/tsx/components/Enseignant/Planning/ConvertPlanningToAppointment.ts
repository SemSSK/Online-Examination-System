const convertTimeToMilis = (time)=>{
    const [hours,minutes,seconds] = time.split(':');
    return (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds) ) * 1000;
}

const convertPlanToAppo = (plan)=>{  // 1 appointment
    const startDate = new Date(plan.dateOfExame);
    const endDate = new Date(startDate.getTime() + convertTimeToMilis(plan.duration));
    const title = plan.module.nomModule;
    return {
        startDate:startDate,
        endDate:endDate,
        title:title,
        plan:plan
    }
}

const convertPlanningToAppointments = (plannings : Array<any>) => { // array of appointments
    const size = plannings.length;
    const appointments = new Array(size);
    for(let i = 0 ; i < size ; i++){
        appointments[i] = convertPlanToAppo(plannings[i]);
    }
    return appointments; 
}

export default convertPlanningToAppointments;

