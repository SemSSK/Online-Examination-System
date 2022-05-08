import { Grid, Typography } from "@mui/material";
import React from "react";


const Profile : React.FC<{enseigant}> = (props)=>{
    return(
        <Grid container justifyContent={"end"}>
            <Grid item xs={'auto'}>
                <Typography>Nom: {props.enseigant.name}</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={"auto"}>
                <Typography>Prenom: {props.enseigant.lastName}</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
        </Grid>
    )
}

export default Profile;