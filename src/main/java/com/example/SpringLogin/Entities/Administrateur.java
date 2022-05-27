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
public class Administrateur extends Utilisateur {

    @Column(nullable = false)
    private int privilege;

    @OneToMany(mappedBy = "admin",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Utilisateur> createdUsers = new ArrayList<>();

    @OneToMany(mappedBy = "admin",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<PlanningExamen> createdPlans = new ArrayList<>();

    @OneToMany(mappedBy = "admin",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Module> createdModules = new ArrayList<>();


    @Override
    public boolean equals(Object obj)
    {
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Administrateur)){
            return false;
        }

        Administrateur administrateur = (Administrateur) obj;

        return this.getUserId().equals(administrateur.getUserId());
    }

}
