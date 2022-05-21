package com.example.SpringLogin.Controllers.Administrateur;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Présences;
import com.example.SpringLogin.Repos.PrésencesRepo;
import com.example.SpringLogin.Services.AdminService.AdminPresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/presence")
public class AdminPresenceController {
    @Autowired
    private AdminPresenceService adminPresenceService;

    @GetMapping("/{planId}")
    public ResponseEntity<?> getPrésences(@RequestParam(name = "planId")Long planId){
        return new ResponseEntity<>(adminPresenceService.getPrésences(planId), HttpStatus.OK);
    }


    @GetMapping("/absent/{planId}")
    public ResponseEntity<?> getEtudiantWithoutPrésence(@RequestParam(name = "planId")Long planId){
        try{
            return new ResponseEntity<>(adminPresenceService.findEtudiantWithoutPrésences(planId),HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
    }
}
