package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.AdminService.AdminEnseignantService;
import org.springframework.beans.factory.annotation.Autowired;

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

import com.example.SpringLogin.Entities.Enseignant;


@RestController
@RequestMapping("/admin/enseignant")
public class AdminEnseignantController {
	

	@Autowired
	private AdminEnseignantService adminEnseignantService;





	@PostMapping("/save")
	public ResponseEntity<?> addEnseignant(@RequestBody Enseignant enseignant) {
		try{
			return new ResponseEntity<>(adminEnseignantService.addEnseignant(enseignant), HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@GetMapping("")
	public ResponseEntity<?> getAllEnseignants() {
		List <Enseignant> listEnseignant = adminEnseignantService.getAllEnseignants();
		if(!listEnseignant.isEmpty()) {
			return new ResponseEntity<>(listEnseignant, HttpStatus.OK);
		}else{
			return new ResponseEntity<>("no enseignant found", HttpStatus.OK);
		}

	}

	@GetMapping("/getEnseignant/{userId}")
	public ResponseEntity<?> getEnseignantById(@PathVariable Long userId) {

		try {
			return new ResponseEntity<>(adminEnseignantService.getEnseignantByID(userId),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}

	}
	@PutMapping("/editEnseignant")
	public ResponseEntity<?> updateEnseignant(@RequestBody Enseignant enseignant) {
		try {
			return new ResponseEntity<>(adminEnseignantService.editEnseignant(enseignant),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@DeleteMapping("/deleteEnseignant/{userId}")
	public ResponseEntity<?> deleteEnseignant(@PathVariable Long userId) {
		try {
			return new ResponseEntity<>(adminEnseignantService.deleteEnseignant(userId),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	

}
