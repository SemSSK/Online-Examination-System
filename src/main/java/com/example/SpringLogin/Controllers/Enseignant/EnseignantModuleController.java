package com.example.SpringLogin.Controllers.Enseignant;


import com.example.SpringLogin.Services.EnseignantService.EnseignantModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/enseignant/module")
public class EnseignantModuleController {
    @Autowired
    private EnseignantModuleService enseignantModuleService;

    @GetMapping("")
    public ResponseEntity<?> getModules(){
        return new ResponseEntity<>(enseignantModuleService.getAffectaton(), HttpStatus.OK);
    }
}
