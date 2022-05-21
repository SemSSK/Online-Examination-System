package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CopieRepo extends JpaRepository<Copie,Long> {
    public List<Copie> findAllByExam(Examen examen);
    public List<Copie> findAllByEtudiant(Etudiant etudiant);
}
