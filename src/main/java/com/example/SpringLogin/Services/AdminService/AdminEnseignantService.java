package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.EnseignantRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminEnseignantService {


    private final EnseignantRepo enseignantRepo;

	private final PasswordEncoder passwordEncoder;

    private final ContextHandlerClass contextHandlerClass;

    public AdminEnseignantService(EnseignantRepo enseignantRepo, PasswordEncoder passwordEncoder, ContextHandlerClass contextHandlerClass) {
        this.enseignantRepo = enseignantRepo;
        this.passwordEncoder = passwordEncoder;
        this.contextHandlerClass = contextHandlerClass;
    }

    private Administrateur getAdmin(){
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean hasRightPrivilege(Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }

    public List<Enseignant> getAllEnseignants(){
        return enseignantRepo.findAll();
    }



    public Enseignant addEnseignant(Enseignant enseignant) throws Exception {

        if (enseignantRepo.findByEmail(enseignant.getEmail()) != null) {
             throw new systemException(systemException.ExceptionType.EXISTENCE);
		}

		Enseignant enseignantInstance = new Enseignant();
		enseignantInstance.setEmail(enseignant.getEmail());
		enseignantInstance.setName(enseignant.getName());
		enseignantInstance.setLastName(enseignant.getLastName());
		enseignantInstance.setGrade(enseignant.getGrade());
		enseignantInstance.setUserRole(Role.ENSEIGNANT);
		enseignantInstance.setAdmin(getAdmin());
		enseignantInstance.setPassword(passwordEncoder.encode(enseignant.getPassword()));
        return enseignantRepo.save(enseignantInstance);
    }

    public Enseignant editEnseignant(Enseignant enseignant) throws Exception {
        // first testing for existence
        Optional<Enseignant> optExistedEnseignant =  enseignantRepo.findById(enseignant.getUserId());

        if(optExistedEnseignant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        // second testing for privilege rights
        Enseignant existedEnseignant = optExistedEnseignant.get();

        if( !hasRightPrivilege( existedEnseignant.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }
        // last updating entity

        existedEnseignant.setAdmin(getAdmin());
        existedEnseignant.setName(enseignant.getName());
        existedEnseignant.setLastName(enseignant.getLastName());
        existedEnseignant.setGrade(enseignant.getGrade());
        existedEnseignant.setEmail(enseignant.getEmail());
        existedEnseignant.setUrlProfile(enseignant.getUrlProfile());
        return existedEnseignant;
    }

    public String deleteEnseignant(Long enseignantID) throws Exception{

        // first testing for existence
        Optional<Enseignant> optExistedEnseignant = enseignantRepo.findById(enseignantID);
        if(optExistedEnseignant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        // second test for privilege
        Enseignant existedEnseignant = optExistedEnseignant.get();
        if( !hasRightPrivilege( existedEnseignant.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last delete the entity
         enseignantRepo.delete(existedEnseignant);
        return "deleted with success";

    }
    public Enseignant getEnseignantByID(Long id) throws Exception {
        Optional<Enseignant> optEnseignant = enseignantRepo.findById(id);
        if(optEnseignant.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        return optEnseignant.get();
    }
}
