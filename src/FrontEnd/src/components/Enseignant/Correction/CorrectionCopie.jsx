import { Button, Card, CardContent, Typography } from "@mui/material";

const CorrectionCopie = ({copie}) => {
    return ( <Card variant="outlined">
        <CardContent>
            <Typography variant="h6">
                {copie.etudiant.name} {copie.etudiant.lastName}
            </Typography>
        </CardContent>
        <CardContent>
            <Button variant="contained" href={`/enseignant/correction/${copie.copieId}`}>Corriger</Button>
        </CardContent>
    </Card> );
}
 
export default CorrectionCopie;