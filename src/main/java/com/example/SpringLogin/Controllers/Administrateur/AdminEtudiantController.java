package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.AdminService.AdminEtudiantService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/admin/etudiant")
public class AdminEtudiantController {



	private final AdminEtudiantService adminEtudiantService;

	public AdminEtudiantController(AdminEtudiantService adminEtudiantService) {
		this.adminEtudiantService = adminEtudiantService;
	}


	@PostMapping("/save")
	public ResponseEntity<?> addEtudiant(@RequestBody Etudiant etudiant) {
		try{
			return new ResponseEntity<>(adminEtudiantService.addEtudiant(etudiant), HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@GetMapping("")
	public ResponseEntity<?> getAllEtudiants() {
		List <Etudiant> listEtudiant = adminEtudiantService.getAllEtudiants();
		if(!listEtudiant.isEmpty()) {
			return new ResponseEntity<>(listEtudiant, HttpStatus.OK);
		}else{
			return new ResponseEntity<>("no etudiant found", HttpStatus.OK);
		}

	}

	@GetMapping("/getEtudiant/{userId}")
	public ResponseEntity<?> getEtudiantById(@PathVariable Long userId) {

		try {
			return new ResponseEntity<>(adminEtudiantService.getEtudiantByID(userId),HttpStatus.OK);
		}
		catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}
		catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}

	}
	@PutMapping("/editEtudiant")
	public ResponseEntity<?> updateEtudiant(@RequestBody Etudiant etudiant) {
		try {
			return new ResponseEntity<>(adminEtudiantService.editEtudiant(etudiant),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@DeleteMapping("/deleteEtudiant/{userId}")
	public ResponseEntity<?> deleteEtudiant(@PathVariable Long userId) {
		try {
			return new ResponseEntity<>(adminEtudiantService.deleteEtudiant(userId),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}



}
