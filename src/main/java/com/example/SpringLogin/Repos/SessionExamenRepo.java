package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionExamenRepo extends JpaRepository<SessionExamen,Long> {
    List<SessionExamen> findByPlannings(PlanningExamen planningExamen);
    Optional<SessionExamen> findByPlanningsAndSurveillant(PlanningExamen planningExamen, Enseignant enseignant);
}
