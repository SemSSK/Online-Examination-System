package com.example.SpringLogin.Services.AdminService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.PlanningExamen;
import com.example.SpringLogin.Entities.Présences;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.PlanningExamenRepo;
import com.example.SpringLogin.Repos.PrésencesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AdminPresenceService {
    @Autowired
    private PrésencesRepo présencesRepo;

    @Autowired
    private EtudiantRepo etudiantRepo;

    @Autowired
    private PlanningExamenRepo planningExamenRepo;

    @Autowired
    private ContextHandlerClass contextHandlerClass;

    public AdminPresenceService(){
        System.out.println("AdminPresenceService initialized");
    }

    private Administrateur getAdministrator(){
        return (Administrateur)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<Présences> getPrésences(Long planId){
        return présencesRepo.findAllBySessionExamenPlanningsPlanId(planId);
    }

    public List<Etudiant> findEtudiantWithoutPrésences(Long planId) throws Exception {
        Optional<PlanningExamen> planningExamenOptional = planningExamenRepo.findById(planId);
        if(planningExamenOptional.isEmpty()){
            throw new Exception("plan does not exist");
        }
        PlanningExamen planningExamen = planningExamenOptional.get();
        List<Présences> présences = présencesRepo.findAllBySessionExamenPlanningsPlanId(planId);
        return etudiantRepo.findAllByPlanningExamensContainingAndPrésencesNotIn(planningExamen,présences);
    }
}
