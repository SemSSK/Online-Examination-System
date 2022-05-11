package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Repos.ModuleRepo;
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

import com.example.SpringLogin.Entities.Module;

@RestController
@RequestMapping("/admin/api/Module")
public class Modulecontrole {

	@Autowired
	ModuleRepo moduleRepository;
	
	@PostMapping("/save")
	public Module saveModulecontrole(@RequestBody Module module) {
		return moduleRepository.save(module);
		
	}
	
	@GetMapping("/getModulecontrole")
	public List<Module> getmodulecontrole() {
		return moduleRepository.findAll();
		
	}
	@GetMapping("/getModulebyidcontrole/{id}") 
	public Module getModulebyidcontrole(@PathVariable Long id) {
		System.out.println(id);
		Module module= moduleRepository.findById(id).orElse(null);
		return module;
	}
	@PutMapping("/updateModulecontrole/{id}")
	public Module updateModulecontrole(@PathVariable Long id ,@RequestBody Module moduledetail) {
		
		Module updatemodule= moduleRepository.findById(id).orElse(null);
		updatemodule.setAdmin(moduledetail.getAdmin());
		updatemodule.setNomModule(moduledetail.getNomModule());
		updatemodule.setNiveau(moduledetail.getNiveau());
		updatemodule.setHasTDTP(moduledetail.isHasTDTP());
		
		Module module =moduleRepository.save(updatemodule);
		return module;
	}
	@DeleteMapping("/deleteModule/{id}")
	public String deleteEnseignant(@PathVariable Long id) {
		moduleRepository.deleteById(id);
		return "Enseignant removed"+id;
		
	}
}
