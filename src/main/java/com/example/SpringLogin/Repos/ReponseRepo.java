package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReponseRepo extends JpaRepository<Reponse,Long> {

    List<Reponse> findByCopie (Copie copie);
}
