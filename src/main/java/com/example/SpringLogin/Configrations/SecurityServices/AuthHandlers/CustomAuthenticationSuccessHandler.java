package com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers;

import com.example.SpringLogin.Configrations.SecurityServices.ActivationCodeService;
import com.example.SpringLogin.Configrations.SecurityServices.CustomUserDetails;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private ActivationCodeService activationCodeService;

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("Authentification successful");
        Object principal = authentication.getPrincipal();
        CustomUserDetails userDetails = (CustomUserDetails)principal;
        Utilisateur user = userDetails.getUtilisateur();
        if (user.getFailedAttempt() > 0) {
            userService.resetFailedAttempts(user.getEmail());
        }
        activationCodeService.MakeActivationCode(userDetails.getUsername());
        //emailService.sendTextEmail(user.getUsername(),"Activation Code",code);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
