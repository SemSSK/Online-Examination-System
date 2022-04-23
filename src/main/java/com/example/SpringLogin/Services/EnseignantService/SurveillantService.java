package com.example.SpringLogin.Services.EnseignantService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class SurveillantService {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;
    @Autowired
    private PlanningExamenRepo planningExamenRepo;

    public SurveillantService(){
        System.out.println("SurveillantService Initialized");
    }

    private Enseignant getSurveillant(){
        return (Enseignant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private PlanningExamen getPlanningExamen(String codeSurveillant) throws Exception {
        Optional<PlanningExamen> planningExamen = planningExamenRepo.findByCodeSurveillant(codeSurveillant);
        if(planningExamen.isEmpty()){
            throw new Exception("Wrong code");
        }
        return planningExamen.get();
    }

    private SessionExamen getSession(PlanningExamen planningExamen) throws Exception {
        Optional<SessionExamen> sessionExamen = sessionExamenRepo.findByPlanningsAndSurveillant(planningExamen,getSurveillant());
        if(sessionExamen.isEmpty()){
            throw new Exception("Wrong code");
        }
        return sessionExamen.get();
    }

    @Transactional(readOnly = false)
    public void StartSession(String codeSurveillant) throws Exception {
        PlanningExamen currentExamen = getPlanningExamen(codeSurveillant);
        SessionExamen currentSession = getSession(currentExamen);
        currentSession.setActive(true);
    }

    @Transactional(readOnly = false)
    public void endSession(String codeSurveillant) throws Exception {
        PlanningExamen currentExamen = getPlanningExamen(codeSurveillant);
        SessionExamen currentSession = getSession(currentExamen);
        currentSession.setActive(false);
    }


}
