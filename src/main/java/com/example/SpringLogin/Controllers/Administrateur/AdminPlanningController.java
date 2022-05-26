package com.example.SpringLogin.Controllers.Administrateur;


import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Exception.systemException;
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
        try{
            return new ResponseEntity<>(adminPlanningService.getSessionInPlanning(planId),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception e){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("")
    public ResponseEntity<?> addPlannings(@RequestBody PlanningExamen planningExamen){
        try{
            return new ResponseEntity<>(adminPlanningService.addPlanning(planningExamen),HttpStatus.OK);

        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception e){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("")
    public ResponseEntity<?> editPlanning(@RequestBody PlanningExamen planningExamen){
        try{
            return new ResponseEntity<>(adminPlanningService.editPlanning(planningExamen),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception e){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlannings(@PathVariable(name = "id") Long planId){
        try{
            return new ResponseEntity<>(adminPlanningService.deletePlanning(planId),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception e){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

}
