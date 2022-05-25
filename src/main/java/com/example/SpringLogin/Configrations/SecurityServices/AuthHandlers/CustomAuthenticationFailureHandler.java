package com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers;

import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        System.out.println("Authentification failed");
        String email = request.getParameter("username");
        System.out.println("username : "+ email);
        Utilisateur user = userService.findUserByEmail(email);

        if (user != null) {
            if ( user.isAccountNonLocked()) {
                if (user.getFailedAttempt() < UserService.MAX_FAILED_ATTEMPTS - 1) {
                    userService.increaseFailedAttempts(user);
                } else {
                    userService.lock(user);
                    exception = new LockedException("Your account has been locked due to 3 failed attempts."
                            + " It will be unlocked after 24 hours.");
                }
            } else {
                if (userService.unlockWhenTimeExpired(user)) {
                    exception = new LockedException("Your account has been unlocked. Please try to login again.");
                }
            }

        }


        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    }
}
