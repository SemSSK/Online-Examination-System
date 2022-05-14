package com.example.SpringLogin.Services.EnseignantService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.PrésencesRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import com.example.SpringLogin.Socket.WebSocketService;
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
    private PrésencesRepo présencesRepo;
    @Autowired
    private PlanningExamenRepo planningExamenRepo;
    @Autowired
    private WebSocketService webSocketService;

    public SurveillantService(){
        System.out.println("SurveillantService Initialized");
    }

    private Enseignant getSurveillant(){
        return (Enseignant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private void canChangePresences(PlanningExamen planningExamen) throws Exception {
        SessionExamen sessionExamen = getSession(planningExamen);
        if(!(sessionExamen.getState().equals(SessionExamenStates.OPENED) ||
                sessionExamen.getState().equals(SessionExamenStates.STARTED))){
            throw new Exception("Session not started yet");
        }
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

    private Présences getPrésenceOfEtudiant(SessionExamen sessionExamen,Etudiant etudiant) throws Exception{
        Optional<Présences> currentPresence = présencesRepo.findByEtudiantAndSessionExamen(etudiant,sessionExamen);
        if(currentPresence.isEmpty()){
            throw new Exception("Aucun etudiant trouver");
        }
        return currentPresence.get();
    }

    @Transactional(readOnly = false)
    public void ChangeSessionActivationState(String codeSurveillant) throws Exception {
        PlanningExamen currentExamen = getPlanningExamen(codeSurveillant);
        SessionExamen currentSession = getSession(currentExamen);
        if(!webSocketService.sessionExists(getSurveillant(),currentSession)){
            throw new Exception("Not connected to session");
        }
        currentSession.setToNextState();

        for(Présences p : currentSession.getPrésences()) {
            webSocketService.UpdatePrésence(p);
        }
        webSocketService.sendPrésencesToEnseignant(currentSession);
    }

    @Transactional(readOnly = false)
    public void ChangeEtudiantPresenceState(String codeSurveillant, Etudiant etudiant,String Etat) throws Exception{
        PlanningExamen curreExamen = getPlanningExamen(codeSurveillant);
        canChangePresences(curreExamen);
        SessionExamen currentSession = getSession(curreExamen);
        if(!webSocketService.sessionExists(getSurveillant(),currentSession)){
            throw new Exception("Not connected to session");
        }
        Présences présencesOfEtudiant = getPrésenceOfEtudiant(currentSession,etudiant);
        présencesOfEtudiant.setState(Etat);
        webSocketService.UpdatePrésence(présencesOfEtudiant);
        webSocketService.sendPrésencesToEnseignant(présencesOfEtudiant.getSessionExamen());
    }


}
