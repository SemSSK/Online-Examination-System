package com.example.SpringLogin.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Examen implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long examId;
    @Column(nullable = false)
    private Timestamp dateCreation;
    private String publicInfo;
    @Column(nullable = false)
    private boolean isActive = false;


    @OneToMany(mappedBy = "examen",fetch = FetchType.EAGER,cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<ExamenQuestions> examenQuestions = new ArrayList<>();

    @OneToMany(mappedBy = "exam",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Copie> copies = new ArrayList<>();

    @OneToOne(fetch = FetchType.EAGER)
    private Module module;

    public void removeAllQuestion(){
        this.examenQuestions.forEach(examenQuestions -> {
            examenQuestions.removeExamen();
        });
        this.examenQuestions.removeAll(this.examenQuestions);
    }

    public void removeQuestion(ExamenQuestions examenQuestions){
        this.examenQuestions.remove(examenQuestions);
    }

    @Override
    public boolean equals(Object obj){
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Examen)){
            return false;
        }

        Examen examen = (Examen) obj;

        return this.examId.equals(examen.examId);
    }

}
