package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/enseignant")
@AllArgsConstructor
public class enseignantController {

    @Autowired
    private ContextHandlerClass contextHandlerClass;

    @GetMapping("")
    private ResponseEntity<Enseignant> getProfil(){
        return new ResponseEntity<>((Enseignant)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur(), HttpStatus.OK);
    }


}
