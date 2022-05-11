import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; 
import Enseignantservice from '../service/Enseignantservice';

export const Listenseignant = () => {
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
    
    const mystyle = {
        float: "left ",
        margin: "0",
       
      };
  return (
     
    <div>
              <h2 className="text-center" >Enseignant list</h2>
              <Link to="/admin/add_enseignant" className="btn btn-primary mb-2" style={{float: "left "  }}>Add Enseignant</Link>
             
              <div className="rox">
                  <table className="table table-striped table-bordered">
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
                                        
                                        <Link  className='btn btn-info' to= {"/admin/edit-enseignant/"+enseignant.userId }  >Update</Link>
                                        <button className='btn btn-danger'  onClick={()=>deleteEnseignant(enseignant.userId)}>Delete</button>
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
