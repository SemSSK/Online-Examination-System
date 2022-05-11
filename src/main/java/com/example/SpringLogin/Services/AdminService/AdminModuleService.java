package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Repos.ModuleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AdminModuleService {

    @Autowired
    private ModuleRepo moduleRepo;

    public Module getModuleByID(Long id)throws Exception {
        Optional<Module> module = moduleRepo.findById(id);
        if(module.isEmpty()){
            throw new Exception("module doesn't exist");
        }
        return module.get();
    }
}
