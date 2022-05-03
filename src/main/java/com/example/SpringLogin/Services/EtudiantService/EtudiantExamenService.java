package com.example.SpringLogin.Services.EtudiantService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.PrésenceEtats;
import com.example.SpringLogin.Repos.*;
import com.example.SpringLogin.Socket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class EtudiantExamenService {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private PrésencesRepo présencesRepo;
    @Autowired
    private ExamenRepo examenRepo;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;
    @Autowired
    private PlanningExamenRepo planningExamenRepo;
    @Autowired
    private CopieRepo copieRepo;
    @Autowired
    private WebSocketService webSocketService;

    public EtudiantExamenService(){
        System.out.println("EtudiantExamenService initialized");
    }

    private Etudiant getEtudiant(){
        return (Etudiant)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean canParticipateInExam(String codeEtudiant){
        Optional<PlanningExamen> planningExamen = planningExamenRepo.findByCodeEtudiant(codeEtudiant);
        if(planningExamen.isEmpty()){
            return false;
        }
        if(!planningExamen.get().getEtudiants().contains(getEtudiant())){
            return false;
        }
        return true;
    }

    private boolean isPresent(SessionExamen sessionExamen){
        Optional<Présences> currentPrésence = présencesRepo.findByEtudiantAndSessionExamen(getEtudiant(),sessionExamen);
        if(currentPrésence.isEmpty()){
            return false;
        }
        return currentPrésence.get().getState().equals(PrésenceEtats.PRESENT);
    }

    private SessionExamen getCurrSession(String codeEtudiant) throws Exception {
        Optional<PlanningExamen> planningExamen = planningExamenRepo.findByCodeEtudiant(codeEtudiant);
        if(planningExamen.isEmpty()){
            throw new Exception("Wrong code");
        }
        List<SessionExamen> sessionExamenList = sessionExamenRepo.findByPlannings(planningExamen.get());
        if(sessionExamenList.isEmpty()){
            throw new Exception("wrong session");
        }
        SessionExamen result = null;
        for(SessionExamen sessionExamen : sessionExamenList){
            Optional<Présences> présences = présencesRepo.findByEtudiantAndSessionExamen(getEtudiant(),sessionExamen);
            if(!présences.isEmpty()){
                result = sessionExamen;
            }
        }
        return result;
    }

    public Examen getExamen(String codeEtudiant) throws Exception {

        if(!webSocketService.sessionExists(getEtudiant())){
            throw new Exception("Not connected to session");
        }

        if(!canParticipateInExam(codeEtudiant)){
            throw new Exception("wrong code");
        }

        SessionExamen sessionExamen = getCurrSession(codeEtudiant);


        if(!sessionExamen.isActive()){
            throw new Exception("Exam Session hes not started yet");
        }

        if(!isPresent(sessionExamen)){
            throw new Exception("You are not set as present in this session");
        }

        Optional<Examen> currentExamen = examenRepo.findByModule(sessionExamen.getPlannings().getModule());

        currentExamen.get().getExamenQuestions().forEach(examenQuestions -> {
            examenQuestions.getQuestion().setTypeAnswer("");
            examenQuestions.getQuestion().setReponses(new ArrayList<>());
        });

        return currentExamen.get();
    }

    @Transactional(readOnly = false)
    public void PostCopie(String codeEtudiant,Copie copie) throws Exception {

        if(!webSocketService.sessionExists(getEtudiant())){
            throw new Exception("Not connected to session");
        }
        if(!canParticipateInExam(codeEtudiant)){
            throw new Exception("wrong code");
        }
        SessionExamen sessionExamen = getCurrSession(codeEtudiant);
        if(!sessionExamen.isActive()){
            throw new Exception("Exam Session hes not started yet");
        }
        if(!isPresent(sessionExamen)){
            throw new Exception("You are not set as present in this session");
        }
        Optional<Examen> currentExamen = examenRepo.findByModule(sessionExamen.getPlannings().getModule());
        copie.setNote(0);
        copie.setEtudiant(getEtudiant());
        copie.setObservation(null);
        copie.setReclamation(null);
        copie.getReponses().forEach(reponse -> {
            reponse.setCopie(copie);
        });
        copie.setExam(currentExamen.get());
        copieRepo.save(copie);
    }

}
