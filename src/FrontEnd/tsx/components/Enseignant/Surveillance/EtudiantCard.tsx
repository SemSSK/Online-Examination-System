import { Button, Card, CardContent, CardHeader,Box, Typography } from "@mui/material";
import axios from "axios";
import React from "react";


const EtudiantCard : React.FC<{presence,code}> = (props)=>{
    const etudiant = props.presence.etudiant;
    
    const markPresent = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/présence`;
        axios.put(url,etudiant,{withCredentials:true});
    }

    const markAbsent = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/absent`
        axios.put(url,etudiant,{withCredentials:true});
    }

    const block = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/block`;
        axios.put(url,etudiant,{withCredentials:true});
    }

    const unblock = ()=>{
        const url = `http://localhost:8080/enseignant/surveillance/${props.code}/unblock`;
        axios.put(url,etudiant,{withCredentials:true});
    }


    const displayPresenceActions = ()=>{
        const etat = props.presence.state;
        switch(etat){
            case("ABSENT"):return(
                <Button onClick={e => {markPresent()}}>Marquer présent</Button>
            );
            break;
            case("PRESENT"):return(
                <Button onClick={e => {markAbsent()}}>Marquer Absent</Button>
            )
            break;
            default:return(<></>)
        }
    }

    const displayBlockingActions = ()=>{
        const etat = props.presence.state;
        switch(etat){
            case("BLOQUER"):return(
                <Button onClick={e=>{unblock()}}>Débloquer</Button>
            )
            break;
            default:return(<Button onClick={e=>{block()}}>Bloquer</Button>)
        }
    }

    return(
        <Card>
            <CardContent>
                <Typography>
                    nom: {etudiant.name}
                </Typography>
                <Typography>
                    prenom: {etudiant.lastName}
                </Typography>
            </CardContent>
            <CardContent>
                <Typography>
                    Présence: {props.presence.state}
                </Typography>
            </CardContent>
            <CardContent>
                <Box width={"300px"} height={"300px"} style={{backgroundColor:"black"}}></Box>
            </CardContent>
            <CardContent>
                {displayPresenceActions()}
                {displayBlockingActions()}
            </CardContent>
        </Card>
    )
}

export default EtudiantCard;