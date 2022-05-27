package com.example.SpringLogin.Services.AdminService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.Presences;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.PresencesRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AdminPresenceService {

    private final PresencesRepo presencesRepo;


    private final EtudiantRepo etudiantRepo;


    private final PlanningExamenRepo planningExamenRepo;


    private final ContextHandlerClass contextHandlerClass;

    public AdminPresenceService(PresencesRepo presencesRepo, EtudiantRepo etudiantRepo, PlanningExamenRepo planningExamenRepo, ContextHandlerClass contextHandlerClass){
        this.presencesRepo = presencesRepo;
        this.etudiantRepo = etudiantRepo;
        this.planningExamenRepo = planningExamenRepo;
        this.contextHandlerClass = contextHandlerClass;
        System.out.println("AdminPresenceService initialized");
    }

    private Administrateur getAdministrator(){
        return (Administrateur)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<Presences> getPresences(Long planId) throws Exception{
        if(!planningExamenRepo.existsById(planId)){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        return presencesRepo.findAllBySessionExamenPlanningsPlanId(planId);
    }

    public List<Etudiant> findEtudiantWithoutPrésences(Long planId) throws Exception {
        Optional<PlanningExamen> planningExamenOptional = planningExamenRepo.findById(planId);
        if(planningExamenOptional.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        PlanningExamen planningExamen = planningExamenOptional.get();
        List<Presences> etudiantsPresent = presencesRepo.findAllBySessionExamenPlanningsPlanId(planId);
        List<Long> etudiantsPresentIds = new ArrayList<>();
        etudiantsPresent.forEach(présences -> etudiantsPresentIds.add(présences.getEtudiant().getUserId()));
        return etudiantRepo.findAllByPlanningExamensContainingAndUserIdNotIn(planningExamen,etudiantsPresentIds);
    }
}
