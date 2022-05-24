import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Etudiantservise from '../service/Etudiantservise';
import tableStyle from "../AffectationModule/tableStyle.module.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const Listetudiant = () => {
    const navigate = useNavigate();
    const [ etudiant , setetudiant] =useState([]);
    
    const getAllEtudiants = () =>{
        Etudiantservise.getAllEtudiants().then((Response)=>{
            setetudiant(Response.data)
            console.log(Response.data)
        }).catch(Error=>{
            console.log(Error)
        })

    }
    useEffect(() => {
        getAllEtudiants();
    },[])

    const deleteEtudiant = (userId) =>{
        console.log(userId);
        Etudiantservise.deleteEtudiant(userId).then((Response)=>{
            getAllEtudiants();
        }).catch(Error=>{
            console.log(Error)
        })

    }

    const goTo = (url) => {
        navigate(url);
    };
    
  
   
  return (
      
     
    <div>
        <div className={tableStyle.container}>
            <div className={tableStyle.content_box + ' '+tableStyle.special}>
                <div className={tableStyle.pageHeader__version2}>
                    <h1>Students list :</h1>
                    <a href="/admin/add_etudiant" className={tableStyle.btn + " "+ tableStyle.cta_btn}>+ Add New Student</a>
                </div>

                  <table>
                      <thead>
                          <tr>
                              <th> id</th>
                              <th> first name</th>
                              <th> last name</th>
                              <th> email</th>
                              <th> userRole</th>
                              <th> niveau</th>
                              <th> section</th>
                              <th> groupe</th>
                              <th>action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              etudiant.map(
                                etudiant=> 
                                <tr key={etudiant.id}>
                                    
                                    <td>{etudiant.userId}</td>
                                    <td>{etudiant.name}</td>
                                    <td>{etudiant.lastName}</td>
                                    <td>{etudiant.email}</td>
                                    <td>{etudiant.userRole}</td>
                                    <td>{etudiant.niveau}</td>
                                    <td>{etudiant.section}</td>
                                    <td>{etudiant.groupe}</td>
                                    
                                    <td>
                                        <IconButton
                                            onClick={()=>goTo(`/admin/edit-etudiant/${etudiant.userId}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={()=>deleteEtudiant(etudiant.userId)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>

                                </tr>
                              )
                          }
                      </tbody>

                  </table>

              </div>
        </div>

          </div>
  )
}
