package com.example.SpringLogin.Configrations.SecurityServices;

import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {


    private final UtilisateurRepo utilisateurRepo;

    public CustomUserDetailService(UtilisateurRepo utilisateurRepo) {
        this.utilisateurRepo = utilisateurRepo;
        System.out.println("CustomUserDetailService instatiated");
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        CustomUserDetails user = new CustomUserDetails(utilisateurRepo.findByEmail(email));
        if(user.getUtilisateur() == null){
            throw new UsernameNotFoundException("User with that email not found");
        }
        return user;
    }
}
