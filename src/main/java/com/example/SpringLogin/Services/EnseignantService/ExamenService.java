package com.example.SpringLogin.Services.EnseignantService;

import com.example.SpringLogin.Entities.*;
import com.example.SpringLogin.Entities.Module;
import com.example.SpringLogin.Configrations.SecurityServices.ContextHandlerClass;
import com.example.SpringLogin.Enumarators.teachingType;
import com.example.SpringLogin.Exception.systemException;
import com.example.SpringLogin.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ExamenService {

    @Autowired
    private ContextHandlerClass contextHandlerClass;
    @Autowired
    private ModuleRepo moduleRepo;
    @Autowired
    private AffectationModuleRepo affectationModuleRepo;
    @Autowired
    private ExamenRepo examenRepo;
    @Autowired
    private ExamenQuestionRepo examenQuestionRepo;
    @Autowired
    private QuestionRepo questionRepo;

    public ExamenService(){
        System.out.println("ExamenService Initialized");
    }

    private Enseignant getEnseignant(){
        return (Enseignant) contextHandlerClass.getCurrentLoggedInUser().getUtilisateur();
    }

    private boolean canAccessExamsofModule(Module module){
        Optional<AffectationModule> affectationModule = affectationModuleRepo.findByEnseignantAndModule(getEnseignant(),module);
        if(affectationModule.isEmpty()){
            return false;
        }
        return affectationModule.get().getType().equals(teachingType.COURSE);
    }

    public Examen getModuleExam(Long moduleId) throws Exception{
        Optional<Module> moduleOpt =  moduleRepo.findById(moduleId);
        if(moduleOpt.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        Module module = moduleOpt.get();
        if(!canAccessExamsofModule(module)){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }
        Optional<Examen> examen = examenRepo.findByModule(module);
        if(examen.isEmpty())
        {
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        return examen.get();
    }

    private boolean validQuestions(Collection<ExamenQuestion> examenQuestionList, Module module) {
        for (ExamenQuestion examenQuestion : examenQuestionList) {
            Optional<Question> dbQuestion = questionRepo.findById(examenQuestion.getQuestion().getQuestionId());

            if(dbQuestion.isEmpty()){
                return false;
            }

            if(!dbQuestion.get().getModule().equals(module)){
                return false;
            }
        }
        return true;
    }

    @Transactional(readOnly = false)
    public void addExamen(Examen examen) throws Exception {

        Optional<Module> moduleOpt =  moduleRepo.findById(examen.getModule().getId());
        if(moduleOpt.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canAccessExamsofModule(moduleOpt.get())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        if(!validQuestions(examen.getExamenQuestions(),moduleOpt.get())){
            throw new systemException("Invalid questions");
        }


        Optional<Examen> currentExam = examenRepo.findByModule(moduleOpt.get());
        if(!currentExam.isEmpty()) {
            examen.setExamId(currentExam.get().getExamId());
            modifyExamen(examen);
        }
        else {
            examen.setDateCreation(new Timestamp(System.currentTimeMillis()));
            examen.getExamenQuestions().forEach(examenQuestions -> {
                examenQuestions.setExamen(examen);
                examenQuestions.setQuestion(questionRepo.findById(examenQuestions.getQuestion().getQuestionId()).get());
            });
            examenRepo.save(examen);
        }

    }

    @Transactional(readOnly = false)
    public void deleteExamen(Long examId) throws Exception {
        Optional<Examen> examen = examenRepo.findById(examId);
        if(examen.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }
        if(!canAccessExamsofModule(examen.get().getModule())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        examen.get().removeAllQuestion();
        examenRepo.deleteById(examen.get().getExamId());

    }

    @Transactional(readOnly = false)
    public void modifyExamen(Examen examen) throws Exception {

        Optional<Examen> realExamen = examenRepo.findById(examen.getExamId());

        if(realExamen.isEmpty()){
            throw new systemException(systemException.ExceptionType.NOT_EXISTENCE);
        }

        if(!canAccessExamsofModule(examen.getModule())){
            throw new systemException(systemException.ExceptionType.ACCESS);
        }

        if(!validQuestions(examen.getExamenQuestions(),examen.getModule())){
            throw new Exception("Invalid question modules");
        }


        //Modifying data
        realExamen.get().setDateCreation(new Timestamp(System.currentTimeMillis()));
        realExamen.get().setPublicInfo(examen.getPublicInfo());
        realExamen.get().removeAllQuestion();
        examen.getExamenQuestions().forEach( examenQuestion -> {
            examenQuestion.setExamen(realExamen.get());
            Optional<ExamenQuestion> examenQuestionDB = examenQuestionRepo.findByExamenAndQuestion(examenQuestion.getExamen(),examenQuestion.getQuestion());
            if(examenQuestionDB.isEmpty()) {
                examenQuestion.setQuestion(questionRepo.findById(examenQuestion.getQuestion().getQuestionId()).get());
            }
            else{
                examenQuestion = examenQuestionDB.get();
            }
        });

        realExamen.get().getExamenQuestions().addAll(examen.getExamenQuestions());

    }


}
