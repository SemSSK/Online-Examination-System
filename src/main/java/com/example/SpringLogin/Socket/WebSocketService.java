package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.PrésenceEtats;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Enumarators.SessionExamenStates;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.PresencesRepo;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

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
    private PresencesRepo presencesRepo;
    @Autowired
    private EtudiantRepo etudiantRepo;
    /*--------------------------------------------*/
    private HashMap<Utilisateur, WebSocketUser> sessionsUserMap = new HashMap<>();

    public WebSocketService() {
        System.out.println("WebSocketService initialized");
    }

    public void saveConnectedUser(WebSocketSession session, Utilisateur utilisateur) {
        WebSocketUser webSocketUser = new WebSocketUser(session,utilisateur);
        sessionsUserMap.put(utilisateur, webSocketUser);
    }
    public boolean userExists(Utilisateur utilisateur){
        return sessionsUserMap.containsKey(utilisateur);
    }
    public WebSocketSession getWebsocketSession(Utilisateur utilisateur){
        if(userExists(utilisateur)){
            return null;
        }
        return sessionsUserMap.get(utilisateur).getWebSocketSession();
    }

    public void removeUserTrace(Utilisateur utilisateur,WebSocketSession session) throws IOException {
        if(sessionsUserMap.containsKey(utilisateur)) {
            WebSocketUser webSocketUser = sessionsUserMap.get(utilisateur);
            if(webSocketUser.getWebSocketSession().getId().equals(session.getId())) {
                if (utilisateur.getUserRole().equals(Role.ETUDIANT)) {
                    removeEtudiantTrace((Etudiant) utilisateur);
                } else {
                    removeSurveillantTrace((Enseignant) utilisateur);
                }
            }
        }
    }

    private void removeEtudiantTrace(Etudiant etudiant) throws IOException {
        SessionExamen sessionExamen = sessionsUserMap.get(etudiant).getSessionExamen();
        if (sessionExamen != null) {
            SessionExamen currentSession = sessionExamenRepo.findById(sessionExamen.getSessionId()).get();
            sessionsUserMap.get(etudiant).setSessionExamen(null);
            sendPrésencesToEnseignant(currentSession);
        }
    }

    @Transactional(readOnly = false)
     void removeSurveillantTrace(Enseignant enseignant) throws IOException {
        SessionExamen currentSession = sessionsUserMap.get(enseignant).getSessionExamen();
        if(currentSession != null) {
            SessionExamen sessionExamen = sessionExamenRepo.findById(currentSession.getSessionId()).get();
            sessionExamen.setState("ENDED");
        }
        sessionsUserMap.get(enseignant).setSessionExamen(null);
    }

    public void CloseUserConnection(Utilisateur utilisateur,WebSocketSession session) throws IOException {
        WebSocketUser webSocketUser = sessionsUserMap.get(utilisateur);
        if(webSocketUser.getWebSocketSession().getId().equals(session.getId())) {
            System.out.println("closing connection of:" + utilisateur.getEmail());
            sessionsUserMap.remove(utilisateur);
        }
    }

    @Transactional(readOnly = false)
    public void OnEtudiantJoin(Etudiant etudiant, String codeEtudiant) throws IOException {
        WebSocketUser etudiantSession = sessionsUserMap.get(etudiant);
        PlanningExamen planningExamen = getPlanningFromEtudiant(codeEtudiant, etudiant);
        if (planningExamen == null) {
            sendData(etudiant,new CustomMessage(ExamRoomWebsocket.MESSAGE,"Wrong code "));
        }
        else {
            Presences currentPrésence = getCurrentPrésence(etudiant,planningExamen);
            if(currentPrésence == null) {
                ArrayList<SessionExamen> sessionsDispo = getSessionDispo(planningExamen);
                if (sessionsDispo.size() == 0) {
                    sendData(etudiant,new CustomMessage(ExamRoomWebsocket.MESSAGE,
                            "Aucune Surveillant pour l'instant impossible de rejoindre la session"));
                } else {
                    SessionExamen idealSession = getIdealSession(sessionsDispo);
                    addPrésences(idealSession, etudiant);
                    etudiantSession.setSessionExamen(idealSession);
                    Presences newPrésence = getCurrentPrésence(etudiant,planningExamen);
                    Enseignant surveillant = idealSession.getSurveillant();
                    sendPrésencesToEnseignant(newPrésence.getSessionExamen());
                    sendPrésencesToEtudiant(newPrésence);
                }
            }
            else if(currentPrésence.getSessionExamen().getState().equals(SessionExamenStates.ENDED)
                    || currentPrésence.getSessionExamen().getState().equals(SessionExamenStates.STARTED)
                    || currentPrésence.getState().equals(PrésenceEtats.BLOQUER)){
                CustomMessage customMessage = new CustomMessage(ExamRoomWebsocket.MESSAGE,"Cette session ne vous est plus disponible");
                sendData(etudiant,customMessage);
            }
            else {
                SessionExamen sessionExamen = currentPrésence.getSessionExamen();
                etudiantSession.setSessionExamen(sessionExamen);
                sendPrésencesToEnseignant(sessionExamen);
                sendPrésencesToEtudiant(currentPrésence);
            }
        }
    }

    @Transactional(readOnly = false)
    public void OnSurveillantJoin(Enseignant enseignant, String codeEnseignant) throws IOException {
        WebSocketUser surveillantSession = sessionsUserMap.get(enseignant);
        SessionExamen sessionExamen = getSessionExamenFromSurveillant(codeEnseignant, enseignant);
        if (sessionExamen == null) {
            sendData(enseignant,new CustomMessage(ExamRoomWebsocket.MESSAGE,"Wrong code"));
        }
        else if(sessionExamen.getState().equals(SessionExamenStates.ENDED)){
            sendData(enseignant,new CustomMessage(ExamRoomWebsocket.MESSAGE,"Session deja terminé"));
        }
        else {
            surveillantSession.setSessionExamen(sessionExamen);
            if(sessionExamen.getState().equals(SessionExamenStates.CREATED)){
                sessionExamen.setState(SessionExamenStates.OPENED);
            }
            SessionExamen newSessionExamen = getSessionExamenFromSurveillant(codeEnseignant, enseignant);
            sendPrésencesToEnseignant(newSessionExamen);
        }
    }

    public void transmitSignal(Utilisateur user,CustomMessage message) throws IOException {
        Utilisateur receiver = message.getTo();
        message.setFrom(user);
        sendData(receiver, message);
    }

    //Verification Method
    public void printData() {
        System.out.println("#############################################################");
        System.out.println("------------Connected Users------------");
        for(Utilisateur utilisateur : sessionsUserMap.keySet()){
            WebSocketUser currentSession = sessionsUserMap.get(utilisateur);
            String data = "Type:" + utilisateur.getUserRole() +
                    " Email:" + utilisateur.getEmail() +
                    " Current Session:" + (currentSession.getSessionExamen() == null ? null : currentSession.getSessionExamen().getSessionId());
            System.out.println(data);
        }
        System.out.println("#############################################################");
    }

    public void UpdatePrésence(Presences presences) throws IOException {
        if(presences.getState().equals(PrésenceEtats.BLOQUER)) {
            CustomMessage customMessage = new CustomMessage(ExamRoomWebsocket.BLOCKED, "Le surveillant vous a bloquer pour triche");
            sendData(presences.getEtudiant(), customMessage);
        }
        else if (presences.getSessionExamen().getState().equals(SessionExamenStates.STARTED) && presences.getState().equals(PrésenceEtats.ABSENT)){
            CustomMessage customMessage = new CustomMessage(ExamRoomWebsocket.BLOCKED, "Le surveillant vous a juger absent dans cette session");
            sendData(presences.getEtudiant(), customMessage);
        }
        else if (presences.getSessionExamen().getState().equals(SessionExamenStates.ENDED)){
            CustomMessage customMessage = new CustomMessage(ExamRoomWebsocket.BLOCKED, "Le surveillant vous a bloquer pour triche");
            sendData(presences.getEtudiant(), customMessage);
        }
        sendPrésencesToEtudiant(presences);
    }

    //Sending methods
    public void sendPrésencesToEnseignant(SessionExamen sessionExamen) throws IOException {

        Enseignant enseignant = sessionExamen.getSurveillant();

        List<Presences> currentPrésences = sessionExamen.getPrésences().stream().filter(présences -> {
            Etudiant etudiant = présences.getEtudiant();
            WebSocketUser etudiantSession = sessionsUserMap.get(etudiant);
            if(etudiantSession != null){
                return (etudiantSession.getSessionExamen() == null ? false : etudiantSession.getSessionExamen().equals(sessionExamen));
            }
            return false;
        }).collect(Collectors.toList());

        CustomMessage présences = new CustomMessage(ExamRoomWebsocket.DATA,currentPrésences);
        sendData(enseignant,présences);
        CustomMessage session = new CustomMessage(ExamRoomWebsocket.SESSIONINFO,sessionExamen);
        sendData(enseignant,session);

    }

    private boolean etudiantIsInSession(Presences presences){
        Etudiant etudiant = presences.getEtudiant();
        WebSocketUser etudiantSession = sessionsUserMap.get(etudiant);
        if(etudiantSession == null) {
            return false;
        }
        SessionExamen currentSessionExamen = etudiantSession.getSessionExamen();
        return (currentSessionExamen == null ? false : currentSessionExamen.equals(presences.getSessionExamen()));
    }

    public void sendPrésencesToEtudiant(Presences presences) throws IOException {
        Etudiant etudiant = presences.getEtudiant();
        WebSocketUser etudiantSession = sessionsUserMap.get(etudiant);
        if(etudiantIsInSession(presences)){
            if(presences.getState().equals(PrésenceEtats.BLOQUER) || presences.getSessionExamen().getState().equals(SessionExamenStates.ENDED)){
                etudiantSession.getWebSocketSession().close();
            }
            else {
                CustomMessage message = new CustomMessage(ExamRoomWebsocket.DATA, presences);
                sendData(etudiant, message);
            }
        }
    }

    private void sendData(Utilisateur utilisateur,CustomMessage customMessage) throws IOException {
        WebSocketUser userSession = sessionsUserMap.get(utilisateur);
        if(userSession != null){
            WebSocketSession session = userSession.getWebSocketSession();
            if(session != null){
                ObjectMapper objectMapper = new ObjectMapper();
                String messageAsJSON = objectMapper.writeValueAsString(customMessage);
                session.sendMessage(new TextMessage(messageAsJSON));
            }
        }
    }

    //Utility Methods
    public boolean sessionExists(Utilisateur utilisateur,SessionExamen sessionExamen){
        if(sessionsUserMap.containsKey(utilisateur))
        {
            WebSocketUser userWsSession = sessionsUserMap.get(utilisateur);
            SessionExamen currentUserSession = userWsSession.getSessionExamen();
            return (currentUserSession == null ? false : currentUserSession.equals(sessionExamen));
        }
        return false;
    }

    private PlanningExamen getPlanningFromEtudiant(String codeEtudiant, Etudiant etudiant) {
        Optional<PlanningExamen> planningExamenFound = planningExamenRepo.findByEtudiantsContainingAndCodeEtudiant(etudiant,codeEtudiant);
        if (planningExamenFound.isEmpty()) {
            return null;
        }
        return planningExamenFound.get();
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
     List<Presences> getPrésencesInSession(SessionExamen sessionExamen) {
        return presencesRepo.findAllBySessionExamen(sessionExamen);
    }

    @Transactional(readOnly = false)
    Presences addPrésences(SessionExamen sessionExamen, Etudiant etudiant){
        Etudiant dbEtudiant = etudiantRepo.findById(etudiant.getUserId()).get();
        SessionExamen dbSession = sessionExamenRepo.findById(sessionExamen.getSessionId()).get();
        Presences presences = new Presences();
        presences.setEtudiant(dbEtudiant);
        presences.setSessionExamen(dbSession);
        presences.setState(PrésenceEtats.ABSENT);
        return presencesRepo.save(presences);
    }

    @Transactional(readOnly = true)
    Presences getCurrentPrésence(Etudiant etudiant, PlanningExamen planningExamen){
        Optional<Presences> currentPrésence = presencesRepo.findByEtudiantAndSessionExamenPlannings(etudiant,planningExamen);
        if(currentPrésence.isEmpty()){
            return null;
        }
        return currentPrésence.get();
    }

    private ArrayList<SessionExamen> getSessionDispo(PlanningExamen planningExamen){
        ArrayList<SessionExamen> result = (ArrayList<SessionExamen>) sessionExamenRepo.findByPlannings(planningExamen);
        result = (ArrayList<SessionExamen>) result.stream().filter(sessionExamen -> {
            return (sessionExamen.getState().equals(SessionExamenStates.OPENED));
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
        Long durationOfExam = planningExamen.getDuration();
        Long currentTime = System.currentTimeMillis();
        Long advanceTime = 30L * 60L * 1000L;
        return (currentTime + advanceTime > examTime) && (currentTime < examTime + durationOfExam);

    }
}
