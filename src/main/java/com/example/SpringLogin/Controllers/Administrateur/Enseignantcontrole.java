package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Enumarators.Role;
import com.example.SpringLogin.Repos.EnseignantRepo;
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

import com.example.SpringLogin.Entities.Enseignant;


@RestController
@RequestMapping("/admin/api/gesenseignant")
public class Enseignantcontrole {
	
	@Autowired
	private EnseignantRepo enseignantRespository;
	@Autowired
	private ContextHandlerClass contextHandlerClass;

	private final UtilisateurRepo utilisateurRepo;

	private final PasswordEncoder passwordEncoder;

	public Enseignantcontrole(UtilisateurRepo utilisateurRepo, PasswordEncoder passwordEncoder) {
		this.utilisateurRepo = utilisateurRepo;
		this.passwordEncoder = passwordEncoder;
	}

	private Administrateur getAdmin(){
		return (Administrateur) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
	}

	@PostMapping("/save")
	public ResponseEntity<?> saveEnseignantcontrole(@RequestBody Enseignant enseignant) {

		if (utilisateurRepo.findByEmail(enseignant.getEmail()) != null) {
			return new ResponseEntity<>("There is an account with that email address",HttpStatus.FORBIDDEN);
		}

		Enseignant enseignantInstance = new Enseignant();
		enseignantInstance.setEmail(enseignant.getEmail());
		enseignantInstance.setName(enseignant.getName());
		enseignantInstance.setLastName(enseignant.getLastName());
		enseignantInstance.setGrade(enseignant.getGrade());
		enseignantInstance.setUserRole(Role.ENSEIGNANT);
		enseignantInstance.setAdmin(getAdmin());
		enseignantInstance.setPassword(passwordEncoder.encode(enseignant.getPassword()));
		return new ResponseEntity<>(enseignantRespository.save(enseignantInstance), HttpStatus.OK);
	}

	@GetMapping("/getEnseignant")
	public List<Enseignant> getEnseignantcontrole() {
		return enseignantRespository.findAll();

	}

	@GetMapping("/getEnseignantbyidcontrole/{userId}")
	public Enseignant getEnseignantbyidcontrole(@PathVariable Long userId) {
		System.out.println(userId);
		Enseignant enseignant= enseignantRespository.findById(userId).orElse(null);
		return enseignant;
	}
	@PutMapping("/updateEnseignantcontrole/{userId}")
	public Enseignant updateEnseignantcontrole(@PathVariable Long userId ,@RequestBody Enseignant enseignantdetail) {

		Enseignant updateenseignant= enseignantRespository.findById(userId).orElse(null);
		updateenseignant.setAdmin(enseignantdetail.getAdmin());
		updateenseignant.setEmail(enseignantdetail.getEmail());
		updateenseignant.setLastName(enseignantdetail.getLastName());
		updateenseignant.setName(enseignantdetail.getName());
		updateenseignant.setPassword(passwordEncoder.encode(enseignantdetail.getPassword()));
		updateenseignant.setUrlProfile(enseignantdetail.getUrlProfile());
		updateenseignant.setUserRole(enseignantdetail.getUserRole());
		updateenseignant.setGrade(enseignantdetail.getGrade());
		Enseignant enseignant =enseignantRespository.save(updateenseignant);
		return enseignant;
	}

	@DeleteMapping("/deleteEnseignant/{userId}")
	public String deleteEnseignant(@PathVariable Long userId) {
		enseignantRespository.deleteById(userId);
		return "Enseignant removed"+userId;

	}
/*
@GetMapping("/getEnseignantbyidcontrole/{userId}") 
public  Enseignant getEnseignantbyidcontrole(@PathVariable(name = "userId") Long Id) {
	
	
	
	return enseignantRestService.getEnseignantbyid(Id);
	
	
}
*/

/*
@DeleteMapping("/deleteEnseignantcontrole/{userId}")
public String deleteEnseignantcontrole(@PathVariable Long userId) {
	return enseignantRestService.deleteEnseignant(userId);
	
	
}

@GetMapping("/getEnseignantbyidcontrole/{userId}") 
public  Enseignant getEnseignantbyidcontrole(@PathVariable(name = "userId") Long Id) {
	
	
	
	return enseignantRestService.getEnseignantbyid(Id);
	
	
}

@PutMapping("/updateEnseignantcontrole/{userId}")
public Enseignant updateEnseignantcontrole(@PathVariable Long userId ,@RequestBody Enseignant enseignant) {
	
	Enseignant exeistingenseignant = enseignantRestService.getEnseignantbyid(userId);
	exeistingenseignant.setAdmin(enseignant.getAdmin());
	exeistingenseignant.setEmail(enseignant.getEmail());
	exeistingenseignant.setLastName(enseignant.getLastName());
	exeistingenseignant.setName(enseignant.getName());
	exeistingenseignant.setPassword(enseignant.getPassword());
	exeistingenseignant.setUrlProfile(enseignant.getUrlProfile());
	exeistingenseignant.setUserRole(enseignant.getUserRole());
	exeistingenseignant.setGrade(enseignant.getGrade());
	
	return enseignantRestService.updateEnseignant(exeistingenseignant);
	
}
*/

	

}
