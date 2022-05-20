package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.AffectationModule;
import com.example.SpringLogin.Entities.AffectationModuleKey;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Enumarators.teachingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffectationModuleRepo
        extends JpaRepository<AffectationModule, AffectationModuleKey> {

    public Optional<AffectationModule> findByEnseignantAndModule(Enseignant enseignant, Module module);
    public Optional<AffectationModule> findByEnseignantUserIdAndModuleId(Long enseignantId,Long moduleId);

    public List<AffectationModule> findAllByEnseignant(Enseignant enseignant);

    public List<AffectationModule> findAllByModule(Module module);

    public AffectationModule findAllByModuleAndType(Module module, teachingType course);

    public void deleteByModuleAndEnseignant(Module module, Enseignant enseignant);
}
