package com.example.SpringLogin.Controllers.Administrateur;

import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Repos.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private AdministrateurRepo administrateurRepo;


    @Autowired
    private  UtilisateurRepo utilisateurRepo;

    @Autowired
    private  PasswordEncoder passwordEncoder;

//    public adminController(UtilisateurRepo utilisateurRepo, PasswordEncoder passwordEncoder) {
//        this.utilisateurRepo = utilisateurRepo;
//        this.passwordEncoder = passwordEncoder;
//    }

    @GetMapping("/ens")
    private ResponseEntity<?> getEnseignant(){
        return new ResponseEntity<>(enseignantRepo.findAll(), HttpStatus.OK);
    }

    @GetMapping("/etu")
    private ResponseEntity<?> getEtudiant(){
        return new ResponseEntity<>(etudiantRepo.findAll(),HttpStatus.OK);
    }

    @GetMapping("/admins")
    private ResponseEntity<?> getAdmin(){
        return new ResponseEntity<>(utilisateurRepo.findAll(),HttpStatus.OK);
    }


    @GetMapping("/module")
    private ResponseEntity<?> getModules(){
        return new ResponseEntity<>(moduleRepo.findAll(),HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveAdmincontrole(@RequestBody Administrateur administrateur) {

        if (utilisateurRepo.findByEmail(administrateur.getEmail()) != null) {
            return new ResponseEntity<>("There is an account with that email address",HttpStatus.FORBIDDEN);
        }

        Administrateur administrateurInstance = new Administrateur();
        administrateurInstance.setEmail(administrateur.getEmail());
        administrateurInstance.setName(administrateur.getName());
        administrateurInstance.setLastName(administrateur.getLastName());
        administrateurInstance.setPrivilege(0);
        administrateurInstance.setAccountNonLocked(true);
        administrateurInstance.setFailedAttempt(0);
        administrateurInstance.setLockTime(null);
        administrateurInstance.setUserRole(Role.ADMIN);
        administrateurInstance.setAdmin(null);
        administrateurInstance.setPassword(passwordEncoder.encode(administrateur.getPassword()));
        return new ResponseEntity<>(administrateurRepo.save(administrateurInstance), HttpStatus.OK);
    }

}
