package com.example.SpringLogin.Controllers.Etudiant;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.SessionExamen;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EtudiantService.EtudiantExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("etudiant/examen")
public class EtudiantExamenController {

    @Autowired
    private EtudiantExamenService etudiantExamenService;


    @PostMapping("/{codeetudiant}")
    public ResponseEntity<?> getExamen(@PathVariable(name = "codeetudiant") String codeEtudiant){
        try{
            return new ResponseEntity<>(etudiantExamenService.getExamen(codeEtudiant), HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/{codeetudiant}/copie")
    public ResponseEntity<?> postCopie(@PathVariable(name = "codeetudiant") String codeEtudiant, @RequestBody Copie copie){
        try{
            etudiantExamenService.PostCopie(codeEtudiant,copie);
            return new ResponseEntity<>("Copie successfully added",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }
}
