package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Repos.EtudiantRepo;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpringLogin.Entities.Etudiant;

@RestController
@RequestMapping("/admin/api/gesetudiant")
public class Etudiantcontrole {

	@Autowired
	EtudiantRepo etudiantRespository;

	@Autowired
	private ContextHandlerClass contextHandlerClass;

	private final UtilisateurRepo utilisateurRepo;

	private final PasswordEncoder passwordEncoder;

	public Etudiantcontrole(UtilisateurRepo utilisateurRepo, PasswordEncoder passwordEncoder) {
		this.utilisateurRepo = utilisateurRepo;
		this.passwordEncoder = passwordEncoder;
	}


	private Administrateur getAdmin(){
		return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
	}

	@PostMapping("/save")
	public ResponseEntity<?> saveEtudiantcontrole(@RequestBody Etudiant etudiant) {
		if (utilisateurRepo.findByEmail(etudiant.getEmail()) != null) {
			return new ResponseEntity<>("There is an account with that email address", HttpStatus.FORBIDDEN);
		}

		Etudiant etudiantInstance = new Etudiant();
		etudiantInstance.setEmail(etudiant.getEmail());
		etudiantInstance.setName(etudiant.getName());
		etudiantInstance.setLastName(etudiant.getLastName());
		etudiantInstance.setUserRole(Role.ETUDIANT);
		etudiantInstance.setAdmin(getAdmin());
		etudiantInstance.setPassword(passwordEncoder.encode(etudiant.getPassword()));
		return new ResponseEntity<>(etudiantRespository.save(etudiantInstance), HttpStatus.OK);
		
	}
	
	@GetMapping("/getEtudiantcontrole")
	public List<Etudiant> getEtudiantcontrole() {
		return etudiantRespository.findAll();
		
	}
	
	@GetMapping("/getEtudiantbyidcontrole/{userId}") 
	public Etudiant getEtudiantbyidcontrole(@PathVariable Long userId) {
		System.out.println(userId);
		Etudiant etudiant= etudiantRespository.findById(userId).orElse(null);
		return etudiant;
	}
	@PutMapping("/updateEtudiantcontrole/{userId}")
	public Etudiant updateEtudiantcontrole(@PathVariable Long userId ,@RequestBody Etudiant etudiantdetail) {
		
		Etudiant updateetudiant= etudiantRespository.findById(userId).orElse(null);
		updateetudiant.setAdmin(etudiantdetail.getAdmin());
		updateetudiant.setEmail(etudiantdetail.getEmail());
		updateetudiant.setLastName(etudiantdetail.getLastName());
		updateetudiant.setName(etudiantdetail.getName());
		updateetudiant.setPassword(passwordEncoder.encode(etudiantdetail.getPassword()));
		updateetudiant.setUrlProfile(etudiantdetail.getUrlProfile());
		updateetudiant.setUserRole(etudiantdetail.getUserRole());
		updateetudiant.setNiveau(etudiantdetail.getNiveau());
		updateetudiant.setSection(etudiantdetail.getSection());
		updateetudiant.setGroupe(etudiantdetail.getGroupe());
		Etudiant etudiant =etudiantRespository.save(updateetudiant);
		return etudiant;
	}
	@DeleteMapping("/deleteEtudiant/{userId}")
	public String deleteEtudiant(@PathVariable Long userId) {
		etudiantRespository.deleteById(userId);
		return "Etudiant removed"+userId;
		
	}

}
