package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.Examen;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EnseignantService.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enseignant/examen")
public class EnseignantExamenController {

    @Autowired
    private ExamenService examenService;

    @GetMapping("{id}")
    public ResponseEntity<?> getExamen(@PathVariable(name = "id") Long moduleId){
        try{
            return new ResponseEntity<>(examenService.getModuleExam(moduleId), HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addExamen(@RequestBody Examen examen){
        try{
            examenService.addExamen(examen);
            return ResponseEntity.ok("Exam added successfuly");
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExamen(@PathVariable(name = "id") Long id){
        try{
            examenService.deleteExamen(id);
            return ResponseEntity.ok("Exam deleted successfuly");
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("")
    public ResponseEntity<?> modifyExamen(@RequestBody Examen examen){
        try{
            examenService.modifyExamen(examen);
            return ResponseEntity.ok("Exam Modified successfuly");
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }



}
