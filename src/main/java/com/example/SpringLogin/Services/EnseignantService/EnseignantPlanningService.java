package com.example.SpringLogin.Services.EnseignantService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Repos.ModuleRepo;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional(readOnly = true)
public class EnseignantPlanningService {

    @Autowired
    private PlanningExamenRepo planningExamenRepo;
    @Autowired
    private ModuleRepo moduleRepo;
    @Autowired
    private ContextHandlerClass contextHandlerClass;

    public EnseignantPlanningService(){
        System.out.println("EnseignantPlanningService initialized");
    }

    private Enseignant getEnseignant(){
        return (Enseignant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public ArrayList<PlanningExamen> getPlanningsToProctor(){
        ArrayList<PlanningExamen> planningExamens = (ArrayList<PlanningExamen>) planningExamenRepo.findAllBySessionExamensSurveillant(getEnseignant());
        return planningExamens;
    }

    public ArrayList<PlanningExamen> getPlanningsOfModules(){
        ArrayList<Module> modules = (ArrayList<Module>)moduleRepo.findAllByAffectationModulesEnseignant(getEnseignant());
        ArrayList<PlanningExamen> planningExamens = (ArrayList<PlanningExamen>) planningExamenRepo.findAllByModuleIn(modules);
        return planningExamens;
    }

}
