import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import Question from "../Questions/QuestionConsultation/Question/Question";
import LayersClearIcon from '@mui/icons-material/LayersClear';
const AddedQuestionList = (props) => {
    return (<Card variant="outlined">
            {props.addedQuestions.map(AddedQuestion => {
            return (<Card variant="outlined">
                        <CardContent>
                            <Question data={AddedQuestion.question} canAlter={true}></Question>
                            <Grid container>
                                <Grid item xs={12} marginBottom="3%"></Grid>
                                <Grid item xs={12} marginBottom="3%">
                                    <Typography variant="h6">Points: {AddedQuestion.points}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="outlined" startIcon={<LayersClearIcon />} onClick={e => { props.removeQuestion(AddedQuestion); }}>Remove From Exam</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>);
        })}
        </Card>);
};
export default AddedQuestionList;
