package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresencesRepo extends JpaRepository<Presences, EtudiantSessionKey> {

    public Optional<Presences> findByEtudiantAndSessionExamen(Etudiant etudiant, SessionExamen sessionExamen);
    public Optional<Presences> findByEtudiantAndSessionExamenPlannings(Etudiant etudiant, PlanningExamen planningExamen);
    public List<Presences> findAllBySessionExamenPlanningsPlanId(Long planId);
    public List<Presences> findAllBySessionExamen(SessionExamen sessionExamen);
}
