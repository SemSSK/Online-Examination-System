package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepo extends JpaRepository<Module,Long> {
    public List<Module> findAllByAffectationModulesEnseignant(Enseignant enseignant);
}
