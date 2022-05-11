package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepo extends JpaRepository<Enseignant,Long> {


}
