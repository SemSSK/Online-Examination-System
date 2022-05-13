package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
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

    private boolean canAccessPlan(PlanningExamen planningExamen){
        return planningExamen.getAdmin().equals(getAdmin());
    }


    @Transactional(readOnly = false)
    public PlanningExamen addPlanning(PlanningExamen planningExamen) throws Exception {
        if(!validDate(planningExamen)){
            throw new Exception("Cannot plan exam at this date");
        }
        planningExamen.getSessionExamens().forEach(sessionExamen -> {
            sessionExamen.setState(SessionExamenStates.CREATED);
        });
        planningExamen.setAdmin(getAdmin());
        String codeEtudiant = UUID.randomUUID().toString();
        String codeSurveillant = UUID.randomUUID().toString();
        planningExamen.setCodeEtudiant(codeEtudiant);
        planningExamen.setCodeSurveillant(codeSurveillant);
        planningExamen.getSessionExamens().forEach(sessionExamen -> {
            sessionExamen.setPlannings(planningExamen);
        });
        return planningExamenRepo.save(planningExamen);
        //Envoyer email a etudiant et a surveillant
    }

    @Transactional(readOnly = false)
    public PlanningExamen modPlanning(PlanningExamen planningExamen) throws Exception {
        Optional<PlanningExamen> optCurrentPlanning = planningExamenRepo.findById(planningExamen.getPlanId());
        if(optCurrentPlanning.isEmpty()){
            throw new Exception("Planning doesn't exist");
        }

        if(!canAccessPlan(optCurrentPlanning.get())){
            throw new Exception("Cannot access this plan");
        }
        if(!validDate(planningExamen)){
            throw new Exception("Cannot plan exam at this date");
        }

        PlanningExamen currentPlanning = optCurrentPlanning.get();
        currentPlanning.setDuration(planningExamen.getDuration());
        currentPlanning.setDateOfExame(planningExamen.getDateOfExame());
        currentPlanning.setModule(planningExamen.getModule());
        if(planningExamen.getSessionExamens() != null) {
            Collection<SessionExamen> oldSessions = currentPlanning.getSessionExamens();
            sessionExamenRepo.deleteAll(oldSessions);
            currentPlanning.getSessionExamens().clear();
            currentPlanning.setSessionExamens(planningExamen.getSessionExamens());
            currentPlanning.getSessionExamens().forEach(sessionExamen -> {
                sessionExamen.setSessionId(null);
                sessionExamen.setPlannings(currentPlanning);
                sessionExamenRepo.save(sessionExamen);
            });
        }
        currentPlanning.setEtudiants(planningExamen.getEtudiants());
        return planningExamen;
    }


    @Transactional(readOnly = false)
    public Long deletePlanning(Long planId) throws Exception {
        Optional<PlanningExamen> OptPlanningExamen = planningExamenRepo.findById(planId);

        if(OptPlanningExamen.isEmpty()){
            throw new Exception("Planning doesn't exist");
        }

        if(!canAccessPlan(OptPlanningExamen.get())){
            throw new Exception("Cannot access this plan");
        }

        planningExamenRepo.deleteById(planId);
        return planId;
    }


    public List<SessionExamen> getSessionInPlanning(Long planId) throws Exception{
        Optional<PlanningExamen> OptPlanningExamen = planningExamenRepo.findById(planId);

        if(OptPlanningExamen.isEmpty()){
            throw new Exception("Planning doesn't exist");
        }

        if(!canAccessPlan(OptPlanningExamen.get())){
            throw new Exception("Cannot access this plan");
        }

        return sessionExamenRepo.findByPlannings(OptPlanningExamen.get());
    }
}
