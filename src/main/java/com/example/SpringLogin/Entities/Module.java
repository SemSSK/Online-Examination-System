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
public class Module implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false)
    private String nomModule;

    @Column(nullable = false, unique = true)
    private String moduleAbrv;

    @Column(nullable = false)
    private int coefficient;
    @Column(nullable = false)
    private String niveau;
    @Column(nullable = false)
    private boolean hasTDTP;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Administrateur admin;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "module",cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Question> questions;

    @OneToMany(mappedBy = "module",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<AffectationModule> affectationModules = new ArrayList<>();

    @OneToMany(mappedBy = "module",fetch = FetchType.LAZY,cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Collection<PlanningExamen> planningExamen = new ArrayList<>();

    @OneToOne(mappedBy = "module",fetch = FetchType.LAZY,cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Examen examen;

    @Override
    public boolean equals(Object obj){
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Module)){
            return false;
        }

        Module module = (Module) obj;

        return this.id.equals(module.id);
    }
}
