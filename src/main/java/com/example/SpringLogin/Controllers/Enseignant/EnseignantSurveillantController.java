package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Enumarators.PrésenceEtats;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EnseignantService.SurveillantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enseignant/surveillance")
public class EnseignantSurveillantController {

    @Autowired
    private SurveillantService surveillantService;

    @PutMapping("/{codesurveillant}/advance-state")
    private ResponseEntity<?> advanceSessionState(@PathVariable(name = "codesurveillant")String codeSurveillant){
        try{
            surveillantService.ChangeSessionActivationState(codeSurveillant);
            return new ResponseEntity<>("Session started",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }



    @PutMapping("/{codesurveillant}/present")
    private ResponseEntity<?> MarkEtudiantPresent(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                                  @RequestBody Etudiant etudiant){
        try{
            surveillantService.ChangeEtudiantPresenceState(codeSurveillant,etudiant,PrésenceEtats.PRESENT);
            return new ResponseEntity<>("Etudiant Présent",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/absent")
    private ResponseEntity<?> MarkEtudiantAbsent(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                                  @RequestBody Etudiant etudiant){
        try{
            surveillantService.ChangeEtudiantPresenceState(codeSurveillant,etudiant,PrésenceEtats.ABSENT);
            return new ResponseEntity<>("Etudiant Présent",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/block")
    private ResponseEntity<?> blockEtudiant(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                              @RequestBody Etudiant etudiant){
        try{
            surveillantService.ChangeEtudiantPresenceState(codeSurveillant,etudiant, PrésenceEtats.BLOQUER);
            return new ResponseEntity<>("Etudiant bloquer",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{codesurveillant}/unblock")
    private ResponseEntity<?> unblockEtudiant(@PathVariable(name = "codesurveillant")String codeSurveillant,
                                            @RequestBody Etudiant etudiant){
        try{
            surveillantService.ChangeEtudiantPresenceState(codeSurveillant,etudiant, PrésenceEtats.ABSENT);
            return new ResponseEntity<>("Etudiant bloquer",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }


}
