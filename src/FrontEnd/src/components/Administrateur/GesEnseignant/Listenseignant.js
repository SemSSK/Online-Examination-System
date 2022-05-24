import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Enseignantservice from '../service/Enseignantservice';
import tableStyle from "../AffectationModule/tableStyle.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';

export const Listenseignant = () => {
    const navigate = useNavigate();
    const [ enseignant , setEnseignant] =useState([]);
    const getAllEnseignants = () =>{
        Enseignantservice.getAllEnseignants().then((Response)=>{
            setEnseignant(Response.data)
            console.log(Response.data)
        }).catch(Error=>{
            console.log(Error)
        })

    }
    useEffect(() => {
        getAllEnseignants();
    },[])

    const deleteEnseignant = (userId) =>{
        console.log(userId);
        Enseignantservice.deleteEnseignant(userId).then((Response)=>{
            getAllEnseignants();
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
                    <h1>Teachers list :</h1>
                    <a href="/admin/add_enseignant" className={tableStyle.btn + " "+ tableStyle.cta_btn}>+ Add New Teacher</a>
                </div>
                  <table >
                      <thead>
                          <tr>
                              <th> first name</th>
                              <th> first name</th>
                              <th> last name</th>
                              <th> email</th>
                              <th> role</th>
                              <th> grade</th>
                              <th>action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              enseignant.map(
                                enseignant=> 
                                <tr key={enseignant.id}>
                                    
                                    <td>{enseignant.userId}</td>
                                    <td>{enseignant.name}</td>
                                    <td>{enseignant.lastName}</td>
                                    <td>{enseignant.email}</td>
                                    <td>{enseignant.userRole}</td>
                                    <td>{enseignant.grade}</td>
                                    <td>
                                        <IconButton
                                            onClick={()=>goTo(`/admin/edit-enseignant/${enseignant.userId}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={()=>deleteEnseignant(enseignant.userId)}
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
