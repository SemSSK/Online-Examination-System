package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReponseRepo extends JpaRepository<Reponse,Long> {
}
