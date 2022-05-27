package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.PlanningExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtudiantRepo extends JpaRepository<Etudiant,Long> {
    Etudiant findByEmail(String email);
    List<Etudiant> findAllByPlanningExamensContainingAndUserIdNotIn(PlanningExamen planningExamen, List<Long> etudiantIds);
}
