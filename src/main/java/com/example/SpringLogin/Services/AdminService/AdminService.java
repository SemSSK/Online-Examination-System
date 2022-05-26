package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.AdministrateurRepo;
import com.example.SpringLogin.Repos.AdministrateurRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminService {
    private final AdministrateurRepo administrateurRepo;

    private final PasswordEncoder passwordEncoder;

    private final ContextHandlerClass contextHandlerClass;

    public AdminService(AdministrateurRepo administrateurRepo, PasswordEncoder passwordEncoder, ContextHandlerClass contextHandlerClass) {
        this.administrateurRepo = administrateurRepo;
        this.passwordEncoder = passwordEncoder;
        this.contextHandlerClass = contextHandlerClass;
    }

    public Administrateur getAdmin(){
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean hasRightPrivilege(Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }

    public List<Administrateur> getAllAdmins(){
        return administrateurRepo.findAll();
    }



    public Administrateur addAdmin(Administrateur administrateur) throws Exception {

        if (administrateurRepo.findByEmail(administrateur.getEmail()) != null) {
            throw new systemException(systemException.ExceptionType.EXISTENCE);
        }

        Administrateur administrateurInstance = new Administrateur();
        administrateurInstance.setEmail(administrateur.getEmail());
        administrateurInstance.setName(administrateur.getName());
        administrateurInstance.setLastName(administrateur.getLastName());
        administrateurInstance.setUserRole(Role.ADMIN);
        administrateurInstance.setPrivilege(getAdmin().getPrivilege() + 1);
        administrateurInstance.setAdmin(getAdmin());
        administrateurInstance.setPassword(passwordEncoder.encode(administrateur.getPassword()));
        return administrateurRepo.save(administrateurInstance);
    }

    public Administrateur editAdmin(Administrateur administrateur) throws Exception {
        // first testing for existence
        Optional<Administrateur> optExistedAdministrateur =  administrateurRepo.findById(administrateur.getUserId());

        if(optExistedAdministrateur.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        // second testing for privilege rights
        Administrateur existedAdministrateur = optExistedAdministrateur.get();

        if( !hasRightPrivilege( existedAdministrateur.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last updating entity
        existedAdministrateur.setAdmin(getAdmin());
        existedAdministrateur.setName(administrateur.getName());
        existedAdministrateur.setLastName(administrateur.getLastName());
        existedAdministrateur.setEmail(administrateur.getEmail());
        existedAdministrateur.setUrlProfile(administrateur.getUrlProfile());
        return existedAdministrateur;
    }

    public String deleteAdmin(Long administrateurID) throws Exception{

        // first testing for existence
        Optional<Administrateur> optExistedAdministrateur = administrateurRepo.findById(administrateurID);
        if(optExistedAdministrateur.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        // second test for privilege
        Administrateur existedAdministrateur = optExistedAdministrateur.get();
        if( !hasRightPrivilege( existedAdministrateur.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last delete the entity
        administrateurRepo.delete(existedAdministrateur);
        return "deleted with success";

    }
    public Administrateur getAdminByID(Long id) throws Exception {
        Optional<Administrateur> optAdministrateur = administrateurRepo.findById(id);
        if(optAdministrateur.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        return optAdministrateur.get();
    }
}
