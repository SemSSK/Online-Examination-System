package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<PlanningExamen> getPlannings(){
        return planningExamenRepo.findAllByAdmin(getAdmin());
    }


    // methode to check for all the sessions of a planning if there surveillant are Available for this plan and return the list of available ones
    private Collection<SessionExamen> validateSurveillants(Collection<SessionExamen> examSessions , PlanningExamen planningExamen){
        Collection<SessionExamen> validatedList = new ArrayList<>();
        examSessions.forEach(session -> {
            Enseignant surveillant = session.getSurveillant();

            if(surveillant != null){
                boolean surveillantPossibility = true;
                List<PlanningExamen> existedPlanningList =  planningExamenRepo.findAllBySessionExamensSurveillant(surveillant);
                for (PlanningExamen existedPlanningExamen : existedPlanningList) {
                    if(!checkTwoPlansArePossibleTogether(planningExamen,existedPlanningExamen)){
                        surveillantPossibility = false;
                    }
                }
                if(surveillantPossibility){
                    validatedList.add(session);
                }
            }

        });
        return validatedList;
    }

    private boolean checkTwoPlansArePossibleTogether(PlanningExamen planToAdd, PlanningExamen planExist){
        // for simplicity ==> planToAdd.dateDebut > planExist.dateFin OR planToAdd.DateFin < planExist.dateDebut
        if( (planToAdd.getDateOfExame().getTime() > (planExist.getDateOfExame().getTime() + planExist.getDuration()))
            ||  ((planToAdd.getDateOfExame().getTime() + planToAdd.getDuration()) < planExist.getDateOfExame().getTime())
        ) {
            return true;
        }else{
            return false;
        }
    }

    private boolean validDate(PlanningExamen planningExamen){
        if(planningExamen.getDateOfExame() == null){
            return false;
        }
        Long currentTime = System.currentTimeMillis();
        Long examTime = planningExamen.getDateOfExame().getTime();
        return currentTime < examTime;
    }

    private boolean canAccessPlan( Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }

    // methode to check for all the etudiants if they are Available for this plan and return the list of available ones
    private Collection<Etudiant> validateEtudiants(Collection<Etudiant> etudiants , PlanningExamen planningExamen){
        Collection<Etudiant> validatedList = new ArrayList<>();
        Module module = planningExamen.getModule();

        etudiants.forEach(etudiant -> {

            if(etudiant != null && etudiant.getNiveau() == module.getNiveau()){
                boolean etudiantPossibility = true;
                List<PlanningExamen> existedPlanningList =  planningExamenRepo.findByEtudiantsContaining(etudiant);
                for (PlanningExamen existedPlanningExamen : existedPlanningList) {
                    if(!checkTwoPlansArePossibleTogether(planningExamen,existedPlanningExamen)){
                        etudiantPossibility = false;
                    }
                }
                if(etudiantPossibility){
                    validatedList.add(etudiant);
                }
            }

        });
        return validatedList;
    }


    @Transactional(readOnly = false)
    public PlanningExamen addPlanning(PlanningExamen planningExamen) throws Exception {

        // test for planning already existence waiting for the unique key in this entity for now it's ModuleId and dateTime
        //keep in mind maybe it's going to change
        PlanningExamen existedPlanningForModule = planningExamenRepo.findByModuleAndDateOfExame(planningExamen.getModule(),planningExamen.getDateOfExame());
        if(existedPlanningForModule != null){
            if(!canAccessPlan(existedPlanningForModule.getAdmin()))
                throw new systemException(systemException.ExceptionType.EXISTENCE_AND_ACCESS);
        }


        // validating the date
        if(!validDate(planningExamen)){
            throw new systemException("Cannot plan exam at this date");
        }

        // validating the duration
        if(!(planningExamen.getDuration() < (5 * 60 * 60 * 1000L) && planningExamen.getDuration() > 0 )){
            throw new systemException("Cannot plan exam with this duration");
        }

        // validate surveillants
        Collection<SessionExamen> examSessions = validateSurveillants(planningExamen.getSessionExamens(), planningExamen);

        // validate students (1- time with other exams, 2- module is for this etudiant)
        Collection<Etudiant> examEtudiants = validateEtudiants(planningExamen.getEtudiants(), planningExamen);

        // initialize sessions state and planning
        examSessions.forEach(sessionExamen -> {
            sessionExamen.setState(SessionExamenStates.CREATED);
            sessionExamen.setPlannings(planningExamen);
        });



        planningExamen.setSessionExamens(examSessions);
        planningExamen.setEtudiants(examEtudiants);
        planningExamen.setAdmin(getAdmin());
        String codeEtudiant = UUID.randomUUID().toString();
        String codeSurveillant = UUID.randomUUID().toString();
        planningExamen.setCodeEtudiant(codeEtudiant);
        planningExamen.setCodeSurveillant(codeSurveillant);

        // we can save the object received from user after checking all of it's attribute
        // date validated + duration validated + sessions reSet with the validated one + etudiants reSet with the validated one + codeEtudiant set + codeSurveillant set + admin set
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

        // need to test for the date null possibility --> DONE
        if(!validDate(planningExamen)){
            throw new systemException("Cannot plan exam at this date");
        }

        // validating the duration
        if(planningExamen.getDuration() < (5 * 60 * 60 * 1000L) && planningExamen.getDuration() > 0 ){
            throw new systemException("Cannot plan exam with this duration");
        }

        // validate surveillants
        Collection<SessionExamen> examSessions = validateSurveillants(planningExamen.getSessionExamens(), planningExamen);

        // validate students
        Collection<Etudiant> examEtudiants = validateEtudiants(planningExamen.getEtudiants(), planningExamen);

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

            examSessions.forEach(sessionExamen -> {
                sessionExamen.setState(SessionExamenStates.CREATED);
                sessionExamen.setPlannings(currentPlanning);
                sessionExamenRepo.save(sessionExamen);
            });
        }

        // what if null here or not the same niveau as module niveau
        // or student has other exam at the same time
        currentPlanning.setEtudiants(examEtudiants);
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

        return sessionExamenRepo.findByPlannings(OptPlanningExamen.get());
    }
}
