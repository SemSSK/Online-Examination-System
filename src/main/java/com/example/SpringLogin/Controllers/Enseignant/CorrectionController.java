package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.Examen;
import com.example.SpringLogin.Entities.Reponse;
import com.example.SpringLogin.Services.EnseignantService.CorrectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/enseignant/correction")
public class CorrectionController {

    @Autowired
    private CorrectionService correctionService;


    @GetMapping("/module={moduleId}")
    public ResponseEntity<?> getCopies(@PathVariable(name = "moduleId") Long id){
        try{
            return new ResponseEntity<>(correctionService.getCopies(id), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{copieId}")
    public ResponseEntity<?> getCopy(@PathVariable(name = "copieId") Long id){
        try{
            return new ResponseEntity<>(correctionService.getCopy(id), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }


    @PutMapping("")
    public ResponseEntity<?> correctCopie(@RequestBody Copie copie){
        try{
            correctionService.CorrectCopy(copie);
            return new ResponseEntity<>("Copie corrected", HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }



}
