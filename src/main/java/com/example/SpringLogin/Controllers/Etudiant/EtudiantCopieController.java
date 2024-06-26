package com.example.SpringLogin.Controllers.Etudiant;

import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EtudiantService.EtudiantCopieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/etudiant/copie")
public class EtudiantCopieController {
    @Autowired
    private EtudiantCopieService etudiantCopieService;

    @GetMapping("")
    public ResponseEntity<?> getCopies(){
        return new ResponseEntity<>(etudiantCopieService.getCopies(), HttpStatus.OK);
    }

    @PutMapping("/{copieId}")
    public ResponseEntity<?> reclamOnCorrection(@RequestParam(name = "copieId") Long copieId, @RequestBody String subject){
        try{
            etudiantCopieService.sendReclamation(copieId,subject);
            return new ResponseEntity<>("Complaint saved",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }
}
