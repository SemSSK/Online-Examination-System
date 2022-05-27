package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UtilisateurRepo extends JpaRepository<Utilisateur,Long> {

    Utilisateur findByEmail(String email);

}
