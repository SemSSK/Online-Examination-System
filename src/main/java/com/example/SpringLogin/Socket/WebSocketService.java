package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.PrésenceEtats;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
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
import java.util.stream.Collectors;

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
    private HashMap<PlanningExamen,ArrayList<Etudiant>> fileAttenteEtudiant = new HashMap<>();
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
    }

    private void removeSurveillantTrace(Enseignant enseignant) throws IOException {
        ArrayList<SessionExamen> listOfSessions = (ArrayList<SessionExamen>) sessionExamenRepo.findBySurveillant(enseignant);
        listOfSessions.forEach(sessionExamen -> {
            sessionExamen.setState(SessionExamenStates.ENDED);
        });
    }

    public void CloseUserConnection(Utilisateur utilisateur) {
        sessionsUserMap.remove(utilisateur);
    }

    @Transactional(readOnly = false)
    public void OnEtudiantJoin(Etudiant etudiant, String codeEtudiant) throws IOException {
        WebSocketSession session = sessionsUserMap.get(etudiant);
        PlanningExamen planningExamen = getPlanningFromEtudiant(codeEtudiant, etudiant);
        if (planningExamen == null) {
            sendData(etudiant,new CustomMessage(CustomMessage.MESSAGE,"Wrong code "));
        }
        else if(!isExamTime(planningExamen)){
            sendData(etudiant,new CustomMessage(CustomMessage.MESSAGE,"Not time for exam"));
        }
        else {
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
                    addPrésences(idealSession, etudiant);
                    Présences newPrésence = getCurrentPrésence(etudiant,planningExamen);
                    Enseignant surveillant = idealSession.getSurveillant();
                    sendPrésencesToEnseignant(newPrésence.getSessionExamen(), surveillant);
                    sendPrésencesToEtudiant(newPrésence);
                }
            }
            else if(currentPrésence.getSessionExamen().getState().equals(SessionExamenStates.ENDED)
                || currentPrésence.getSessionExamen().getState().equals(SessionExamenStates.STARTED)){
                CustomMessage customMessage = new CustomMessage(CustomMessage.MESSAGE,"Cette session ne vous est plus disponible");
                sendData(etudiant,customMessage);
            }
            else{
                SessionExamen sessionExamen = currentPrésence.getSessionExamen();
                Enseignant surveillant = sessionExamen.getSurveillant();
                sendPrésencesToEnseignant(sessionExamen, surveillant);
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
        }
        else if(sessionExamen.getState().equals(SessionExamenStates.ENDED)){
            sendData(enseignant,new CustomMessage(CustomMessage.MESSAGE,"Session deja terminé"));
        }
        else {
            if(sessionExamen.getState().equals(SessionExamenStates.CREATED)){
                sessionExamen.setState(SessionExamenStates.OPENED);
            }
            ArrayList<Etudiant> waitingEtudiant = fileAttenteEtudiant.get(sessionExamen.getPlannings());
            if (waitingEtudiant != null) {
                for (Etudiant etudiant : waitingEtudiant) {
                    Présences newPrésence = addPrésences(sessionExamen, etudiant);
                    sendPrésencesToEtudiant(newPrésence);
                }
                fileAttenteEtudiant.remove(sessionExamen.getPlannings());
            }
            SessionExamen newSessionExamen = getSessionExamenFromSurveillant(codeEnseignant, enseignant);
            sendPrésencesToEnseignant(newSessionExamen, enseignant);
        }
    }

    public void transmitSignal(Utilisateur user,CustomMessage message) throws IOException {
        Utilisateur receiver = message.getTo();
        message.setFrom(user);
        sendData(receiver,message);
    }

    //Verification Method
    public void printData() {
        System.out.println("#############################################################");
        System.out.println("------------Registered Users------------");
        sessionsUserMap.forEach((utilisateur, webSocketSession) -> {
            System.out.println(utilisateur.getEmail());
        });
        System.out.println("------------Open Surveillant Sessions------------");
        ArrayList<SessionExamen> openSessions = (ArrayList<SessionExamen>) sessionExamenRepo.findAll();
        for(SessionExamen sessionExamen : openSessions){
            if(sessionExamen.getState().equals(SessionExamenStates.STARTED) || sessionExamen.getState().equals(SessionExamenStates.OPENED)) {
                String line = "Surveillant: " + sessionExamen.getSurveillant().getEmail()
                        + " Module: " + sessionExamen.getPlannings().getModule().getNomModule()
                        + " n°Session: " + sessionExamen.getSessionId()
                        + " State: " + sessionExamen.getState();
                System.out.println(line);
            }
        }
        System.out.println("------------Files Attente Etudiants------------");
        fileAttenteEtudiant.forEach((planningExamen, etudiants) -> {
            String data = "Planning:" + planningExamen.getPlanId() + " Etudiants:";
            for (Etudiant etudiant : etudiants) {
                data += etudiant.getEmail() + ",";
            }
            System.out.println(data);
        });
        System.out.println("------------Current Etudiant Présent------------");
        ArrayList<Présences> listPrésences = (ArrayList<Présences>) présencesRepo.findAll();
        for(Présences p : listPrésences){
            if(p.getSessionExamen().getState().equals(SessionExamenStates.STARTED) || p.getSessionExamen().getState().equals(SessionExamenStates.OPENED)){
                String line = "Etudiant: " + p.getEtudiant().getEmail()
                        + " Module: " + p.getSessionExamen().getPlannings().getModule().getNomModule()
                        + " Etat: " + p.getState();
                System.out.println(line);
            }
        }
        System.out.println("#############################################################");
    }

    public void UpdatePrésence(Présences présences) throws IOException {
        if(présences.getState().equals(PrésenceEtats.BLOQUER)) {
            CustomMessage customMessage = new CustomMessage(CustomMessage.BLOCKED, "Le surveillant vous a bloquer pour triche");
            sendData(présences.getEtudiant(), customMessage);
        }
        else if (présences.getSessionExamen().getState().equals(SessionExamenStates.ENDED)){
            CustomMessage customMessage = new CustomMessage(CustomMessage.BLOCKED, "Le surveillant vous a bloquer pour triche");
            sendData(présences.getEtudiant(), customMessage);
        }
        else{
            sendPrésencesToEtudiant(présences);
        }
        sendPrésencesToEnseignant(présences.getSessionExamen(),présences.getSessionExamen().getSurveillant());
    }

    //Sending methods
    public void sendPrésencesToEnseignant(SessionExamen sessionExamen, Enseignant enseignant) throws IOException {
        List<Présences> currentPrésences = sessionExamen.getPrésences().stream().filter(présences -> {
            return sessionsUserMap.containsKey(présences.getEtudiant()) && !présences.getState().equals(PrésenceEtats.BLOQUER);
        }).collect(Collectors.toList());
        CustomMessage présences = new CustomMessage(CustomMessage.DATA,currentPrésences);
        sendData(enseignant,présences);
        CustomMessage session = new CustomMessage(CustomMessage.SESSIONINFO,sessionExamen);
        sendData(enseignant,session);
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
        ArrayList<SessionExamen> result = (ArrayList<SessionExamen>) sessionExamenRepo.findByPlannings(planningExamen);
        result = (ArrayList<SessionExamen>) result.stream().filter(sessionExamen -> {
            return (sessionExamen.getState().equals(SessionExamenStates.OPENED) ||
                    (sessionExamen.getState().equals(SessionExamenStates.STARTED)));
        }).collect(Collectors.toList());
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

    private boolean isExamTime(PlanningExamen planningExamen){
        Long examTime = planningExamen.getDateOfExame().getTime();
        Long durationOfExam = planningExamen.getDuration().getTime();
        Long currentTime = System.currentTimeMillis();
        Long advanceTime = 30L * 60L * 1000L;
        return (currentTime + advanceTime > examTime) && (currentTime < examTime + durationOfExam);

    }
}
