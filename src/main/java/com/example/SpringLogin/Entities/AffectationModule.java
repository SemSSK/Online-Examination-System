package com.example.SpringLogin.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AffectationModule  implements Serializable {

    @Id
    @EmbeddedId
    private AffectationModuleKey affectationModuleId;
    @Column(name = "valueType")
    private String type;
    private Timestamp affectationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enseignant_id")
    @MapsId("enseignantId")
    private Enseignant enseignant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "module_id")
    @MapsId("moduleId")
    private Module module;

    @Override
    public boolean equals(Object obj){
        if(obj == this){
            return true;
        }

        if(!(obj instanceof AffectationModule)){
            return false;
        }

        AffectationModule affectationModule = (AffectationModule) obj;

        return this.affectationModuleId.equals(affectationModule.affectationModuleId);
    }
}
