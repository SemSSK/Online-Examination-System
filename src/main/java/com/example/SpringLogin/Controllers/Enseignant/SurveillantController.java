package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Services.EnseignantService.SurveillantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enseignant/surveillance")
public class SurveillantController {

    @Autowired
    private SurveillantService surveillantService;

    @PutMapping("/{codesurveillant}/activate")
    private ResponseEntity<?> startSession(@PathVariable(name = "codesurveillant")String codeSurveillant){
        try{
            surveillantService.StartSession(codeSurveillant);
            return new ResponseEntity<>("Session started",HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/deactivate")
    private ResponseEntity<?> endSession(@PathVariable(name = "codesurveillant")String codeSurveillant){
        try{
            surveillantService.endSession(codeSurveillant);
            return new ResponseEntity<>("Session ended",HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/bloquer")
    private ResponseEntity<?> blockEtudiant(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                              @RequestBody Etudiant etudiant){
        try{
            //Surveillant service blocks etudiant here
            return new ResponseEntity<>("Etudiant bloquer",HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/présence")
    private ResponseEntity<?> MarkEtudiantPresent(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                              @RequestBody Etudiant etudiant){
        try{
            //Surveillant service marks etudiant as present here
            return new ResponseEntity<>("Etudiant Présent",HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

}
