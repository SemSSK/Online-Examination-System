package com.example.SpringLogin.Controllers.Etudiant;


import com.example.SpringLogin.Services.EtudiantService.EtudiantPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/etudiant/planning")
public class EtudiantPlanningController {

    @Autowired
    private EtudiantPlanningService etudiantPlanningService;

    @GetMapping("")
    public ResponseEntity<?> getExamsSchedual(){
        return new ResponseEntity<>(etudiantPlanningService.getExamSchedual(), HttpStatus.OK);
    }
}
