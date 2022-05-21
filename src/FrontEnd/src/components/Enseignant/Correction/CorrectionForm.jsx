import { Button, Card, CardContent,TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReponseForm from "./ReponseForm";


const CorrectionForm = () => {
    const {copieId} = useParams()
    const [copie,setCopie] = useState();
    const navigate = useNavigate();
    
    useEffect(()=>{
        const url = `http://localhost:8080/enseignant/correction/${copieId}`;
        axios.get(url,{withCredentials:true})
        .then((response)=>{
            if(response.status === 200){
                const data = response.data;
                console.log(data);
                setCopie(data);
            }
            else{
                throw response.data;
            }
        })
        .catch(errorMsg => {
            console.log(errorMsg);
        })
    },[])

    const enregisterCorrection = ()=>{
        const url = `http://localhost:8080/enseignant/correction`;
        const data = JSON.stringify(copie);
        axios.put(url,data,{
            withCredentials:true,
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 200){
                navigate("/enseignant/correction");
            }
            else{
                throw response.data;
            }
        })
        .catch(errorMsg =>{
            console.log(errorMsg);
        })
    }

    const noteReponse = (reponse)=>{
        const reponseIndex = copie.reponses.findIndex(r => {
            return r.reponseId === reponse.reponseId;
        })
        copie.reponses[reponseIndex].points = reponse.points;
        setCopie(copie);
    }

    return (
        <> 
            {copie && (<Card>
                <CardContent>
                    {
                        copie.reponses.map(reponse => {
                            return (
                                <ReponseForm reponse={reponse} changeReponsePoints={noteReponse} key={reponse.copieId} ></ReponseForm>
                            )
                        })
                    }
                </CardContent>
                <CardContent>
                    <TextField defaultValue={copie.observation} onChange={e => {
                        copie.observation = e.target.value;
                        setCopie(copie);
                    }} multiline rows={4}/>
                </CardContent>
                <CardContent>
                    <Button variant="contained" onClick={e => {enregisterCorrection()}}>Enregister</Button>
                </CardContent>
            </Card> )}
        </> 
    );
}
 
export default CorrectionForm;