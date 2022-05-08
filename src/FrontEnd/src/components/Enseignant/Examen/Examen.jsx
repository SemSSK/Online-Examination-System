import { Typography, Container, Card, CardHeader, CardContent, TextField, Button, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionToExam from "./QuestionToExam";
import AddedQuestionList from "./AddedQuestionList";
import CreateExamButton from "./CreateExamButton";
import ClearIcon from '@mui/icons-material/Clear';
const Examen = (props) => {
    const [publicInfo, setPublicInfo] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [module, setModule] = useState(props.currentAffectation.module);
    const [isAdding, setIsAdding] = useState(false);
    useEffect(() => {
        const getExamUrl = "http://localhost:8080/enseignant/examen/" + module.id;
        axios.get(getExamUrl, {
            withCredentials: true
        })
            .then(response => {
            if (response.status === 200) {
                const currExam = response.data;
                setPublicInfo(currExam.publicInfo);
                setSelectedQuestions(currExam.examenQuestions);
            }
        });
    }, [module]);
    const AddQuestion = (question) => {
        setQuestions(questions.filter(q => { return q.questionId !== question.question.questionId; }));
        selectedQuestions.push(question);
        setSelectedQuestions(selectedQuestions);
    };
    const removeQuestion = (question) => {
        setSelectedQuestions(selectedQuestions.filter(q => { return q.question.questionId !== question.question.questionId; }));
        questions.push(question.question);
        setQuestions(questions);
    };
    const clearExam = () => {
        setPublicInfo("");
        for (let i = 0; i < selectedQuestions.length; i++) {
            console.log("REMOVED");
            removeQuestion(selectedQuestions[i]);
        }
        setSelectedQuestions([]);
    };
    return (<Container>
            <Card variant="outlined">
                <CardHeader title="Creation d'examen :"/>
                <CardContent>
                    <Typography variant="h3">Public info</Typography>
                </CardContent>
                <CardContent>
                    <TextField fullWidth type={"text"} placeholder="Information public" variant="standard" value={publicInfo} onChange={e => { setPublicInfo(e.target.value); }}></TextField>
                </CardContent>
                <CardContent>
                    <Grid container display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Grid item xs={5}>
                            <Button variant="outlined" onClick={e => { setIsAdding(!isAdding); }}>
                                    {!isAdding && <>Add Questions</>}
                                    {isAdding && <>Stop adding</>}
                            </Button>
                            {isAdding && <QuestionToExam questions={questions} setQuestions={setQuestions} AddQuestion={AddQuestion} AddedQuestions={selectedQuestions} module={module}>
                                </QuestionToExam>}
                        </Grid>
                        <Grid item xs={5}>
                            <CardHeader title="Added Questions"></CardHeader>
                            <AddedQuestionList addedQuestions={selectedQuestions} removeQuestion={removeQuestion}></AddedQuestionList>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardContent>
                    <Grid container>
                        <Grid item xs={2}>
                            <CreateExamButton publicInfo={publicInfo} AddedQuestions={selectedQuestions} module={module}></CreateExamButton>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant={"contained"} endIcon={<ClearIcon></ClearIcon>} onClick={e => { clearExam(); }}>
                                clear Exam
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>);
};
export default Examen;
