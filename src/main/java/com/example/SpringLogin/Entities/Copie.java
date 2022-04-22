package com.example.SpringLogin.Entities;

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
public class Copie  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long copieId;
    private String observation;
    private float note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    @JsonIgnore
    private Examen exam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @OneToMany(mappedBy = "copie",fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    private Collection<Reponse> reponses = new ArrayList<>();

    @OneToOne(mappedBy = "copie",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Reclamation reclamation;

    @Override
    public boolean equals(Object obj)
    {
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Copie)){
            return false;
        }

        Copie copie = (Copie) obj;

        return this.copieId.equals(copie.copieId);
    }
}
