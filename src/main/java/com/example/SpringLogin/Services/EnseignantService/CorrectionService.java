package com.example.SpringLogin.Services.EnseignantService;


import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CorrectionService {


    private final ExamenRepo examenRepo;

    private final CopieRepo copieRepo;

    private final ReponseRepo reponseRepo;

    private final AffectationModuleRepo affectationModuleRepo;

    private final ModuleRepo moduleRepo;

    private final ContextHandlerClass contextHandlerClass;

    public CorrectionService ( CopieRepo copieRepo,ReponseRepo reponseRepo,AffectationModuleRepo affectationModuleRepo,
                               ExamenRepo examenRepo,  ContextHandlerClass contextHandlerClass, ModuleRepo moduleRepo)
    {
        this.examenRepo = examenRepo;
        this.copieRepo = copieRepo;
        this.reponseRepo = reponseRepo;
        this.affectationModuleRepo = affectationModuleRepo;
        this.moduleRepo = moduleRepo;
        this.contextHandlerClass = contextHandlerClass;
    }

    private Enseignant getEnseignant(){
        return (Enseignant)contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    //Verification methods
    private boolean canCorrectCopieOfModule(Long moduleId) {
        Optional<AffectationModule> affectationModule = affectationModuleRepo.findByEnseignantUserIdAndModuleId(getEnseignant().getUserId(),moduleId);
        if(affectationModule.isEmpty()){
            return false;
        }
        return true;
    }

    private boolean reponsesPointsAreValid(List<Reponse> reponsesWithPoints){
        for(Reponse r : reponsesWithPoints){
            // looks like redundant work
            Reponse realReponse = reponseRepo.findById(r.getReponseId()).get();
            if(!r.reponsesPointsAreValid(realReponse.getQuestion().getPoints())){
                return false;
            }
        }
        return true;
    }

    private boolean coherentCopieAndResponseRelation(Copie copie, List<Reponse> reponses) {
        for (Reponse r : reponses) {
            // looks like redundant work
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
     void modifyReponsePoints(List<Reponse> reponsesWithPoints){
        for(Reponse r : reponsesWithPoints){
            // looks like redundant work
            Reponse realReponse = reponseRepo.findById(r.getReponseId()).get();
            realReponse.setPoints(r.getPoints());
        }
    }

    //Action methods
    public List<Copie> getCopiesByModule(Long moduleId) throws Exception{
        if(!moduleRepo.existsById(moduleId)){
            throw new systemException (systemException.ExceptionType.NOT_EXISTENCE);
        }
        if(!canCorrectCopieOfModule(moduleId)){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }
        Optional<Examen> dbExamen = examenRepo.findByModuleId(moduleId);
        if(dbExamen.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        Examen examen = dbExamen.get();
        return copieRepo.findAllByExam(examen);
    }


    public List<Copie> getCopiesByExamen(Long examenId) throws Exception{

        Optional<Examen> existedExam = examenRepo.findById(examenId);
        if(existedExam.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canCorrectCopieOfModule(existedExam.get().getModule().getId())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }


        List<Copie> existedCopiesList = copieRepo.findAllByExam(existedExam.get());

        return existedCopiesList;
    }

    public Copie getCopy(Long id) throws Exception {
        Optional<Copie> dbCopie = copieRepo.findById(id);

        if(dbCopie.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        Copie realCopie = dbCopie.get();

        if(!canCorrectCopieOfModule(realCopie.getExam().getModule().getId())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        return realCopie;
    }


    @Transactional(readOnly = false)
    public void CorrectCopy(Copie copie) throws Exception {

        // don't forget we probably need to implement the state of the copie or response
        // maybe this affect some changes here

        Optional<Copie> dbCopie = copieRepo.findById(copie.getCopieId());

        if(dbCopie.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        Copie realCopy = dbCopie.get();

        if(!canCorrectCopieOfModule(realCopy.getExam().getModule().getId())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        List<Reponse> reponses = copie.getReponses().stream().collect(Collectors.toList());

        // the three methods coherentCopieAndResponseRelation and reponsesPointsAreValid and modifyReponsePoints
        // works with realResponses list in DB
        // maybe we get them only once and send them as parameter to each method will be better!?
        // try this -->
        // List<Reponse> dbReponses = reponseRepo.findByCopie(copie);

        if(!coherentCopieAndResponseRelation(copie,reponses)){
            throw new systemException("Wrong reponse reference");
        }

        if(!reponsesPointsAreValid(reponses)){
            throw new systemException("Reponses points");
        }

        modifyReponsePoints(reponses);
        realCopy.setObservation(copie.getObservation());
    }


}
