package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrésencesRepo extends JpaRepository<Présences, EtudiantSessionKey> {

    public Optional<Présences> findByEtudiantAndSessionExamen(Etudiant etudiant, SessionExamen sessionExamen);
    public Optional<Présences> findByEtudiantAndSessionExamenPlannings(Etudiant etudiant, PlanningExamen planningExamen);
    public List<Présences> findAllBySessionExamen(SessionExamen sessionExamen);
}
