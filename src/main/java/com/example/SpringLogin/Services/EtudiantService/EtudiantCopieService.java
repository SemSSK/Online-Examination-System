package com.example.SpringLogin.Services.EtudiantService;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Copie;
import com.example.SpringLogin.Entities.Etudiant;
import com.example.SpringLogin.Entities.Reclamation;
import com.example.SpringLogin.Enumarators.ReclamationTypes;
import com.example.SpringLogin.Repos.CopieRepo;
import com.example.SpringLogin.Repos.ReclamationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class EtudiantCopieService {
    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private CopieRepo copieRepo;
    @Autowired
    private ReclamationRepo reclamationRepo;

    public EtudiantCopieService(){
        System.out.println("EtudiantCopieService initialized");
    }

    private Etudiant getEtudiant(){
        return (Etudiant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    public List<Copie> getCopies(){
        return copieRepo.findAllByEtudiant(getEtudiant());
    }

    @Transactional(readOnly = false)
    public void sendReclamation(Long copieId,String subject) throws Exception {
        Optional<Copie> dbCopie = copieRepo.findById(copieId);
        if(dbCopie.isEmpty()){
            throw new Exception("Copy does not exist");
        }
        Copie realCopie = dbCopie.get();
        if(!canReclamOnCopie(realCopie)){
            throw new Exception("You do not own copie");
        }
        Reclamation reclamation = new Reclamation();
        reclamation.setCopie(realCopie);
        reclamation.setClaimType(ReclamationTypes.ERREUR);
        reclamation.setSubject(subject);
        reclamationRepo.save(reclamation);
    }

    private boolean canReclamOnCopie(Copie copie){
        return copie.getEtudiant().equals(getEtudiant());
    }
}
