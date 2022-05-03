package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.PrésenceEtats;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.PrésencesRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.lang.model.type.ArrayType;
import java.io.IOException;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class WebSocketService {

    /*----------------Repositories----------------*/
    @Autowired
    private PlanningExamenRepo planningExamenRepo;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;
    @Autowired
    private PrésencesRepo présencesRepo;
    @Autowired
    private EtudiantRepo etudiantRepo;
    /*--------------------------------------------*/
    private HashMap<Présences,Etudiant> currEtudiantPrésent = new HashMap<>();
    private HashMap<PlanningExamen, ArrayList<Etudiant>> fileAttenteEtudiant = new HashMap<>(); // Pour enregistrer les etudiant arriver avant tous les surveillant et les affecter plus tard
    private HashMap<SessionExamen, Enseignant> openSurveillantSessions = new HashMap<>();
    private HashMap<Utilisateur, WebSocketSession> sessionsUserMap = new HashMap<>();

    public WebSocketService() {
        System.out.println("WebSocketService initialized");
    }

    public void saveConnectedUser(WebSocketSession session, Utilisateur utilisateur) {
        sessionsUserMap.put(utilisateur, session);
    }

    public void removeUserTrace(Utilisateur utilisateur) throws IOException {
        if (utilisateur.getUserRole().equals(Role.ETUDIANT)) {
            removeEtudiantTrace((Etudiant) utilisateur);
        } else {
            removeSurveillantTrace((Enseignant) utilisateur);
        }
    }

    private void removeEtudiantTrace(Etudiant etudiant) throws IOException {
        fileAttenteEtudiant.forEach((planningExamen, etudiants) -> {
            if (etudiants != null) {
                etudiants.removeIf(etudiantInArray -> {
                    return etudiant.equals(etudiantInArray);
                });
            }
        });
        Présences currentPrésence = null;
        for(Présences p : currEtudiantPrésent.keySet()){
            if(p.getEtudiant().equals(etudiant)){
                currentPrésence = p;
            }
        }
        if(currentPrésence != null){
            currEtudiantPrésent.remove(currentPrésence);
            Enseignant surveillant = currentPrésence.getSessionExamen().getSurveillant();
            if(surveillant != null && openSurveillantSessions.containsKey(currentPrésence.getSessionExamen())) {
                sendPrésencesToEnseignant(currentPrésence.getSessionExamen(), surveillant);
            }
        }
    }

    private void removeSurveillantTrace(Enseignant enseignant) throws IOException {
        ArrayList<SessionExamen> examenSessions = new ArrayList<>();
        for (Map.Entry<SessionExamen, Enseignant> enseignantEntry : openSurveillantSessions.entrySet()) {
            if (enseignantEntry.getValue().equals(enseignant)) {
                examenSessions.add(enseignantEntry.getKey());
            }
        }
        ArrayList<WebSocketSession> etudiantInSession = new ArrayList<>();
        for(Présences p : currEtudiantPrésent.keySet()){
            if(examenSessions.contains(p.getSessionExamen())){
                WebSocketSession etudiantSession = sessionsUserMap.get(currEtudiantPrésent.get(p));
            }
        }
        for (SessionExamen sessionExamen : examenSessions) {
            openSurveillantSessions.remove(sessionExamen);
        }
    }

    public void CloseUserConnection(Utilisateur utilisateur) {
        sessionsUserMap.remove(utilisateur);
    }

    @Transactional(readOnly = false)
    public void OnEtudiantJoin(Etudiant etudiant, String codeEtudiant) throws IOException {
        WebSocketSession session = sessionsUserMap.get(etudiant);
        PlanningExamen planningExamen = getPlanningFromEtudiant(codeEtudiant, etudiant);
        if (planningExamen == null) {
            sendData(etudiant,new CustomMessage(CustomMessage.MESSAGE,"Wrong code"));
        } else {
            Présences currentPrésence = getCurrentPrésence(etudiant,planningExamen);
            if(currentPrésence == null) {
                ArrayList<SessionExamen> sessionsDispo = getSessionDispo(planningExamen);
                if (sessionsDispo.size() == 0) {
                    ArrayList<Etudiant> etudiants = fileAttenteEtudiant.get(planningExamen);
                    if (etudiants == null) {
                        etudiants = new ArrayList<>();
                        fileAttenteEtudiant.put(planningExamen, etudiants);
                    }
                    etudiants.add(etudiant);
                } else {
                    SessionExamen idealSession = getIdealSession(sessionsDispo);
                    Présences newPrésence = addPrésences(idealSession, etudiant);
                    currEtudiantPrésent.put(newPrésence,etudiant);
                    Enseignant surveillant = idealSession.getSurveillant();
                    sendPrésencesToEnseignant(idealSession, surveillant);
                    sendPrésencesToEtudiant(newPrésence);
                }
            }
            else if(currentPrésence.getState().equals(PrésenceEtats.BLOQUER)){
                CustomMessage customMessage = new CustomMessage(CustomMessage.MESSAGE,"Vous avez été bloquer de cette session");
                sendData(etudiant,customMessage);
            }
            else{
                SessionExamen idealSession = currentPrésence.getSessionExamen();
                currEtudiantPrésent.put(currentPrésence,etudiant);
                Enseignant surveillant = idealSession.getSurveillant();
                if(surveillant != null && openSurveillantSessions.containsKey(idealSession)) {
                    sendPrésencesToEnseignant(idealSession, surveillant);
                }
                sendPrésencesToEtudiant(currentPrésence);
            }
        }
    }

    @Transactional(readOnly = false)
    public void OnSurveillantJoin(Enseignant enseignant, String codeEnseignant) throws IOException {
        WebSocketSession session = sessionsUserMap.get(enseignant);
        SessionExamen sessionExamen = getSessionExamenFromSurveillant(codeEnseignant, enseignant);
        if (sessionExamen == null) {
            sendData(enseignant,new CustomMessage(CustomMessage.MESSAGE,"Wrong code"));
        } else {
            openSurveillantSessions.put(sessionExamen, enseignant);
            ArrayList<Etudiant> waitingEtudiant = fileAttenteEtudiant.get(sessionExamen.getPlannings());
            if (waitingEtudiant != null) {
                for (Etudiant etudiant : waitingEtudiant) {
                    Présences newPrésence = addPrésences(sessionExamen, etudiant);
                    currEtudiantPrésent.put(newPrésence,etudiant);
                    sendPrésencesToEtudiant(newPrésence);
                }
                fileAttenteEtudiant.remove(sessionExamen.getPlannings());
            }
            sendPrésencesToEnseignant(sessionExamen, enseignant);
        }
    }

    //Verification Method
    public void printData() {
        System.out.println("#############################################################");
        System.out.println("------------Registered Users------------");
        sessionsUserMap.forEach((utilisateur, webSocketSession) -> {
            System.out.println(utilisateur.getEmail());
        });
        System.out.println("------------Open Surveillant Sessions------------");
        openSurveillantSessions.forEach((sessionExamen, enseignant) -> {
            String data = "Session:" + sessionExamen.getSessionId() + " Enseignants:" + enseignant.getEmail();
            System.out.println(data);
        });
        System.out.println("------------Files Attente Etudiants------------");
        fileAttenteEtudiant.forEach((planningExamen, etudiants) -> {
            String data = "Planning:" + planningExamen.getPlanId() + " Etudiants:";
            for (Etudiant etudiant : etudiants) {
                data += etudiant.getEmail() + ",";
            }
            System.out.println(data);
        });
        System.out.println("------------Current Etudiant Présent------------");
        currEtudiantPrésent.forEach((présences, etudiant) -> {
            String data = "Session:" + présences.getSessionExamen().getSessionId()
                    + " Surveillant:" + présences.getSessionExamen().getSurveillant().getEmail()
                    + " Etudiant:" + présences.getEtudiant().getEmail();
            System.out.println(data);
        });
        System.out.println("#############################################################");
    }


    public void UpdatePrésence(Présences présences) throws IOException {
        if(présences.getState().equals(PrésenceEtats.BLOQUER)){
            CustomMessage customMessage = new CustomMessage(CustomMessage.BLOCKED,"Le surveillant vous a bloquer pour triche");
            sendData(présences.getEtudiant(),customMessage);
            currEtudiantPrésent.remove(présences);
        }
        else{
            for(Présences p : currEtudiantPrésent.keySet()) {
                if (présences.equals(p)) {
                    p = présences;
                }
            }
        }
        sendPrésencesToEnseignant(présences.getSessionExamen(),présences.getSessionExamen().getSurveillant());
        sendPrésencesToEtudiant(présences);
    }

    //Sending methods
    public void sendPrésencesToEnseignant(SessionExamen sessionExamen, Enseignant enseignant) throws IOException {
        CustomMessage customMessage = new CustomMessage(CustomMessage.DATA,sessionExamen.getPrésences());
        sendData(enseignant,customMessage);
    }

    public void sendPrésencesToEtudiant(Présences présences) throws IOException {
        Etudiant etudiant = présences.getEtudiant();
        WebSocketSession etudiantSession = sessionsUserMap.get(etudiant);
        CustomMessage customMessage = new CustomMessage(CustomMessage.DATA,présences);
        sendData(etudiant,customMessage);
    }

    private void sendData(Utilisateur utilisateur,CustomMessage customMessage) throws IOException {
        WebSocketSession session = sessionsUserMap.get(utilisateur);
        if(session != null){
            ObjectMapper objectMapper = new ObjectMapper();
            String messageAsJSON = objectMapper.writeValueAsString(customMessage);
            session.sendMessage(new TextMessage(messageAsJSON));
        }
    }

    //Utility Methods
    public boolean sessionExists(Utilisateur utilisateur){
        return sessionsUserMap.containsKey(utilisateur);
    }

    private PlanningExamen getPlanningFromEtudiant(String codeEtudiant, Etudiant etudiant) {
        Optional<PlanningExamen> planningExamenFound = planningExamenRepo.findByCodeEtudiant(codeEtudiant);
        if (planningExamenFound.isEmpty()) {
            return null;
        }
        PlanningExamen planningExamen = planningExamenFound.get();
        if (!planningExamen.getEtudiants().contains(etudiant)) {
            return null;
        }
        return planningExamen;
    }

    private SessionExamen getSessionExamenFromSurveillant(String codeSurveillant, Enseignant enseignant) {
        Optional<PlanningExamen> planningExamenFound = planningExamenRepo.findByCodeSurveillant(codeSurveillant);
        if (planningExamenFound.isEmpty()) {
            return null;
        }
        PlanningExamen planningExamen = planningExamenFound.get();
        Optional<SessionExamen> sessionExamenFound = sessionExamenRepo.findByPlanningsAndSurveillant(planningExamen, enseignant);
        if (sessionExamenFound.isEmpty()) {
            return null;
        }
        SessionExamen sessionExamen = sessionExamenFound.get();
        return sessionExamen;
    }

    @Transactional(readOnly = true)
    private List<Présences> getPrésencesInSession(SessionExamen sessionExamen) {
        return présencesRepo.findAllBySessionExamen(sessionExamen);
    }

    @Transactional(readOnly = false)
    private Présences addPrésences(SessionExamen sessionExamen,Etudiant etudiant){
        Etudiant dbEtudiant = etudiantRepo.findById(etudiant.getUserId()).get();
        SessionExamen dbSession = sessionExamenRepo.findById(sessionExamen.getSessionId()).get();
        Présences présences = new Présences();
        présences.setEtudiant(dbEtudiant);
        présences.setSessionExamen(dbSession);
        présences.setState(PrésenceEtats.ABSENT);
        return présencesRepo.save(présences);
    }
    
    @Transactional(readOnly = true)
    private Présences getCurrentPrésence(Etudiant etudiant,PlanningExamen planningExamen){
        Optional<Présences> currentPrésence = présencesRepo.findByEtudiantAndSessionExamenPlannings(etudiant,planningExamen);
        if(currentPrésence.isEmpty()){
            return null;
        }
        return currentPrésence.get();
    }

    private ArrayList<SessionExamen> getSessionDispo(PlanningExamen planningExamen){
        ArrayList<SessionExamen> result = new ArrayList<>();
        for(SessionExamen key : openSurveillantSessions.keySet()){
            if(key.getPlannings().equals(planningExamen)){
                result.add(key);
            }
        }
        return result;
    }

    private SessionExamen getIdealSession(ArrayList<SessionExamen> sessions){
        SessionExamen idealSession = null;
        int min_size = Integer.MAX_VALUE;
        for(SessionExamen sessionExamen : sessions){
            int nEtudiantsAffected = getPrésencesInSession(sessionExamen).size();
            if(nEtudiantsAffected < min_size){
                idealSession = sessionExamen;
            }
        }
        return idealSession;
    }
}
