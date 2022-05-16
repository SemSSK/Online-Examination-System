package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Entities.Utilisateur;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebRTCMessage {

    private Utilisateur from; //
    private Utilisateur to; //
    private SessionExamen sessionExamen;
    private String type;
    private Object candidate;
    private Object sdp;


}
