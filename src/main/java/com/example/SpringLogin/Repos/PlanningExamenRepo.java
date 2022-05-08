package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanningExamenRepo extends JpaRepository<PlanningExamen,Long> {

    public List<PlanningExamen> findAllByModule(Module module);
    public List<PlanningExamen> findAllByAdmin(Administrateur administrateur);
    public Optional<PlanningExamen> findByCodeEtudiant(String codeEtudiant);
    public Optional<PlanningExamen> findByCodeSurveillant(String codeSurveillant);
    public List<PlanningExamen> findAllBySessionExamensSurveillant(Enseignant surveillant);
    public List<PlanningExamen> findAllByModuleIn(List<Module> module);
    public List<PlanningExamen> findByEtudiantsContaining(Etudiant etudiant);
}
