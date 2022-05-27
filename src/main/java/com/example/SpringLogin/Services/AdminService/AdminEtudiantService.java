package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.EtudiantRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminEtudiantService {


    private final EtudiantRepo etudiantRepo;

    private final PasswordEncoder passwordEncoder;

    private final ContextHandlerClass contextHandlerClass;

    public AdminEtudiantService(EtudiantRepo etudiantRepo, PasswordEncoder passwordEncoder, ContextHandlerClass contextHandlerClass) {
        this.etudiantRepo = etudiantRepo;
        this.passwordEncoder = passwordEncoder;
        this.contextHandlerClass = contextHandlerClass;
    }

    private Administrateur getAdmin(){
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean hasRightPrivilege(Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }

    public List<Etudiant> getAllEtudiants(){
        return etudiantRepo.findAll();
    }



    public Etudiant addEtudiant(Etudiant etudiant) throws Exception {

        if (etudiantRepo.findByEmail(etudiant.getEmail()) != null) {
            throw new systemException(systemException.ExceptionType.EXISTENCE);
        }

        Etudiant etudiantInstance = new Etudiant();
        etudiantInstance.setEmail(etudiant.getEmail());
        etudiantInstance.setName(etudiant.getName());
        etudiantInstance.setLastName(etudiant.getLastName());
        etudiantInstance.setGroupe(etudiant.getGroupe());
        etudiantInstance.setNiveau(etudiant.getNiveau());
        etudiantInstance.setSection(etudiant.getSection());
        etudiantInstance.setUserRole(Role.ETUDIANT);
        etudiantInstance.setAdmin(getAdmin());
        //  String dynamicPassword = UUID.randomUUID().toString();
        etudiant.setPassword("12345");
        etudiantInstance.setPassword(passwordEncoder.encode(etudiant.getPassword()));
        return etudiantRepo.save(etudiantInstance);
    }

    public Etudiant editEtudiant(Etudiant etudiant) throws Exception {
        // first testing for existence
        Optional<Etudiant> optExistedEtudiant =  etudiantRepo.findById(etudiant.getUserId());

        if(optExistedEtudiant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        // second testing for privilege rights
        Etudiant existedEtudiant = optExistedEtudiant.get();

        if( !hasRightPrivilege( existedEtudiant.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }
        // last updating entity

        existedEtudiant.setAdmin(getAdmin());
        existedEtudiant.setName(etudiant.getName());
        existedEtudiant.setLastName(etudiant.getLastName());
        existedEtudiant.setGroupe(etudiant.getGroupe());
        existedEtudiant.setNiveau(etudiant.getNiveau());
        existedEtudiant.setSection(etudiant.getSection());
        existedEtudiant.setEmail(etudiant.getEmail());
        existedEtudiant.setUrlProfile(etudiant.getUrlProfile());
        return existedEtudiant;
    }

    public String deleteEtudiant(Long etudiantID) throws Exception{

        // first testing for existence
        Optional<Etudiant> optExistedEtudiant = etudiantRepo.findById(etudiantID);
        if(optExistedEtudiant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        // second test for privilege
        Etudiant existedEtudiant = optExistedEtudiant.get();
        if( !hasRightPrivilege( existedEtudiant.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last delete the entity
        etudiantRepo.delete(existedEtudiant);
        return "deleted with success";

    }
    public Etudiant getEtudiantByID(Long id) throws Exception {
        Optional<Etudiant> optEtudiant = etudiantRepo.findById(id);
        if(optEtudiant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        return optEtudiant.get();
    }
}
