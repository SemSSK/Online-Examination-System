import React ,{useState} from "react";
import QuestionEditor from "./QuestionEditor";
import axios from "axios";
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";

interface module {
    id
}


const QuestionCreator : React.FC<{currentAffectation}> = (props)=>{
    const [content,setContent] = useState<string>("");
    const [typeAnswer,setTypeAnswer] = useState<string>();
    const [description,setDescription] = useState<string>();
    const navigate = useNavigate();

    const setOnAdd = ()=>{

        const AddQuestionUrl = "http://localhost:8080/enseignant/question";

        const question = {
            content: content,
            typeAnswer : typeAnswer,
            points : 0,
            description : description,
            module : props.currentAffectation.module
        };

        console.log(question);

        axios.post(AddQuestionUrl,
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
                            <TextField type={"text"} onChange={e => {setDescription(e.target.value)}} >
                            </TextField>
                        </CardContent>
                        <CardContent>
                            <Button 
                                variant="contained" 
                                onClick={e =>{
                                    setOnAdd();
                                }}
                                endIcon={<CreateIcon/>}
                            >
                                Create
                            </Button>
                        </CardContent>
                    </Container>
                </Card>
            </Container>
    )
}

export default QuestionCreator;