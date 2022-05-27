import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Moduleservice from '../service/Moduleservice';
import tableStyle from "../AffectationModule/tableStyle.module.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const Listmodule = () => {
    const navigate = useNavigate();
    const [ module , setModule] =useState([]);
    const getAllModules = () =>{
        Moduleservice.getAllModules().then((Response)=>{
            console.log(Response.data)
            setModule(Response.data)

        }).catch(Error=>{
            console.log(Error)
        })

    }
    useEffect(() => {
        getAllModules();
    },[])

    const deleteModule = (id) =>{
        console.log(id);
        Moduleservice.deleteModule(id).then((Response)=>{
            getAllModules();
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
                    <a href="/admin/add_module" className={tableStyle.btn + " "+ tableStyle.cta_btn}>+ Add New Module</a>
                </div>


                  <table>
                      <thead>
                          <tr>
                              <th> id Module</th>
                              <th> Nom Module</th>
                              <th> Coefficient</th>
                              <th> Niveau</th>
                              <th> hastdtp</th>
                              <th>action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              module?.map(
                                module=>
                                <tr key={module.id}>

                                    <td>{module.id}</td>
                                    <td>{module.nomModule}</td>
                                    <td>{module.coefficient}</td>
                                    <td>{module.niveau}</td>
                                    {module.hasTDTP ?<td>oui</td>:<td>non</td>}




                                    <td>
                                        <IconButton
                                            onClick={()=>goTo(`/admin/edit_module/${module.id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={()=>deleteModule(module.id)}
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
