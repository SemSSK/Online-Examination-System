package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Entities.PlanningExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanningExamenRepo extends JpaRepository<PlanningExamen,Long> {

    public List<PlanningExamen> findAllByModule(Module module);
    public Optional<PlanningExamen> findByCodeEtudiant(String codeEtudiant);
}
