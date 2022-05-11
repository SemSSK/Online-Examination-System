package com.example.SpringLogin.Controllers.Administrateur;

import com.example.SpringLogin.Entities.AffectationModule;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Services.AdminService.AdminEnseignantService;
import com.example.SpringLogin.Services.AdminService.AdminModuleService;
import com.example.SpringLogin.Services.AdminService.AffectationModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin/affectationModule")
public class affectationModuleController {

    @Autowired
    private AffectationModuleService affectationModuleService;

    @Autowired
    private AdminModuleService adminModuleService;

    @Autowired
    private AdminEnseignantService adminEnseignantService;

    @GetMapping("")
    public ResponseEntity<?> getAllAffectations(){
        System.out.println("i received request");
        return new ResponseEntity<>(affectationModuleService.getAllAffectations(), HttpStatus.OK);
    }

    @GetMapping("/getByModule/{moduleId}")
    public ResponseEntity<?> getAllAffectationsOfModule(@PathVariable(name = "moduleId") Long moduleId){

        try{
            Module module = adminModuleService.getModuleByID(moduleId); // waiting for moduleService to be created
            return new ResponseEntity<>(affectationModuleService.getAffectationsOfModule(module), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.OK);
        }
    }

    @GetMapping("/getByEnseignant/{enseignantId}")
    public ResponseEntity<?> getAllAffectationsOfEnseignant(@PathVariable(name = "enseignantId") Long enseignantId){

        try{
            Enseignant enseignant = adminEnseignantService.getEnseignantByID(enseignantId); // waiting for enseignantService to be created
            return new ResponseEntity<>(affectationModuleService.getAffectationsOfEnseignant(enseignant), HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.OK);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addAffectationModule(@RequestBody AffectationModule affectationModule){
        try{

            return new ResponseEntity<>(affectationModuleService.makeAffectation(affectationModule),HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/delete/{moduleId}/{enseignantId}")
    public ResponseEntity<?> deleteAffectationModule(@PathVariable(name = "moduleId") Long moduleId,@PathVariable(name = "enseignantId") Long enseignantId){
        try{
            Module module = adminModuleService.getModuleByID(moduleId); // waiting for moduleService to be created
            Enseignant enseignant = adminEnseignantService.getEnseignantByID(enseignantId); // waiting for enseignantService to be created
            affectationModuleService.deleteAffectation(module,enseignant);
            return new ResponseEntity<>("affectation deleted with success",HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }

}
