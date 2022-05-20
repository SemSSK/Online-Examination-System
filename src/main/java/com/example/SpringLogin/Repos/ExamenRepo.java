package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Examen;
import com.example.SpringLogin.Entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamenRepo extends JpaRepository<Examen,Long> {
    public Optional<Examen> findByModule(Module module);
    public Optional<Examen> findByModuleId(Long id);
}
