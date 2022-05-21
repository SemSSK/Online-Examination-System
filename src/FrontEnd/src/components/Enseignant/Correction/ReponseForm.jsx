import { Card, CardContent, Slider, Typography } from "@mui/material";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

const ReponseForm = ({reponse,changeReponsePoints}) => {
    const [points,setPoints] = useState(reponse.points);
    useEffect(()=>{
        setPoints(reponse.points);
    },[reponse])

    return ( <Card>
        <CardContent>
            <Typography variant="h6"> question : </Typography>
            <div className="Question-content">{parse(reponse.question.question.content)}</div>
        </CardContent>
        <CardContent>
            <Typography variant="h6"> Reponse type : </Typography>
            <div className="Reponse-type-content">{parse(reponse.question.question.typeAnswer)}</div>
        </CardContent>
        <CardContent>
            <Typography variant="h6"> Reponse de l'etudiant : </Typography>
            <div className="Reponse-content">{parse(reponse.content)}</div>
        </CardContent>
        <CardContent>
            <Slider
                min={0}
                max={reponse.question.points}
                step={0.25}
                defaultValue={points}
                valueLabelDisplay="on"
                onChange={e => {
                    reponse.points = e.target.value;
                    changeReponsePoints(reponse);
                }}  
            />
        </CardContent>
    </Card> );
}
 
export default ReponseForm;