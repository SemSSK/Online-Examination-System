package com.example.SpringLogin.Configrations;

import com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers.CustomAuthenticationFailureHandler;
import com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers.CustomAuthenticationSuccessHandler;
import com.example.SpringLogin.Configrations.SecurityServices.AuthHandlers.CustomLogOutSuccessHandler;
import com.example.SpringLogin.Configrations.SecurityServices.CustomUserDetailService;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Configrations.SecurityServices.CustomAuthFilter;
import com.example.SpringLogin.Configrations.SecurityServices.FirstAuthProvider;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class securityConf extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        //Creating the authentication filter to override Spring AuthFilter
        CustomAuthFilter authFilter = new CustomAuthFilter(authenticationManagerBean());
        //disabling cross site refrence forgery defence to allow POST Requests
        http.csrf().disable();

        http.sessionManagement().maximumSessions(1).maxSessionsPreventsLogin(true);
        //CORS Configs to allow request comming from the react client app
        http.cors().configurationSource(corsConfigurationSource());

        //Configuring allowed and forbidden paths depending on roles and authentications
        http.authorizeRequests()
                .antMatchers("/admin","/admin/**").hasRole(Role.ADMIN)                 //Only admin can access the  RESTControllers mapped with /admin
                .antMatchers("/etudiant","/etudiant/**").hasRole(Role.ETUDIANT)           //Only Etudiant can access the  RESTControllers mapped with /etudiant
                .antMatchers("/enseignant","/enseignant/**").hasRole(Role.ENSEIGNANT)       //Only Enseignant can access the  RESTControllers mapped with /enseignant
                .antMatchers("/examRoom").hasAnyRole(Role.ETUDIANT,Role.ENSEIGNANT)  //Only Enseignant and Etudiant can access the  Exam WebSocket
                .antMatchers("/authorization/**").authenticated()        //Only Not activated logins can access RESTControllers mapped with /activate
                .anyRequest().authenticated()                                      //For Every other request user needs to be authenticated
                    .and()
                    .formLogin()
                    .loginProcessingUrl("/login")
                    .loginPage("/login")
                    .failureHandler(authenticationFailureHandler())
                    .successHandler(authenticationSuccessHandler())
                .and()
                    .logout()
                    .logoutUrl("/logout")
                    .logoutSuccessHandler(logoutSuccessHandler());
//                .and().addFilter(authFilter);                                      //Adding the custom Authentication Filter
        //****************************************************************

    }

    //Replaces spring authenticationProvider and UserDetailService with custom ones to work with database
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(myCustomAuthenticationProvider());
    }

    public FirstAuthProvider myCustomAuthenticationProvider() {
        return new FirstAuthProvider(customUserDetailService, PasswordEncoder());
    }

    @Bean
    public PasswordEncoder PasswordEncoder(){
        return new BCryptPasswordEncoder();
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

    //Authentication success and failure handler
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler(){
        return new CustomAuthenticationSuccessHandler();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler(){
        return new CustomAuthenticationFailureHandler();
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler(){
        return new CustomLogOutSuccessHandler();
    }

}
