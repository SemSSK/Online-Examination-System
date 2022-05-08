import React ,{useState} from "react";
import QuestionEditor from "./QuestionEditor";
import axios from "axios";
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";
import Question from "../QuestionConsultation/Question/Question";

interface module {
    id
}


const QuestionModification : React.FC<{question}>= (props)=>{
    const [content,setContent] = useState<string>(props.question.content);
    const [typeAnswer,setTypeAnswer] = useState<string>(props.question.typeAnswer);
    const [description,setDescription] = useState<string>(props.question.description);
    const [module,setModule] = useState<module>(props.question.module);
    const navigate = useNavigate();

    const setOnMod = ()=>{

        const ModQuestionUrl = "http://localhost:8080/enseignant/question";

        const question = {
            questionId:props.question.questionId,
            content: content,
            typeAnswer : typeAnswer,
            points : 0,
            description : description,
            module : props.question.module
        };

        console.log(question);

        axios.put(ModQuestionUrl,
            JSON.stringify(question),
            {withCredentials:true,
            headers:{
                'Content-Type':'application/json'
            }})
        .then(response => {
            console.log(response.data);
            navigate("/enseignant/questions");
        })
    }

    return(
            <Container>
                <Card variant="outlined">
                    <Container>
                        <CardHeader title="Creation de question :"/>
                        <CardContent>
                            <Typography variant="h4">
                                Contenu de la question :
                            </Typography>
                            <QuestionEditor setData={setContent} data={content}></QuestionEditor>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                Réponse type de la question :
                            </Typography>
                            <QuestionEditor setData={setTypeAnswer} data={typeAnswer}></QuestionEditor>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h4">
                                Description de la question :
                            </Typography>
                            <TextField value={description} type={"text"} onChange={e => {setDescription(e.target.value)}} >
                            </TextField>
                        </CardContent>
                        <CardContent>
                            <Button 
                                variant="contained" 
                                onClick={e =>{
                                    setOnMod();
                                }}
                                endIcon={<CreateIcon/>}
                            >
                                Modify
                            </Button>
                        </CardContent>
                    </Container>
                </Card>
            </Container>
    )
}

export default QuestionModification;