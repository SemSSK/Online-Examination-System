import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; 
import Moduleservice from '../service/Moduleservice';

export const Listmodule = () => {
    const [ module , setModule] =useState([]);
    const getAllModules = () =>{
        Moduleservice.getAllModules().then((Response)=>{
            setModule(Response.data)
            console.log(Response.data)
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


    const mystyle = {
        float: "left ",
        margin: "0",
       
      };
  
      
   
  return (
     
    <div>
              <h2 className="text-center" >Module list</h2>
              <Link to="/admin/add_module" className="btn btn-primary mb-2" style={{float: "left "  }}>Add Module</Link>
             
              <div className="rox">
                  <table className="table table-striped table-bordered">
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
                              module.map(
                                module=> 
                                <tr key={module.id}>
                                    
                                    <td>{module.id}</td>
                                    <td>{module.nomModule}</td>
                                    <td>{module.coefficient}</td>
                                    <td>{module.niveau}</td>
                                    {module.hasTDTP ?<td>oui</td>:<td>non</td>}
                                        
                                    
                                    
                                    
                                    <td>
                                        
                                        <Link  className='btn btn-info' to= {"/admin/edit_module/"+module.id }  >Update</Link>
                                        <button className='btn btn-danger' style={mystyle} onClick={()=>deleteModule(module.id)} >Delete</button>
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
