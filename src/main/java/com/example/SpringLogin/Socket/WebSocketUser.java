package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Entities.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WebSocketUser {
    private WebSocketSession webSocketSession;
    private Utilisateur utilisateur;
    private SessionExamen sessionExamen;

    public WebSocketUser(WebSocketSession webSocketSession,Utilisateur utilisateur){
        this.webSocketSession = webSocketSession;
        this.utilisateur = utilisateur;
        this.sessionExamen = null;
    }
}
