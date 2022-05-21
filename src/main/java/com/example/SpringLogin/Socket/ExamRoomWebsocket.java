package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Repos.SessionExamenRepo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ExamRoomWebsocket extends TextWebSocketHandler {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private WebSocketService webSocketService;
    @Autowired
    private SessionExamenRepo sessionExamenRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<Utilisateur , WebSocketSession> utilisateurToSession = new ConcurrentHashMap<>();
    private final Map<Map<Long,Long>, Long> negotiations = new ConcurrentHashMap<>();
    private static final String NEGOTIATE = "negotiate";
    private static final String OFFER = "offer";
    private static final String ANSWER = "answer";
    private static final String ICE = "ice";
     static final String MESSAGE = "message";
     static final String DATA = "data";
     static final String BLOCKED = "blocked";
     static final String SESSIONINFO = "session-info";
     static final String CODE = "code";
     static final String SIGNAL = "signal";



    public ExamRoomWebsocket(){
        System.out.println("ExamRoomWebSocket initialized");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        if(webSocketService.userExists(utilisateur)){
            session.close();
        }
        else {
            webSocketService.saveConnectedUser(session, utilisateur);
            webSocketService.printData();
            utilisateurToSession.put(utilisateur, session);
            System.out.println("connection with examroom path");
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {


        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        CustomMessage customMessage = objectMapper.readValue(message.getPayload().getBytes(),CustomMessage.class);
        Utilisateur user = contextHandlerClass.getUserFromWebSocketSession(session);
        System.out.println("new message received: "+customMessage.type);

        switch(customMessage.type){

            case CODE : {
                String code = (String) customMessage.getPayload();
                webSocketService.removeUserTrace(user,session);
                if(user.getUserRole().equals(Role.ETUDIANT)){
                    webSocketService.OnEtudiantJoin((Etudiant) user,code);
                }
                else if(user.getUserRole().equals(Role.ENSEIGNANT)){
                    webSocketService.OnSurveillantJoin((Enseignant) user,code);
                }
                break;
            }
            case NEGOTIATE: {
                Utilisateur from = customMessage.getFrom();
                Utilisateur to = customMessage.getTo();
                System.out.println("[ws] message of " +customMessage.getType()+ " type from "+ customMessage.getFrom().getUserId()+" received, room : "+  customMessage.getSessionExamen().getSessionId() +" data : "+customMessage.getTo().getUserId());

                Long  sessionExamenId = negotiations.get(Map.of(to.getUserId() , from.getUserId()));
                System.out.println("negotiates.get(): "+ negotiations.get(Map.of(to.getUserId() , from.getUserId())));
                if(sessionExamenId != null) {
                    System.out.println("SENDING NEGOTIATE MESSAGE "+ from.getEmail());

                    sendMessage(session, CustomMessage.builder().from(to)
                            .sessionExamen(sessionExamenRepo.findById(sessionExamenId).get())
                            .type(NEGOTIATE).build());
                } else {

                    negotiations.put(Map.of(from.getUserId(), to.getUserId()),
                            customMessage.getSessionExamen().getSessionId());
                }

                break;
            }

            case OFFER:
            case ANSWER:
            case ICE: {
                Utilisateur from = customMessage.getFrom();
                Utilisateur to = customMessage.getTo();
                System.out.println("[ws] message of " +customMessage.getType()+ "type from "+ customMessage.getFrom().getEmail()+" received, room :"+  customMessage.getSessionExamen().getSessionId() +" data : "+customMessage.getTo().getEmail());

                Object candidate = customMessage.getCandidate();
                Object sdp = customMessage.getSdp();
                SessionExamen sessionExamen = customMessage.getSessionExamen();
                if(sessionExamen != null) {
                    final WebSocketSession socketSession = utilisateurToSession.get(to);
                    if(socketSession != null ) {
                        sendMessage(socketSession  , CustomMessage.builder()
                                .from(from)
                                .type(customMessage.getType())
                                .sdp(sdp).candidate(candidate)
                                .sessionExamen(sessionExamen).build());
                    }
                }
                break;
            }

            default:{
                log.debug("[ws] type of the received message {} is undefined", customMessage.getType());
            }

        }


//        webSocketService.printData();
    }

    private void sendMessage(WebSocketSession session, CustomMessage message) {
        try{
            String json = objectMapper.writeValueAsString(message);
            if(session.isOpen()) {
                synchronized (session) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (IOException e) {
            log.debug("Error : {}", e.getMessage());
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        webSocketService.removeUserTrace(utilisateur,session);
        webSocketService.CloseUserConnection(utilisateur,session);
        webSocketService.printData();
        System.out.println(status.getReason());
    }


}
