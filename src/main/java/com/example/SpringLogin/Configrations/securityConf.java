package com.example.SpringLogin.Configrations;

import com.example.SpringLogin.LogInWork.CustomAuthFilter;
import com.example.SpringLogin.LogInWork.CustomUserDetailService;
import com.example.SpringLogin.LogInWork.FirstAuthProvider;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class securityConf extends WebSecurityConfigurerAdapter {

    @Autowired
    private UtilisateurRepo utilisateurRepo;

    @Autowired
    private FirstAuthProvider firstAuthProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        //Creating the authentication filter to override Spring AuthFilter
        CustomAuthFilter authFilter = new CustomAuthFilter(authenticationManagerBean());


        //disabling cross site refrence forgery defence to allow POST Requests
        http.csrf().disable();


        //CORS Configs to allow request comming from the react client app
        http.cors().configurationSource(corsConfigurationSource());

        //Configuring allowed and forbidden paths depending on roles and authentications
        http.authorizeRequests()
                .antMatchers("/admin").hasRole("ADMIN")                 //Only admin can access the  RESTControllers mapped with /admin
                .antMatchers("/etudiant").hasRole("ETUDIANT")           //Only Etudiant can access the  RESTControllers mapped with /etudiant
                .antMatchers("/enseignant").hasRole("ENSEIGNANT")       //Only Enseignant can access the  RESTControllers mapped with /enseignant
                .antMatchers("/activate").hasRole("NOT_ACTIVATED")      //Only Not activated logins can access RESTControllers mapped with /activate
                .anyRequest().authenticated()                                      //For Every other request user needs to be authenticated
                .and().addFilter(authFilter);                                      //Adding the custom Authentication Filter
        //****************************************************************

    }

    //Replaces spring authenticationProvider and UserDetailService with custom ones to work with database
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(firstAuthProvider)
                .userDetailsService(new CustomUserDetailService(utilisateurRepo));
    }


    @Bean
    public PasswordEncoder PasswordEncoder(){
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception{
        return super.authenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){

        //CORS Configs to allow request comming from the react client app
        CorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");  // React app endpoint
        config.setAllowCredentials(true);
        config.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Headers",
                "Access-Control-Allow-Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Origin","Cache-Control",
                "Content-Type",
                "Authorization"));
        config.setAllowedMethods(Arrays.asList("DELETE", "GET", "POST", "PATCH", "PUT"));
        ((UrlBasedCorsConfigurationSource)source).registerCorsConfiguration("/**",config);
        //****************************************************************
        return source;
    }

}
