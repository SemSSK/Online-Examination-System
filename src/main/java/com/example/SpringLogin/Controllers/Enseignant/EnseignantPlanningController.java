package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Services.EnseignantService.EnseignantPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/enseignant/planning")
public class EnseignantPlanningController {
    @Autowired
    private EnseignantPlanningService enseignantPlanningService;

    @GetMapping("/surveillance")
    public ResponseEntity<?> getExamsToProctor(){
        return new ResponseEntity<>(enseignantPlanningService.getPlanningsToProctor(), HttpStatus.OK);
    }


    @GetMapping("/module")
    public ResponseEntity<?> getExamsOfModules(){
        return new ResponseEntity<>(enseignantPlanningService.getPlanningsOfModules(),HttpStatus.OK);
    }
}
