import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Grid ,Button, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import EtudiantCard from "./EtudiantCard";


const EtudiantList = ({etudiantList,affectedEtudiant,onEtudiantListChange}) => {
    const [display,setDisplay] = useState(false);

    const isAffected = (etudiant)=>{
        const size = affectedEtudiant.length;
        for(let i = 0 ; i < size ; i++){
            if(etudiant.userId === affectedEtudiant[i].userId){
                return true;
            }
        }
        return false;
    }

    return ( 
        <Grid container>
            <Grid item xs={5} marginTop={"3%"} display={"flex"} alignItems={"center"}>
                <Typography variant="h5">
                    Affecter Etudiant:
                </Typography>
                <Button startIcon={display ? <ArrowUpward onClick={e=>{setDisplay(false)}}></ArrowUpward> 
                    : <ArrowDownward onClick={e=>{setDisplay(true)}}></ArrowDownward>}>
                </Button>
            </Grid>
            {
                display && etudiantList.map(etudiant => {
                    return (
                        <Grid item xs={12}  marginTop={"1%"} key={etudiant.key}>
                            <EtudiantCard etudiant={etudiant} affected={isAffected(etudiant)} onChange={onEtudiantListChange}></EtudiantCard>
                        </Grid>
                    )
                })
            }
        </Grid>
    );
}
 
export default EtudiantList;