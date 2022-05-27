package com.example.SpringLogin.Entities;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JustificationAbsence implements Serializable {

    @Id
    @OneToOne(fetch = FetchType.EAGER)
    private Presences presences;

    @Column(nullable = false)
    private String url;
    @Column(nullable = false)
    private String description;

    @Override
    public boolean equals(Object obj){
        if(obj == this){
            return true;
        }

        if(!(obj instanceof JustificationAbsence)){
            return false;
        }

        JustificationAbsence justificationAbsence = (JustificationAbsence) obj;

        return this.presences.equals(justificationAbsence.presences);
    }
}
