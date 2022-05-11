package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Repos.EtudiantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@RequestMapping("/admin/api/Etudiant")
public class Etudiantcontrole {

	@Autowired
	EtudiantRepo etudiantRespository;
	
	@PostMapping("/save")
	public Etudiant saveEtudiantcontrole(@RequestBody Etudiant etudiant) {
		return etudiantRespository.save(etudiant);
		
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
		updateetudiant.setPassword(etudiantdetail.getPassword());
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
