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
public class Reponse implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long reponseId;
    private String content;
    private float points;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "copie_id")
    @JsonIgnore
    private Copie copie;

    @ManyToOne(fetch = FetchType.EAGER)
    private ExamenQuestions question;

    @Override
    public boolean equals(Object obj) {

        if(obj == this){
            return true;
        }

        if(!(obj instanceof Reponse)){
            return false;
        }

        Reponse reponse = (Reponse)obj;

        return this.reponseId.equals(reponse.reponseId);
    }

    public boolean reponsesPointsAreValid(float points){
        return this.points >= 0 && this.points <= points;
    }

}
