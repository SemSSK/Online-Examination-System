package com.example.SpringLogin.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamenQuestions implements Serializable {

    @EmbeddedId
    private ExamenQuestionsKey examenQuestionsKey = new ExamenQuestionsKey();
    @Column(nullable = false)
    private int questionNumber;
    @Column(nullable = false)
    private float points;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="question_id")
    @MapsId("questionId")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    @MapsId("examId")
    @JsonIgnore
    private Examen examen;


    @OneToMany(mappedBy = "question",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Reponse> reponses = new ArrayList<>();

    public void removeQuestion(){
        this.examen.removeQuestion(this);
        this.examen = null;
    }

    public void removeExamen(){
        this.question.removeFromExam(this);
        this.examen = null;
    }

    @Override
    public boolean equals(Object obj){
        if(obj == this){
            return true;
        }

        if(!(obj instanceof ExamenQuestions)){
            return false;
        }

        ExamenQuestions examenQuestions = (ExamenQuestions) obj;

        return this.examenQuestionsKey.equals(examenQuestions.examenQuestionsKey);
    }
}
