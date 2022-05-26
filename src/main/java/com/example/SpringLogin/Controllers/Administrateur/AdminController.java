package com.example.SpringLogin.Controllers.Administrateur;

import java.util.List;

import com.example.SpringLogin.Entities.Administrateur;
import com.example.SpringLogin.Entities.Enseignant;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.AdminService.AdminService;

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



@RestController
@RequestMapping("/admin")
public class AdminController {



    private AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    @PostMapping("/save")
    public ResponseEntity<?> addAdmin(@RequestBody Administrateur admin) {
        try{
            return new ResponseEntity<>(adminService.addAdmin(admin), HttpStatus.OK);
        }catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }catch(Exception ex){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("")
    private ResponseEntity<Administrateur> getProfile(){
        return new ResponseEntity<>(adminService.getAdmin(), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllAdmins() {
        List <Administrateur> listAdmin = adminService.getAllAdmins();
        if(!listAdmin.isEmpty()) {
            return new ResponseEntity<>(listAdmin, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("no admin found", HttpStatus.OK);
        }

    }

    @GetMapping("/getAdmin/{userId}")
    public ResponseEntity<?> getAdminById(@PathVariable Long userId) {

        try {
            return new ResponseEntity<>(adminService.getAdminByID(userId),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception ex){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }

    }
    @PutMapping("/editAdmin")
    public ResponseEntity<?> updateAdmin(@RequestBody Administrateur admin) {
        try {
            return new ResponseEntity<>(adminService.editAdmin(admin),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception ex){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/deleteAdmin/{userId}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long userId) {
        try {
            return new ResponseEntity<>(adminService.deleteAdmin(userId),HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch(Exception ex){
            return new ResponseEntity<>("Sorry, an error occurred ",HttpStatus.FORBIDDEN);
        }
    }

}
