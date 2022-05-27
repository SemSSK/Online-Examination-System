package com.example.SpringLogin.Configrations.SecurityServices;

import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Enumarators.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private Utilisateur user;
    ArrayList<SimpleGrantedAuthority> roles;

    //Constructor
    //Setting user and roles
    public CustomUserDetails(Utilisateur user){
        this.user = user;
        roles = new ArrayList<>();
        roles.add(new SimpleGrantedAuthority("ROLE_"+ Role.NOT_ACTIVATED));
    }

    public void setAuthority(String role){
        roles.clear();
        roles.add(new SimpleGrantedAuthority(role));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }


    @Override
    public boolean isEnabled() {
        return true;
    }

    public Utilisateur getUtilisateur(){
        return user;
    }

    @Override
    public int hashCode() {
        return user.getEmail().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == null){
            System.out.println("obj null");
            return false;
        }
        else if(!(obj instanceof CustomUserDetails)){
            System.out.println("obj not instanceof CustomUserDetails");
            return false;
        }
        else{
            CustomUserDetails customUserDetails = (CustomUserDetails) obj;
            return customUserDetails.getUsername().hashCode() == hashCode();
        }
    }
}
