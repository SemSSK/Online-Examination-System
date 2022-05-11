import { Card, CardContent, Checkbox, Grid, Typography } from "@mui/material";

const EtudiantCard = ({etudiant,affected,onChange})=>{
    return(
        <Card>
            <CardContent>
                <Grid container>
                        <Grid item xs={7}>
                            <Typography>@ Email: {etudiant.email}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography>Nom: {etudiant.name}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography>Prenom: {etudiant.lastName}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Checkbox checked={affected} onChange={(e)=>{
                                onChange(e.target.checked,etudiant);
                            }}></Checkbox>
                        </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
};

export default EtudiantCard;

