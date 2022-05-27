package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.ModuleRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminModuleService {


    private final ModuleRepo moduleRepo;

    private final ContextHandlerClass contextHandlerClass;

    public AdminModuleService(ModuleRepo moduleRepo, ContextHandlerClass contextHandlerClass) {
        this.moduleRepo = moduleRepo;
        this.contextHandlerClass = contextHandlerClass;
    }

    private Administrateur getAdmin(){
        return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean hasRightPrivilege(Administrateur administrateur){
        return getAdmin().getPrivilege() <= administrateur.getPrivilege();
    }

    public List<Module> getAllModules(){
        return moduleRepo.findAll();
    }



    public Module addModule(Module module) throws Exception {

        if (moduleRepo.findByModuleAbrv(module.getModuleAbrv()) != null) {
            System.out.println("exist");
            throw new systemException(systemException.ExceptionType.EXISTENCE);
        }

        Module moduleInstance = new Module();
        moduleInstance.setAdmin(getAdmin());
        moduleInstance.setNomModule(module.getNomModule());
        moduleInstance.setModuleAbrv(module.getModuleAbrv());
        moduleInstance.setNiveau(module.getNiveau());
        moduleInstance.setHasTDTP(module.isHasTDTP());
        moduleInstance.setCoefficient(module.getCoefficient());
        return moduleRepo.save(moduleInstance);
    }

    public Module editModule(Module module) throws Exception {
        // first testing for existence
        Optional<Module> optExistedModule =  moduleRepo.findById(module.getId());

        if(optExistedModule.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        // second testing for privilege rights
        Module existedModule = optExistedModule.get();

        if( !hasRightPrivilege( existedModule.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last updating entity
        existedModule.setAdmin(getAdmin());
        existedModule.setNomModule(module.getNomModule());
        existedModule.setModuleAbrv(module.getModuleAbrv());
        existedModule.setNiveau(module.getNiveau());
        existedModule.setHasTDTP(module.isHasTDTP());
        existedModule.setCoefficient(module.getCoefficient());
        return existedModule;
    }

    public String deleteModule(Long moduleID) throws Exception{

        // first testing for existence
        Optional<Module> optExistedModule = moduleRepo.findById(moduleID);
        if(optExistedModule.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        // second test for privilege
        Module existedModule = optExistedModule.get();
        if( !hasRightPrivilege( existedModule.getAdmin() ) ){
            throw new systemException(systemException.ExceptionType.PRIVILEGE);
        }

        // last delete the entity
        moduleRepo.delete(existedModule);
        return "deleted with success";

    }
    
    public Module getModuleByID(Long id)throws Exception {
        Optional<Module> module = moduleRepo.findById(id);
        if(module.isEmpty()){
            throw new Exception("module doesn't exist");
        }
        return module.get();
    }
}


   

