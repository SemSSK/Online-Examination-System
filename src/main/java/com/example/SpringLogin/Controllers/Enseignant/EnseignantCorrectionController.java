package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EnseignantService.CorrectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/enseignant/correction")
public class EnseignantCorrectionController {


    private final CorrectionService correctionService;

    public EnseignantCorrectionController(CorrectionService correctionService) {
        this.correctionService = correctionService;
    }


    @GetMapping("/module={moduleId}")
    public ResponseEntity<?> getCopies(@PathVariable(name = "moduleId") Long moduleId){
        try{
            return new ResponseEntity<>(correctionService.getCopiesByModule(moduleId), HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/examen={examenId}")
    public ResponseEntity<?> getCopiesByExamen(@PathVariable(name = "examenId") Long examenId){
        try{
            return new ResponseEntity<>(correctionService.getCopiesByExamen(examenId), HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{copieId}")
    public ResponseEntity<?> getCopy(@PathVariable(name = "copieId") Long id){
        try{
            return new ResponseEntity<>(correctionService.getCopy(id), HttpStatus.OK);
        }catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }


    @PutMapping("")
    public ResponseEntity<?> correctCopie(@RequestBody Copie copie){
        try{
            correctionService.CorrectCopy(copie);
            return new ResponseEntity<>("Copie corrected", HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }



}
