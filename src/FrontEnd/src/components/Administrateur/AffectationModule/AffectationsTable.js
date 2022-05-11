import React,{useState,useEffect} from "react"
import AffectationForum from "./AffectationForum"
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import './tableStyle.css';
import api from './api/backendRestApi';

export default function AffectationsTable() {

    const [enseignements,setEnseignements] = useState();
    const enseignement = [
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        },
        { 
            module:"module",
            teacher:'teacher',
            type:'type',
            date:'date'
        }        

    ]

    useEffect(() => {
        const fetchEnseignements = async ()=> {
            try {
                const response = await api.get('/admin/affectationModule')
                if(response && response.data){
                    setEnseignements(response.data);
                }
            } catch(err){
                if(err.response){
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                }else{
                    console.log(`Error: ${err.message}`);
                }

            }
        }

        fetchEnseignements();
    },[])

    async function deleteAffectation(moduleId, enseignantId) {

        try{
            await api.delete(`/admin/affectationModule/delete/${moduleId}/${enseignantId}`)
            const newList = enseignements.filter(enseignement =>
            !(
                enseignement.affectationModuleId.moduleId === moduleId 
                && enseignement.affectationModuleId.enseignantId === enseignantId 
            ))
        
            setEnseignements(newList)
        }catch(err){
            console.log(`Error: ${err.message}`);
        }
    }

    return(
        <div className="container">
            
            <div className="content-box">
                <AffectationForum 
                    enseignements={enseignements} 
                    setEnseignements={setEnseignements}
                />
                <div className="pageHeader">
                    <h1>Enseignement :</h1>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>Enseignent</th>
                            <th>Type d'Enseignement</th>
                            <th>date d'affectation</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            enseignements && enseignements.map((child,index) => {
                                return(
                                <tr key={index}>
                                    <td>{child.module.nomModule}</td>
                                    <td>{child.enseignant.name}</td>
                                    <td>{child.type}</td>
                                    <td>{child.affectationDate}</td>
                                    <td> 
                                        <IconButton 
                                            onClick={
                                                ()=> deleteAffectation(child.affectationModuleId.moduleId, child.affectationModuleId.enseignantId)
                                            }
                                        > 
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                                )})
                        }
                        

                    </tbody>
                </table>
            </div>
        </div>

                
    )

}