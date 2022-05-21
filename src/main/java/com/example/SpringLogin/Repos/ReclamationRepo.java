package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReclamationRepo extends JpaRepository<Reclamation,Long> {
}
