package com.example.SpringLogin.Controllers.Administrateur;

import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.AdminService.AdminPresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/presence")
public class AdminPresenceController {
    @Autowired
    private AdminPresenceService adminPresenceService;

    @GetMapping("/{planId}")
    public ResponseEntity<?> getPresences(@RequestParam(name = "planId")Long planId){
        try {
            return new ResponseEntity<>(adminPresenceService.getPresences(planId), HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }


    @GetMapping("/absent/{planId}")
    public ResponseEntity<?> getEtudiantWithoutPrésence(@RequestParam(name = "planId")Long planId){
        try{
            return new ResponseEntity<>(adminPresenceService.findEtudiantWithoutPrésences(planId),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }
}
