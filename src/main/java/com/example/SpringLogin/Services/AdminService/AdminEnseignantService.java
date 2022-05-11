package com.example.SpringLogin.Services.AdminService;

import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AdminEnseignantService {

    @Autowired
    private UtilisateurRepo utilisateurRepo;

    public Enseignant getEnseignantByID(Long id) throws Exception{
        System.out.println("really id : "+id);
        Optional<Utilisateur> enseignant = utilisateurRepo.findById(id);
        if(enseignant.isEmpty()){
            throw new Exception("enseignant doesn't exist");
        }
        return (Enseignant) enseignant.get();
    }
}
