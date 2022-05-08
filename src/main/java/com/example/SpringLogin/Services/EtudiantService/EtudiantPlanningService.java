package com.example.SpringLogin.Services.EtudiantService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EtudiantPlanningService {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private PlanningExamenRepo planningExamenRepo;

    public EtudiantPlanningService(){
        System.out.println("EtudiantPlanningService Initialized");
    }

    private Etudiant getEtudiant(){
        return (Etudiant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<PlanningExamen> getExamSchedual(){
        return planningExamenRepo.findByEtudiantsContaining(getEtudiant());
    }

}
