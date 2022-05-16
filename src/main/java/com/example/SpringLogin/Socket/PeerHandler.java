package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Entities.Utilisateur;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class PeerHandler extends TextWebSocketHandler {


    private ContextHandlerClass contextHandlerClass;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<Utilisateur , WebSocketSession> utilisateurToSession = new ConcurrentHashMap<>();
    private final Map<Map<Utilisateur,Utilisateur>, SessionExamen> negotiations = new ConcurrentHashMap<>();
    private static final String NEGOTIATE = "negotiate";
    private static final String OFFER = "offer";
    private static final String ANSWER = "answer";
    private static final String ICE = "ice";

    public PeerHandler(ContextHandlerClass contextHandlerClass){
        this.contextHandlerClass = contextHandlerClass;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.debug("[ws] Session has been closed with status {}", status);

        final Utilisateur utilisateur = utilisateurToSession.entrySet()
                .stream()
                .filter(entry -> entry.getValue().equals(session))
                .map(Map.Entry::getKey)
                .findFirst().orElse(null);
        if( utilisateur != null) {
            utilisateurToSession.remove(utilisateur);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        utilisateurToSession.put(utilisateur,session);
        System.out.println("connection established: "+utilisateur);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
        try{
            WebRTCMessage message = objectMapper.readValue(textMessage.getPayload() , WebRTCMessage.class);
            System.out.println("[ws] message of " +message.getType()+ "type from "+ message.getFrom().getEmail()+" received, room :"+  message.getSessionExamen().getSessionId() +" data : "+message.getTo().getEmail());
            Utilisateur from = message.getFrom();
            Utilisateur to = message.getTo();

            switch (message.getType()) {
                case NEGOTIATE: {
                    final SessionExamen  sessionExamen = negotiations.get(Map.of(to , from));
                    if(sessionExamen != null) {
                        log.debug("SENDING NEGOTIATE MESSAGE  {}", from.getEmail());
                        sendMessage(session, WebRTCMessage.builder().from(to).sessionExamen(sessionExamen)
                                .type(NEGOTIATE).build());
                    } else {
                        negotiations.put(Map.of(from, to), sessionExamen);
                    }

                    break;
                }

                case OFFER:
                case ANSWER:
                case ICE: {
                    Object candidate = message.getCandidate();
                    Object sdp = message.getSdp();
                    SessionExamen sessionExamen = message.getSessionExamen();
                    if(sessionExamen != null) {
                        final WebSocketSession socketSession = utilisateurToSession.get(to);
                        if(socketSession != null ) {
                            sendMessage(socketSession  , WebRTCMessage.builder().from(from).type(message.getType())
                                    .sdp(sdp).candidate(candidate).sessionExamen(sessionExamen).build());
                        }
                    }
                    break;
                }

                default:{
                    log.debug("[ws] type of the received message {} is undefined", message.getType());
                }

            }

        } catch (IOException  e) {

            log.debug("Error : {}", e.getMessage());
        }
    }

    private void sendMessage(WebSocketSession session, WebRTCMessage message) {
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


}
