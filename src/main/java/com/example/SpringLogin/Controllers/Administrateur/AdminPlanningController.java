package com.example.SpringLogin.Controllers.Administrateur;


import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Services.AdminService.AdminPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/planning")
public class AdminPlanningController {

    @Autowired
    private AdminPlanningService adminPlanningService;

    @GetMapping("")
    public ResponseEntity<?> getPlannings(){
        return new ResponseEntity<>(adminPlanningService.getPlannings(), HttpStatus.OK);
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<?> getSessions(@PathVariable(name = "id") Long planId){
        return new ResponseEntity<>(adminPlanningService.getSessionInPlanning(planId),HttpStatus.OK);
    }


    @PostMapping("")
    public ResponseEntity<?> addPlannings(@RequestBody PlanningExamen planningExamen){
        try{
            return new ResponseEntity<>(adminPlanningService.addPlanning(planningExamen),HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("")
    public ResponseEntity<?> modifyPlannings(@RequestBody PlanningExamen planningExamen){
        try{
            return new ResponseEntity<>(adminPlanningService.modPlanning(planningExamen),HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlannings(@PathVariable(name = "id") Long planId){
        try{
            return new ResponseEntity<>(adminPlanningService.deletePlanning(planId),HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }

}
