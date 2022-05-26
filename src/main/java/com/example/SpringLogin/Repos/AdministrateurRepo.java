package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministrateurRepo extends JpaRepository<Administrateur, Long> {

    Administrateur findByEmail(String email);
}
