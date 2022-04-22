package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionExamenRepo extends JpaRepository<SessionExamen,Long> {
    List<SessionExamen> findByPlannings(PlanningExamen planningExamen);
}
