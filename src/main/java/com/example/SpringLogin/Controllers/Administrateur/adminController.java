package com.example.SpringLogin.Controllers.Administrateur;

import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Repos.EnseignantRepo;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.ModuleRepo;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class adminController {
    @Autowired
    private EnseignantRepo enseignantRepo;
    @Autowired
    private EtudiantRepo etudiantRepo;
    @Autowired
    private ModuleRepo moduleRepo;

    @GetMapping("/ens")
    private ResponseEntity<?> getEnseignant(){
        return new ResponseEntity<>(enseignantRepo.findAll(), HttpStatus.OK);
    }

    @GetMapping("/etu")
    private ResponseEntity<?> getEtudiant(){
        return new ResponseEntity<>(etudiantRepo.findAll(),HttpStatus.OK);
    }

    @GetMapping("/module")
    private ResponseEntity<?> getModules(){
        return new ResponseEntity<>(moduleRepo.findAll(),HttpStatus.OK);
    }

}
