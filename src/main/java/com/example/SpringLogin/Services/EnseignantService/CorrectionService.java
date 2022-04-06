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

import java.util.List;
import java.util.Optional;

@Service
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

    private boolean cannotCorrectCopie(Examen examen){
        Optional<Examen> realExam = examenRepo.findById(examen.getExamId());
        if(realExam.isEmpty())
        {
            return false;
        }
        Optional<AffectationModule> affectationModule = affectationModuleRepo.findByEnseignantAndModule(getEnseignant(),realExam.get().getModule());
        return affectationModule.isEmpty();
    }

    public List<Copie> getCopies(Examen examen) throws Exception{
        if(cannotCorrectCopie(examen)){
            throw new Exception("Cannot get copies of module you do not teach");
        }

        return copieRepo.findAllByExam(examen);
    }

    public void CorrectCopie(Reponse reponse) throws Exception{
        Reponse dbReponse = reponseRepo.getById(reponse.getReponseId());
        if(cannotCorrectCopie(dbReponse.getCopie().getExam())) {
            throw new Exception("Cannot correct copie of module you do not teach");
        }
        dbReponse.setPoints(reponse.getPoints());
        reponseRepo.save(dbReponse);
    }
}
