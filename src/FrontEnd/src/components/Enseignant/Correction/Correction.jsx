import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CorrectionCopie from "./CorrectionCopie";


const getCopies = (setListCopies,moduleId)=>{

    console.log(moduleId);
    const url = `http://localhost:8080/enseignant/correction/module=${moduleId}`;
    axios.get(url,{withCredentials:true})
    .then(response => {
        if(response.status === 200){
            const listCopies = response.data;
            console.log("Copies gotten:",listCopies);
            setListCopies(listCopies);
        }
        else{
            throw response.data;
        }
    })
    .catch(errorMsg => {
        console.log(errorMsg);
    })
}

const Correction = ({currentModule}) => {
    const [listCopies,setListCopies] = useState([]);

    useEffect(()=>{
        console.log(currentModule);
        getCopies(setListCopies,currentModule.id);
    },[])

    return ( 
        <Grid content>
            { 
                listCopies.map(copie => {
                    return (
                        <Grid item xs={12} key={copie.copieId}>
                            <CorrectionCopie copie={copie}/>
                        </Grid>
                    )
                })
            }
        </Grid>
     );
}
 
export default Correction;