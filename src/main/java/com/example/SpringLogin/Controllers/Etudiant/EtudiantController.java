package com.example.SpringLogin.Controllers.Etudiant;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RequestMapping("/etudiant")
public class EtudiantController {

    @Autowired
    private ContextHandlerClass contextHandlerClass;

    @GetMapping("")
    private ResponseEntity<?> getProfile(){
        return new ResponseEntity<>((Etudiant)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur(), HttpStatus.OK);
    }
}
