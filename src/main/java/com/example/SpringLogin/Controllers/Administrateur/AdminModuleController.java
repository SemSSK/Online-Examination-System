package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.AdminService.AdminModuleService;

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

import com.example.SpringLogin.Entities.Module;


@RestController
@RequestMapping("/admin/module")
public class AdminModuleController {



	private final AdminModuleService adminModuleService;

	public AdminModuleController(AdminModuleService adminModuleService) {
		this.adminModuleService = adminModuleService;
	}


	@PostMapping("/save")
	public ResponseEntity<?> addModule(@RequestBody Module module) {
		try{
			return new ResponseEntity<>(adminModuleService.addModule(module), HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@GetMapping("")
	public ResponseEntity<?> getAllModules() {
		List <Module> listModule = adminModuleService.getAllModules();
		if(!listModule.isEmpty()) {
			return new ResponseEntity<>(listModule, HttpStatus.OK);
		}else{
			return new ResponseEntity<>("no module found", HttpStatus.OK);
		}

	}

	@GetMapping("/getModule/{moduleId}")
	public ResponseEntity<?> getModuleById(@PathVariable Long moduleId) {

		try {
			return new ResponseEntity<>(adminModuleService.getModuleByID(moduleId),HttpStatus.OK);
		}
		catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}
		catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}

	}
	@PutMapping("/editModule")
	public ResponseEntity<?> updateModule(@RequestBody Module module) {
		try {
			return new ResponseEntity<>(adminModuleService.editModule(module),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}

	@DeleteMapping("/deleteModule/{moduleId}")
	public ResponseEntity<?> deleteModule(@PathVariable Long moduleId) {
		try {
			return new ResponseEntity<>(adminModuleService.deleteModule(moduleId),HttpStatus.OK);
		}catch(systemException sexc){
			return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
		}catch(Exception ex){
			return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
		}
	}



}

	
