package com.example.SpringLogin.Repos;

import com.example.SpringLogin.Entities.Examen;
import com.example.SpringLogin.Entities.ExamenQuestion;
import com.example.SpringLogin.Entities.ExamenQuestionsKey;
import com.example.SpringLogin.Entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamenQuestionRepo extends JpaRepository<ExamenQuestion, ExamenQuestionsKey> {
    public List<ExamenQuestion> findAllByQuestionNumber(int questionNumber);
    public Optional<ExamenQuestion> findByExamenAndQuestion(Examen examen, Question question);
    public void deleteByQuestion(Question question);
    public void deleteByExamen(Examen examen);
}
