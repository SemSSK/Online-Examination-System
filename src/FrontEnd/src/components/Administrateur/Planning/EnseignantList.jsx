import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button, Grid ,Typography} from "@mui/material";
import { useState } from "react";
import EnseignantCard from "./EnseignantCard";


const EnseignantList = ({enseignantList,affectedEnseignant,onEnseigantListChange}) => {
    const [display,setDisplay] = useState(false);

    const isAffected = (enseignant)=>{
        const size = affectedEnseignant.length;
        for(let i = 0; i < size ; i++){
            if(enseignant.userId === affectedEnseignant[i].surveillant.userId){
                return true;
            }
        }
        return false;
    }
    return ( 
        <Grid container>
            <Grid item xs={5} marginTop={"3%"} display={"flex"} alignItems={"center"}>
                <Typography variant="h5">
                    Affecter Surveillant:
                </Typography>
                <Button startIcon={display ? <ArrowUpward onClick={e=>{setDisplay(false)}}></ArrowUpward> 
                    : <ArrowDownward onClick={e=>{setDisplay(true)}}></ArrowDownward>}>
                </Button>
            </Grid>
            {   display && 
                enseignantList.map(enseignant => {
                    return (
                        <Grid item xs={12} marginTop={"1%"} key={enseignant.userId}>
                            <EnseignantCard 
                            enseignant={enseignant}
                            affected={isAffected(enseignant)}
                            onChange={onEnseigantListChange}>
                            </EnseignantCard>
                        </Grid>
                    )
                })
            }
        </Grid>  
     );
}
 
export default EnseignantList;