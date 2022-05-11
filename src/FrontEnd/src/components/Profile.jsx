import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
const Profile = () => {
    const [utilisateur,setUtilisateur] = useState();
    const [isLoaded,setIsLoaded] = useState(false)

    useEffect(()=>{
        const url = "http://localhost:8080/authorization/userData"
        axios.get(url,{withCredentials:true})
        .then(response => {
            if(response.status === 200){
                setUtilisateur(response.data);
                setIsLoaded(true);
            }
        })
    },[])

    return (<Grid container justifyContent={"end"}>
            { isLoaded && <>
                <Grid item xs={'auto'}>
                    <Typography>Nom: {utilisateur.name}</Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={"auto"}>
                    <Typography>Prenom: {utilisateur.lastName}</Typography>
                </Grid>
                <Grid item xs={1}></Grid>
            </>}
        </Grid>);
};
export default Profile;
