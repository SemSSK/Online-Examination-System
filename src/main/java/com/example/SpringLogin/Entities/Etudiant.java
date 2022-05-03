package com.example.SpringLogin.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant extends Utilisateur {

    @Column(nullable = false)
    private String niveau;
    @Column(nullable = false)
    private int section;
    @Column(nullable = false)
    private int groupe;

    @OneToMany(mappedBy="etudiant",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Copie> copies = new ArrayList<>();

    @OneToMany(mappedBy = "etudiant",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Enregistrement> enregistrements = new ArrayList<>();

    @OneToMany(mappedBy = "etudiant",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Présences> présences = new ArrayList<>();

    @ManyToMany(mappedBy = "etudiants",fetch = FetchType.LAZY)
    @JsonIgnore
    private Collection<PlanningExamen> planningExamens = new ArrayList<>();

    @Override
    public boolean equals(Object obj)
    {
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Etudiant)){
            return false;
        }

        Etudiant etudiant = (Etudiant) obj;

        return this.getUserId().equals(etudiant.getUserId());
    }
}
