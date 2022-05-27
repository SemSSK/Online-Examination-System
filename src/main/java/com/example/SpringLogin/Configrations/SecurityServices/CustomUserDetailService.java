package com.example.SpringLogin.Configrations.SecurityServices;

import com.example.SpringLogin.Configrations.SecurityServices.AuthListners.LoginAttemptService;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class CustomUserDetailService implements UserDetailsService {


    private final UtilisateurRepo utilisateurRepo;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private HttpServletRequest request;/*From what i understood spring actually injects this beans differently for each
                                        http request made because it is a request scoped bean
                                        Source : https://docs.spring.io/spring-framework/docs/3.0.0.M3/reference/html/ch04s04.html */

    public CustomUserDetailService(UtilisateurRepo utilisateurRepo) {
        this.utilisateurRepo = utilisateurRepo;
        System.out.println("CustomUserDetailService instatiated");
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String ip = getClientIp();
        if(loginAttemptService.isBlocked(ip)){
            System.out.println("blocked");
            throw new UsernameNotFoundException("blocked");
        }
        Optional<Utilisateur> dbUser = utilisateurRepo.findByEmail(email);
        if(dbUser.isEmpty()){
            System.out.println("User with that email not found");
            throw new UsernameNotFoundException("User with that email not found");
        }
        CustomUserDetails user = new CustomUserDetails(dbUser.get());
        if(user.getUtilisateur() == null){
            System.out.println("User with that email not found");
            throw new UsernameNotFoundException("User with that email not found");
        }
        return user;
    }

    private String getClientIp() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if(xfHeader == null){
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
