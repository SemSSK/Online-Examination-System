package com.example.SpringLogin.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Presences implements Serializable{

    @EmbeddedId
    private EtudiantSessionKey PrésenceId = new EtudiantSessionKey();

    private String state;
    private String justification;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etudiant_id")
    @MapsId("etudiantId")
    private Etudiant etudiant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sessionexamen_id")
    @MapsId("sessionId")
    private SessionExamen sessionExamen;

    @OneToOne(mappedBy = "presences",fetch = FetchType.LAZY)
    @JsonIgnore
    private JustificationAbsence justificationAbsence;

    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof Presences)){
            return false;
        }

        Presences presences = (Presences)obj;

        return this.PrésenceId.equals(presences.PrésenceId);
    }

    @Override
    public int hashCode() {
        return this.PrésenceId.hashCode();
    }
}
