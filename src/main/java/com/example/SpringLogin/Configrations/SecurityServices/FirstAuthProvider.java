package com.example.SpringLogin.Configrations.SecurityServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;


public class FirstAuthProvider implements AuthenticationProvider {


    private CustomUserDetailService customUserDetailService;
    private PasswordEncoder passwordEncoder;



    public FirstAuthProvider(CustomUserDetailService customUserDetailService, PasswordEncoder passwordEncoder) {
        this.customUserDetailService = customUserDetailService;
        this.passwordEncoder = passwordEncoder;
    }





    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials().toString();
//        String encodedPassword = passwordEncoder.encode(password);
//        System.out.println("encoded passowrd= "+encodedPassword);
        System.out.println("passowrd= "+password);
        if(email.isEmpty()){
            throw new BadCredentialsException("invalid login details");
        }
        CustomUserDetails user;
        try{

            user = (CustomUserDetails) customUserDetailService.loadUserByUsername(email);
            System.out.println("DB encode password "+user.getUtilisateur().getPassword());

            if(!passwordEncoder.matches(password,user.getUtilisateur().getPassword())){

                throw new BadCredentialsException("invalid login details");
            }

            return new UsernamePasswordAuthenticationToken(user,authentication.getCredentials(),user.getAuthorities());

        }catch(UsernameNotFoundException e) {
            throw new BadCredentialsException("invalid login details");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }

}
