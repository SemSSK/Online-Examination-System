package com.example.SpringLogin.Entities;

import com.example.SpringLogin.Enumarators.SessionExamenStates;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionExamen implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long sessionId;

    private String state = SessionExamenStates.CREATED;

    @OneToMany(mappedBy = "sessionExamen",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Présences> présences = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name ="planning_id")
    private PlanningExamen plannings;

    @OneToMany(mappedBy = "sessionExamen",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Enregistrement> enregistrements = new ArrayList<>();

    @OneToOne(mappedBy = "sessionExamen",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private ProcesSurSession procesSurSessions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "surveillant_id")
    private Enseignant surveillant;


    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof SessionExamen)){
            return false;
        }

        SessionExamen sessionExamen = (SessionExamen)obj;

        return this.sessionId.equals(sessionExamen.sessionId);
    }

    @Override
    public int hashCode() {
        return sessionId.hashCode();
    }

    public void setToNextState(){
        String nextState = SessionExamenStates.CREATED;
        if(state.equals(SessionExamenStates.CREATED)){
            nextState = SessionExamenStates.OPENED;
        }
        else if(state.equals(SessionExamenStates.OPENED)){
            nextState = SessionExamenStates.STARTED;
        }
        else if(state.equals(SessionExamenStates.STARTED)){
            nextState = SessionExamenStates.ENDED;
        }
        state = nextState;
    }
}
