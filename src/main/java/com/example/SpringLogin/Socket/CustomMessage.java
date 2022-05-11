package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomMessage {
    static final String MESSAGE = "message",
    DATA = "data",
    BLOCKED = "blocked",
    SESSIONINFO = "session-info",
    CODE = "code",
    SIGNAL = "signal";
    String type;
    Utilisateur to = null;
    Utilisateur from = null;
    Object payload;
    public CustomMessage(String type,Object payload){
        this.type = type;
        this.payload = payload;
    }
}
