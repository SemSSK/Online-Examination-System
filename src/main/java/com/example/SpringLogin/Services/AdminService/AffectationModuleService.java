package com.example.SpringLogin.Services.AdminService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.AffectationModule;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Enumarators.teachingType;
import com.example.SpringLogin.Repos.AdministrateurRepo;
import com.example.SpringLogin.Repos.AffectationModuleRepo;
import com.example.SpringLogin.Repos.EnseignantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AffectationModuleService {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private AffectationModuleRepo affectationModuleRepo;

    @Autowired
    private AdminModuleService adminModuleService;

    @Autowired
    private AdminEnseignantService adminEnseignantService;



    @Autowired
    private AdministrateurRepo administrateurRepo;

    private Administrateur getAdmin(){
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public AffectationModule makeAffectation(AffectationModule affectationModule) throws Exception {

        if( affectationModule.getType() == teachingType.COURSE
           && !hasNotAffectedForCoursesYet(affectationModule.getModule())
       ){
           throw new Exception("this module already affected to a teacher if you are sure you want that please start by deleting the affectation first then reAffect it ");
       }
        else{
//            Administrateur administrateur;
//            administrateur = administrateurRepo.findById(1L).get();
//            affectationModule.setAdmin(administrateur);
//            Module module = entityManager.getReference(Module.class, affectationModule.getAffectationModuleId().getModuleId());
//            Enseignant enseignant = entityManager.getReference(Enseignant.class, affectationModule.getAffectationModuleId().getEnseignantId());
            Module module = adminModuleService.getModuleByID(
                    affectationModule.getAffectationModuleId().getModuleId()
            );
            Enseignant enseignant = adminEnseignantService.getEnseignantByID(
                    affectationModule.getAffectationModuleId().getEnseignantId()
            );

            affectationModule.setModule(module);
            affectationModule.setEnseignant(enseignant);
            affectationModule.setAffectationDate(Timestamp.from(Instant.now()));
            affectationModule.setAdmin(getAdmin());
            //entityManager.persist(affectationModule);
            return affectationModuleRepo.saveAndFlush(affectationModule);
        }
    }

    private boolean hasNotAffectedForCoursesYet(Module module){

        if(affectationModuleRepo.findAllByModuleAndType(module,teachingType.COURSE) == null)
            return true;
        else
            return false;
    }

    public void deleteAffectation(Module module, Enseignant enseignant){
        affectationModuleRepo.deleteByModuleAndEnseignant(module, enseignant);
    }

    public List<AffectationModule> getAffectationsOfModule(Module module){
        return affectationModuleRepo.findAllByModule(module);
    }

    public List<AffectationModule> getAffectationsOfEnseignant(Enseignant enseignant){
        return affectationModuleRepo.findAllByEnseignant(enseignant);
    }

    public List<AffectationModule> getAllAffectations(){
        return affectationModuleRepo.findAll();
    }

}
