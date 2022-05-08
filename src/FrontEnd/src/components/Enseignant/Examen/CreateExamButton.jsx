import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useNavigate } from "react-router-dom";
const CreateExamButton = (props) => {
    const navigate = useNavigate();
    const submitExam = () => {
        const examen = {
            publicInfo: props.publicInfo,
            examenQuestions: props.AddedQuestions,
            module: props.module
        };
        const addExamUrl = "http://localhost:8080/enseignant/examen";
        axios.post(addExamUrl, JSON.stringify(examen), {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
            if (response.status === 200) {
                navigate("/enseignant");
            }
        })
            .catch(error => {
            console.log(error);
        });
    };
    return (<Button variant="contained" endIcon={<NoteAddIcon />} onClick={e => { submitExam(); }}>
            Create Exam
        </Button>);
};
export default CreateExamButton;
