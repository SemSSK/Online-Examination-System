package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.AffectationModuleKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministrateurRepo extends JpaRepository<Administrateur, Long> {
}
