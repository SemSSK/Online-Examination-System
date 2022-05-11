import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; 
import Etudiantservise from '../service/Etudiantservise';

export const Listetudiant = () => {
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
    
  
   
  return (
      
     
    <div>
              <h2 className="text-center" >Etudiant list</h2>
              <Link to="/admin/add_etudiant" className="btn btn-primary mb-2" style={{float: "left "  }}>Add Etudiant</Link>
             
              <div className="rox">
                  <table className="table table-striped table-bordered">
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
                                        
                                        <Link  className='btn btn-info' to= {"/admin/edit-etudiant/"+etudiant.userId }  >Update</Link>
                                        <button className='btn btn-danger'onClick={()=>deleteEtudiant(etudiant.userId)} >Delete</button>
                                    </td>

                                </tr>
                              )
                          }
                      </tbody>

                  </table>

              </div>

          </div>
  )
}
