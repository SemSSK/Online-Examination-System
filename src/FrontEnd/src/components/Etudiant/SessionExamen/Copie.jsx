import { Card, CardContent, CardHeader,Box } from "@mui/material";
import React from "react";
import Reponse from "./Reponse";
const Copie = (props) => {
    const editReponse = (newVal, reponse) => {
        const reponses = props.copy.reponses.slice();
        reponses[reponses.indexOf(reponse)].content = newVal;
        const newCopy = props.copy;
        newCopy.reponses = reponses;
        props.setCopy(newCopy);
        console.log(props.copy);
    };
    return (<Box>
                <Card>
                    <CardHeader title={`Examen de ${props.copy.exam.module.nomModule}`}></CardHeader>
                    <CardContent>
                        {props.copy.reponses.map(reponse => {
                    return (<Reponse reponse={reponse} editReponse={editReponse}></Reponse>);
                })}
                    </CardContent>
                </Card>
            </Box>);
};
export default Copie;
