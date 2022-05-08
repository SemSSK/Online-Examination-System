import axios from "axios";
import React, { useEffect, useState } from "react";
import './QuestionConsultation.tsx';
import Question from "./Question/Question";
import { Button,Card,CardContent, Container, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';



const QuestionConsultation : React.FC<{currentAffectation}> = (props)=>{
    const [questions,setQuestions] = useState([{}]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        const getQuestionsURL = "http://localhost:8080/enseignant/question";
        axios.get(getQuestionsURL,{withCredentials:true})
        .then(response => {
            setQuestions(response.data);
            console.log(questions);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error)
        });
    },[])

    const canAlter = (question)=>{ 
        if(question.enseignant.userId === props.currentAffectation.enseignant.userId){
            return true;
        }
        return props.currentAffectation.type === "COURS";
    }

    return(
            <Container>
                <Card>
                    <CardContent>
                        <Button href="/enseignant/questions/add" endIcon={<AddIcon/>} variant="outlined">
                            Add Question
                        </Button>
                    </CardContent>
                    <CardContent>
                        <Grid container spacing={4}>
                            {!(isLoading) && questions.map((q:any) => {
                                if(q.module.id === props.currentAffectation.module.id)
                                return (
                                    <Grid item xs={12} key={q.questionId}>
                                        <Question data={q} canAlter={canAlter(q)}></Question>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </CardContent>
                </Card>

            </Container>
    );
}

export default QuestionConsultation;

