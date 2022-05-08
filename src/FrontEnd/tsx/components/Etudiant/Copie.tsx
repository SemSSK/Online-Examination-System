import { Button, Card, CardContent, CardHeader } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reponse from "./Reponse";


const Copie : React.FC<{code,copy,setCopy}> = (props)=>{
    
    const editReponse = (newVal,reponse)=>{
        const reponses = props.copy.reponses.slice();
        reponses[reponses.indexOf(reponse)].content = newVal;
        const newCopy = props.copy;
        newCopy.reponses = reponses;
        props.setCopy(newCopy);
        console.log(props.copy);
    }

    return(
        <Card>
            <CardHeader title={`Examen de ${props.copy.exam.module.nomModule}`  }></CardHeader>
            <CardContent>
                { 
                    props.copy.reponses.map(reponse => {
                    return(
                        <Reponse reponse={reponse} editReponse={editReponse}></Reponse>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default Copie;