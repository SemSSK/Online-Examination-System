package com.example.SpringLogin.Controllers.Utilisateur;

import com.example.SpringLogin.Configrations.SecurityServices.ActivationCodeService;
import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Configrations.SecurityServices.CustomUserDetails;
import com.example.SpringLogin.Entities.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Map;

@RestController
@RequestMapping("/authorization")
public class AuthorizationController {

    @Autowired
    private ContextHandlerClass contextHandlerClass;

    @Autowired
    private ActivationCodeService activationCodeService;


    @PostMapping("/activate")
    public ResponseEntity<String> activate(@RequestBody Map<String,String> activation_code){

        CustomUserDetails user = contextHandlerClass.getCurrentLoggedInUser();

        String enteredCode = activation_code.get("code");

        if(activationCodeService.treatCode(user.getUsername(),enteredCode)){
            contextHandlerClass.setCurrentLoggedInUserAuthorities();
            return new ResponseEntity<String>(user.getUtilisateur().getUserRole(),HttpStatus.OK);
        }
        return new ResponseEntity<String>("Invalide activation code", HttpStatus.BAD_REQUEST);

    }

    @GetMapping("/userData")
    public ResponseEntity<Utilisateur> getUser(){
        return new ResponseEntity<>(contextHandlerClass.getCurrentLoggedInUser().getUtilisateur(),HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(){
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successfully");
    }

    @GetMapping("/loggedIn")
    public ResponseEntity<?> checkIfLoggedIn(){
        return ResponseEntity.ok().body(contextHandlerClass.getCurrentLoggedInUser().getUtilisateur().getUserRole());
    }
}
