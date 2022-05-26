package com.example.SpringLogin.Controllers.Enseignant;

import com.example.SpringLogin.Entities.AffectationModule;
import com.example.SpringLogin.Entities.Question;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Services.EnseignantService.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enseignant/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("")
    public ResponseEntity<?> getQuestions(){
        return  new ResponseEntity<>(questionService.getQuestions(),HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> addQuestion(@RequestBody Question question){
        try{
            questionService.addQuestion(question);
            return new ResponseEntity<>("Question added successfully",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable(name = "id") Long id){
        try{
            questionService.deleteQuestion(id);
            return new ResponseEntity<>("Question deleted Successfully",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }


    @PutMapping("")
    public ResponseEntity<?> editQuestion(@RequestBody Question question) {
        try {
            questionService.modifyQuestion(question);
            return new ResponseEntity<>("Question modified Successfully",HttpStatus.OK);
        }
        catch(systemException sexc){
            return new ResponseEntity<>(sexc.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception exc){
            return new ResponseEntity<>("Sorry, an error occurred ", HttpStatus.FORBIDDEN);
        }
    }
}
