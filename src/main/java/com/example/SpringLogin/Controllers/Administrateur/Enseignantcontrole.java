package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Repos.EnseignantRepo;
import org.springframework.beans.factory.annotation.Autowired;

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
	private EnseignantRepo enseignantRespository ;

	@PostMapping("/save")
	public Enseignant saveEnseignantcontrole(@RequestBody Enseignant enseignant) {
		System.out.println(enseignant.getPassword());
		System.out.println(enseignant.getGrade());
		System.out.println(enseignant.getLastName());
		System.out.println(enseignant.getName());
		System.out.println(enseignant.getEmail());
		System.out.println(enseignant.getUrlProfile());
		System.out.println(enseignant.getUserRole());
		return enseignantRespository.save(enseignant);
		
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
		updateenseignant.setPassword(enseignantdetail.getPassword());
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
