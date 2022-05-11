package com.example.SpringLogin.Entities;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AffectationModuleKey implements Serializable {
    @Column(name = "enseignant_Id")
    private Long enseignantId;

    @Column(name = "module_Id")
    private Long moduleId;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((enseignantId == null) ? 0 : enseignantId.hashCode());
        result = prime * result + ((moduleId == null) ? 0 : moduleId.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }

        if (!(obj instanceof AffectationModuleKey)) {
            return false;
        }

        AffectationModuleKey key = (AffectationModuleKey) obj;

        return (key.enseignantId.equals(this.enseignantId)
                && key.moduleId.equals(this.moduleId));
    }
}
