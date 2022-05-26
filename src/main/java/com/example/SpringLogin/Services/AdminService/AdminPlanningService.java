package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AdminPlanningService {
    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private PlanningExamenRepo planningExamenRepo;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;

    public AdminPlanningService(){
        System.out.println("AdminPlanningService Initialized");
    }

    private Administrateur getAdmin(){
        return (Administrateur)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<PlanningExamen> getPlannings(){
        return planningExamenRepo.findAllByAdmin(getAdmin());
    }

    private boolean validDate(PlanningExamen planningExamen){
        Long currentTime = System.currentTimeMillis();
        Long examTime = planningExamen.getDateOfExame().getTime();
        return currentTime < examTime;
    }

    private boolean canAccessPlan( Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }



    @Transactional(readOnly = false)
    public PlanningExamen addPlanning(PlanningExamen planningExamen) throws Exception {

        // test for planning already existence waiting for the unique key in this entity

//        if(!planningExamenRepo.findAllByModule(planningExamen.getModule()).isEmpty()){
//            throw new systemException(systemException.ExceptionType.EXISTENCE);
//        }


        // need to test for the date null possibility
        if(!validDate(planningExamen)){
            throw new systemException("Cannot plan exam at this date");
        }

        //before setting the session we need to check for surveillants are available
        planningExamen.getSessionExamens().forEach(sessionExamen -> {
            sessionExamen.setState(SessionExamenStates.CREATED);
            sessionExamen.setPlannings(planningExamen);
        });
        planningExamen.setAdmin(getAdmin());
        String codeEtudiant = UUID.randomUUID().toString();
        String codeSurveillant = UUID.randomUUID().toString();
        planningExamen.setCodeEtudiant(codeEtudiant);
        planningExamen.setCodeSurveillant(codeSurveillant);

        return planningExamenRepo.save(planningExamen);
        //Envoyer email a etudiant et a surveillant
    }

    @Transactional(readOnly = false)
    public PlanningExamen editPlanning(PlanningExamen planningExamen) throws Exception {
        Optional<PlanningExamen> optCurrentPlanning = planningExamenRepo.findById(planningExamen.getPlanId());
        if(optCurrentPlanning.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canAccessPlan(optCurrentPlanning.get().getAdmin())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        // need to test for the date null possibility
        if(!validDate(planningExamen)){
            throw new Exception("Cannot plan exam at this date");
        }

        // again we need to check for date validation with all the students and surveillants

        PlanningExamen currentPlanning = optCurrentPlanning.get();
        currentPlanning.setDuration(planningExamen.getDuration());
        currentPlanning.setDateOfExame(planningExamen.getDateOfExame());
        currentPlanning.setModule(planningExamen.getModule());

        // why this test for sessions but not for students and all other fields??
        if(planningExamen.getSessionExamens() != null) {
            Collection<SessionExamen> oldSessions = currentPlanning.getSessionExamens();
            sessionExamenRepo.deleteAll(oldSessions);
            currentPlanning.getSessionExamens().clear();
            currentPlanning.setSessionExamens(planningExamen.getSessionExamens());

            // we need more checks I think
            currentPlanning.getSessionExamens().forEach(sessionExamen -> {
                sessionExamen.setSessionId(null);
                sessionExamen.setPlannings(currentPlanning);
                sessionExamenRepo.save(sessionExamen);
            });
        }

        // what if null here or not the same niveau as module niveau
        // or student has other exam at the same time
        currentPlanning.setEtudiants(planningExamen.getEtudiants());
        return planningExamen;
    }


    @Transactional(readOnly = false)
    public Long deletePlanning(Long planId) throws Exception {
        Optional<PlanningExamen> OptPlanningExamen = planningExamenRepo.findById(planId);

        if(OptPlanningExamen.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canAccessPlan(OptPlanningExamen.get().getAdmin())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        planningExamenRepo.deleteById(planId);
        return planId;
    }


    public List<SessionExamen> getSessionInPlanning(Long planId) throws Exception{
        Optional<PlanningExamen> OptPlanningExamen = planningExamenRepo.findById(planId);

        if(OptPlanningExamen.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canAccessPlan(OptPlanningExamen.get().getAdmin())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        return sessionExamenRepo.findByPlannings(OptPlanningExamen.get());
    }
}
