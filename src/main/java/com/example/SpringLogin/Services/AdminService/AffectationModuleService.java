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

    private boolean thisAdminHasMorePrivilege (Administrateur administrateur){
        return getAdmin().getPrivilege() > administrateur.getPrivilege();
    }

    public AffectationModule makeAffectation(AffectationModule affectationModule) throws Exception {
        Module module = adminModuleService.getModuleByID(
                affectationModule.getAffectationModuleId().getModuleId()
        );
        Enseignant enseignant = adminEnseignantService.getEnseignantByID(
                affectationModule.getAffectationModuleId().getEnseignantId()
        );
        AffectationModule existedSameAffectation =  affectationModuleRepo.findByEnseignantAndModule(enseignant,module).get();
        if(existedSameAffectation == null) {
            if (affectationModule.getType() == teachingType.COURSE) {
                if( !hasNotAffectedForCoursesYet(module)) {
                    throw new Exception("this module already affected to a teacher if you are sure you want that please start by deleting the existing affectation first then reAffect it ");
                }
            } else{
                if(!module.isHasTDTP())
                    throw new Exception("this module don't have a TD_TP session you can't make this affectation");
            }

        }
        else{
            if(existedSameAffectation.getType() == affectationModule.getType())
                throw new Exception("this affectation already made ");

            if(affectationModule.getType() == teachingType.COURSE){
                if(thisAdminHasMorePrivilege(existedSameAffectation.getAdmin())){
                    throw new Exception("this teacher is affected as TD_TP for this module to upgrade him for COURSE you have to delete first the TD_TP affectation which you don't have the right privilege for it ");
                }
                affectationModuleRepo.deleteById(existedSameAffectation.getAffectationModuleId());
            }else{
                throw new Exception("this teacher is affected for courses no need for TD_TP all the functionalities possible when the type is course  ");
            }
        }

        affectationModule.setAffectationDate(Timestamp.from(Instant.now()));
        affectationModule.setAdmin(getAdmin());
        return affectationModuleRepo.saveAndFlush(affectationModule);
    }

    private boolean hasNotAffectedForCoursesYet(Module module){

        if(affectationModuleRepo.findAllByModuleAndType(module,teachingType.COURSE) == null)
            return true;
        else
            return false;
    }

    public void deleteAffectation(Module module, Enseignant enseignant) throws Exception {
        AffectationModule existedAffectation = affectationModuleRepo.findByEnseignantAndModule(enseignant,module).get();
        if(thisAdminHasMorePrivilege(existedAffectation.getAdmin())){
            throw new Exception("you don't have the right privilege for this action");
        }
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
