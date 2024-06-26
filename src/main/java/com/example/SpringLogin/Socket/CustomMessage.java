package com.example.SpringLogin.Socket;

import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Entities.Utilisateur;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomMessage {

    String type;
    Object payload;
    private Utilisateur from = null; //
    private Utilisateur to; //
    private SessionExamen sessionExamen;
    private Object candidate;
    private Object sdp;


    public CustomMessage(String type,Object payload){
        this.type = type;
        this.payload = payload;
    }
}
