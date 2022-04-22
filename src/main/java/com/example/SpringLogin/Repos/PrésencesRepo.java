package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.EtudiantSessionKey;
import com.example.SpringLogin.Entities.Présences;
import com.example.SpringLogin.Entities.SessionExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrésencesRepo extends JpaRepository<Présences, EtudiantSessionKey> {

    public Optional<Présences> findByEtudiantAndSessionExamen(Etudiant etudiant, SessionExamen sessionExamen);

}
