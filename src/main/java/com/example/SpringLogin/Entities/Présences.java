package com.example.SpringLogin.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Présences implements Serializable{

    @EmbeddedId
    private EtudiantSessionKey PrésenceId;

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

    @OneToOne(mappedBy = "présences",fetch = FetchType.LAZY)
    private JustificationAbsence justificationAbsence;

    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof Présences)){
            return false;
        }

        Présences présences = (Présences)obj;

        return this.PrésenceId.equals(présences.PrésenceId);
    }


}
