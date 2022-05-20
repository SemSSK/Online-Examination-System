package com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers;

import com.example.SpringLogin.Configrations.SecurityServices.ActivationCodeService;
import com.example.SpringLogin.Configrations.SecurityServices.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomLogOutSuccessHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("Logged out successfully");

        response.setStatus(HttpServletResponse.SC_OK);
    }
}
