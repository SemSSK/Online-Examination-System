import { Button, Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Question from "../Questions/QuestionConsultation/Question";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
const QuestionToExam = (props) => {
    const [isReady, setIsReady] = useState(false);
    const checkDuplicateQuestions = (question) => {
        console.log("LoopCall");
        for (let i = 0; i < props.AddedQuestions.length; i++) {
            console.log("LoopCall");
            if (props.AddedQuestions[i].question.questionId === question.questionId) {
                console.log("Same");
                return false;
            }
        }
        return true;
    };
    useEffect(() => {
        const getQuestionsURL = "http://localhost:8080/enseignant/question";
        axios.get(getQuestionsURL, { withCredentials: true })
            .then(response => {
            props.setQuestions(response.data.filter(question => {
                return checkDuplicateQuestions(question);
            }));
            setIsReady(true);
        })
            .catch(error => {
            console.log(error);
        });
    }, []);
    return (<Card>
            <CardHeader title="Question choice"></CardHeader>
            {isReady && props.questions.map(question => {
            if (props.module.id === question.module.id) {
                const exo = {
                    question: question,
                    points: 0,
                    questionNumber: 0
                };
                return (<Card variant="outlined">
                            <CardContent>
                                <Question data={question} canAlter={true}></Question>
                                <Grid container>
                                    <Grid item xs={12} marginBottom="3%"></Grid>
                                    <Grid item xs={12} marginBottom="3%">
                                        <TextField variant="standard" label="Points" type="number" onChange={e => { exo.points = e.target.value; }}></TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="outlined" startIcon={<LibraryAddIcon />} onClick={e => { props.AddQuestion(exo); }}>Add to Exam</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>);
            }
        })}
        </Card>);
};
export default QuestionToExam;
