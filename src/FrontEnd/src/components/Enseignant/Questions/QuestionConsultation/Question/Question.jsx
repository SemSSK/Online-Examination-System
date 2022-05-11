import React, { useState } from "react";
import parse from "html-react-parser";
import { Card, CardContent, CardHeader, CardActions, Collapse, Container, Button, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuestionModification from "../../QuestionCreator/QuestionModification";

const Question = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [canMod, setCanMod] = useState(false);
    const navigate = useNavigate();
    const expand = () => {
        if (isExpanded === true) {
            return (<Button endIcon={<ExpandLessIcon />} onClick={e => {
                    setIsExpanded(false);
                    setCanMod(false);
                }}>
                </Button>);
        }
        else {
            return (<Button endIcon={<ExpandMoreIcon />} onClick={e => { setIsExpanded(true); }}>
                </Button>);
        }
    };
    const Delete = (id) => {
        const deleteUrl = "http://localhost:8080/enseignant/question/" + id;
        axios.delete(deleteUrl, { withCredentials: true })
            .then(response => {
            console.log(response.data);
        })
            .catch(error => {
            console.log(error);
        });
    };
    return (<Container>
            <Card variant="outlined">
                <CardContent>
                    <Typography>
                        Author : {props.data.enseignant.name} {props.data.enseignant.lastName}
                    </Typography>
                </CardContent>
                <CardHeader title={props.data.description}></CardHeader>
                <CardContent>
                    <Typography>
                        Créer en : {props.data.dateCreation.substring(-1, 10)}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {expand()}
                </CardActions>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {!canMod &&
                        <>
                            <CardContent>
                                <Typography>
                                    <div className="Question-content">{parse(props.data.content)}</div>
                                </Typography>
                                </CardContent>
                                <CardContent>
                                <Typography>
                                    <div className="Question-typeAnswer">{parse(props.data.typeAnswer)}</div>
                                </Typography>
                            </CardContent>
                        </>}

                    {canMod && <QuestionModification question={props.data}></QuestionModification>}
                    
                </Collapse>

                <CardContent>
                    <Button endIcon={<EditIcon />} onClick={e => {
            setIsExpanded(true);
            setCanMod(!canMod);
        }} disabled={!props.canAlter}>
                        {!canMod && <>Edit</>}
                        {canMod && <>Stop Editing</>}
                    </Button>

                    <Button endIcon={<DeleteIcon />} onClick={e => {
            Delete(props.data.questionId);
        }} disabled={!props.canAlter} href={"/enseignant/questions"}>
                        Delete
                    </Button>
                </CardContent>
                
            </Card>
        </Container>);
};
export default Question;
