import { Button, Card, CardContent, Container } from "@mui/material";
import React from "react";
import Question from "../Questions/QuestionConsultation/Question/Question";

const QuestionInExam : React.FC<{question}> = (props)=>{
    return(
        <Container>
                <CardContent>
                    <Question data={props.question} canAlter={true}></Question>
                </CardContent>
        </Container>
    )
}

export default QuestionInExam;