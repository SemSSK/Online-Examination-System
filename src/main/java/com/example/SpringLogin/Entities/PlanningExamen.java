package com.example.SpringLogin.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanningExamen implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long planId;

    @Column(nullable = false)
    private Timestamp dateOfExame;
    @Column(nullable = false)
    private Long duration;
    @Column(nullable = false,unique = true)
    private String codeSurveillant;
    @Column(nullable = false,unique = true)
    private String codeEtudiant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="admin_id")
    @JsonIgnore
    private Administrateur admin;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(joinColumns = @JoinColumn(name = "plan_id"),
            inverseJoinColumns = @JoinColumn(name = "etudiant_id"))
    private Collection<Etudiant> etudiants = new ArrayList<>();

    @OneToMany(mappedBy = "plannings",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<SessionExamen> sessionExamens = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="module_id")
    private Module module;

    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof PlanningExamen)){
            return false;
        }

        PlanningExamen planningExamen = (PlanningExamen)obj;

        return this.planId.equals(planningExamen.planId);
    }

    @Override
    public int hashCode() {
        return planId.hashCode();
    }
}
