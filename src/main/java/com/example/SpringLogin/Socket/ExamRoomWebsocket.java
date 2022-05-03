package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Enumarators.Role;
import org.springframework.stereotype.Component;
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
        String code = message.getPayload().toString();
        Utilisateur user = contextHandlerClass.getUserFromWebSocketSession(session);
        webSocketService.removeUserTrace(user);
        if(user.getUserRole().equals(Role.ETUDIANT)){
            webSocketService.OnEtudiantJoin((Etudiant) user,code);
        }
        else if(user.getUserRole().equals(Role.ENSEIGNANT)){
            webSocketService.OnSurveillantJoin((Enseignant) user,code);
        }
        webSocketService.printData();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Utilisateur utilisateur = contextHandlerClass.getUserFromWebSocketSession(session);
        webSocketService.removeUserTrace(utilisateur);
        webSocketService.CloseUserConnection(utilisateur);
        webSocketService.printData();
    }


}
