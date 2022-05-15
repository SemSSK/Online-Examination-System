package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Enumarators.Role;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Component
public class ExamRoomWebsocket extends TextWebSocketHandler {

    private ContextHandlerClass contextHandlerClass;
    private WebSocketService webSocketService;

    public ExamRoomWebsocket(ContextHandlerClass contextHandlerClass,WebSocketService webSocketService){
        this.contextHandlerClass = contextHandlerClass;
        this.webSocketService = webSocketService;
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        webSocketService.saveConnectedUser(session,utilisateur);
        webSocketService.printData();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        CustomMessage customMessage = objectMapper.readValue(message.getPayload().getBytes(),CustomMessage.class);

        Utilisateur user = contextHandlerClass.getUserFromWebSocketSession(session);

        if(customMessage.type.equals(CustomMessage.CODE)){
            String code = (String) customMessage.getPayload();
            webSocketService.removeUserTrace(user);
            if(user.getUserRole().equals(Role.ETUDIANT)){
                webSocketService.OnEtudiantJoin((Etudiant) user,code);
            }
            else if(user.getUserRole().equals(Role.ENSEIGNANT)){
                webSocketService.OnSurveillantJoin((Enseignant) user,code);
            }
        }
        else if(customMessage.type.equals(CustomMessage.SIGNAL)){
             webSocketService.transmitSignal(user,customMessage);
        }

        webSocketService.printData();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        webSocketService.CloseUserConnection(utilisateur);
        webSocketService.printData();
    }


}
