package com.example.SpringLogin.Configrations.SecurityServices.AuthListners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class AuthenticationFailureEventListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    @Autowired
    private HttpServletRequest request; /*From what i understood spring actually injects this beans differently for each
                                        http request made because it is a request scoped bean
                                        Source : https://docs.spring.io/spring-framework/docs/3.0.0.M3/reference/html/ch04s04.html */


    @Autowired
    private LoginAttemptService loginAttemptService;


    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        System.out.println("AuthFailureEventListner called");
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if(xfHeader == null){
            loginAttemptService.loginFailed(request.getRemoteAddr());
        }
        else{
            loginAttemptService.loginFailed(xfHeader.split(",")[0]);
        }
    }
}
