package com.example.SpringLogin.Services.EnseignantService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Repos.AffectationModuleRepo;
import com.example.SpringLogin.Repos.CopieRepo;
import com.example.SpringLogin.Repos.ExamenRepo;
import com.example.SpringLogin.Repos.ReponseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CorrectionService {

    @Autowired
    private ExamenRepo examenRepo;
    @Autowired
    private CopieRepo copieRepo;
    @Autowired
    private ReponseRepo reponseRepo;
    @Autowired
    private AffectationModuleRepo affectationModuleRepo;
    @Autowired
    private ContextHandlerClass contextHandlerClass;

    private Enseignant getEnseignant(){
        return (Enseignant)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    //Verification methods
    private boolean canCorrectCopieOfModule(Long id){
        Optional<AffectationModule> affectationModule = affectationModuleRepo.findByEnseignantUserIdAndModuleId(getEnseignant().getUserId(),id);
        if(affectationModule.isEmpty()){
            return false;
        }
        return true;
    }

    private boolean reponsesPointsAreValid(List<Reponse> reponsesWithPoints){
        for(Reponse r : reponsesWithPoints){
            Reponse realReponse = reponseRepo.findById(r.getReponseId()).get();
            if(!r.reponsesPointsAreValid(realReponse.getQuestion().getPoints())){
                return false;
            }
        }
        return true;
    }

    private boolean coherentCopieAndResponseRelation(Copie copie) {
        List<Reponse> reponses = copie.getReponses().stream().collect(Collectors.toList());
        for (Reponse r : reponses) {
            Optional<Reponse> realReponse = reponseRepo.findById(r.getReponseId());
            if (realReponse.isEmpty()) {
                return false;
            }
            if (!realReponse.get().getCopie().equals(copie)) {
                return false;
            }
        }
        return true;
    }


    @Transactional(readOnly = false)
    private void modifyReponsePoints(List<Reponse> reponsesWithPoints){
        for(Reponse r : reponsesWithPoints){
            Reponse realReponse = reponseRepo.findById(r.getReponseId()).get();
            realReponse.setPoints(r.getPoints());
        }
    }

    //Action methods
    public List<Copie> getCopies(Long id) throws Exception{
        if(!canCorrectCopieOfModule(id)){
            throw new Exception("Cannot get copies of module you do not teach");
        }
        Optional<Examen> dbExamen = examenRepo.findByModuleId(id);
        if(dbExamen.isEmpty()){
            throw new Exception("Examen does not exist");
        }
        Examen examen = dbExamen.get();
        return copieRepo.findAllByExam(examen);
    }


    public Copie getCopy(Long id) throws Exception {
        Optional<Copie> dbCopie = copieRepo.findById(id);

        if(dbCopie.isEmpty()){
            throw new Exception("Copie does not exist");
        }

        Copie realCopie = dbCopie.get();

        if(!canCorrectCopieOfModule(realCopie.getExam().getModule().getId())){
            throw new Exception("Cannot get copies of module you do not teach");
        }

        return realCopie;
    }


    @Transactional(readOnly = false)
    public void CorrectCopy(Copie copie) throws Exception {

        Long copyId = copie.getCopieId();
        List<Reponse> reponses = copie.getReponses().stream().collect(Collectors.toList());
        if(copyId == null || reponses == null){
            throw new Exception("no copie id or reponses id in request body");
        }



        Optional<Copie> dbCopie = copieRepo.findById(copyId);

        if(dbCopie.isEmpty()){
            throw new Exception("Copie does not exist");
        }

        if(!coherentCopieAndResponseRelation(copie)){
            throw new Exception("Wrong reponse reference");
        }

        Copie realCopy = dbCopie.get();
        if(!canCorrectCopieOfModule(realCopy.getExam().getModule().getId())){
            throw new Exception("Cannot get copies of module you do not teach");
        }

        if(!reponsesPointsAreValid(reponses)){
            throw new Exception("Reponses points");
        }

        modifyReponsePoints(reponses);
    }


}
