import { Card, CardContent, Checkbox, Grid, Typography } from "@mui/material";

const EnseignantCard = ({enseignant,affected,onChange})=>{
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={8}>
                        <Typography>@ Email: {enseignant.email}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography>Nom: {enseignant.name}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography>Prenom: {enseignant.lastName}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Checkbox checked={affected} onChange={(e)=>{
                             onChange(e.target.checked,enseignant);
                            }}>

                        </Checkbox>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EnseignantCard;