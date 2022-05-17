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
public class Question implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long questionId;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private String typeAnswer;
    private int points;
    private String tags;
    @Column(nullable = false)
    private Timestamp dateCreation;
    private String description;
    private int nbrOccurences = 0;
    private float rating;
    private int nbrRaitings = 0;

    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "question",orphanRemoval = true)
    @JsonIgnore
    private Collection<ExamenQuestions> examenQuestions = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "module_id")
    private Module module;


    public void removeFromAllExams(){
        this.examenQuestions.forEach(examenQuestions -> {
            examenQuestions.removeQuestion();
        });
        this.examenQuestions.removeAll(examenQuestions);
    }

    public void removeFromExam(ExamenQuestions examenQuestions){
        this.examenQuestions.remove(examenQuestions);
    }

    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof Question)){
            return false;
        }

        Question question = (Question)obj;

        return this.questionId.equals(question.questionId);
    }
}
