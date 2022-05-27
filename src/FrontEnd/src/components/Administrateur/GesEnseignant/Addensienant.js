import React,{useState,useEffect} from 'react'
import {Link, useNavigate , useParams} from 'react-router-dom';
import Enseignantservice from '../service/Enseignantservice';


const Addensienant = () => {
    const [ name , setName ] =useState('');
    const [ lastName , setLastName] =useState('');
    const [email  ,setEmail ] =useState('');
    const [password  ,setPassword ] =useState('');
    const [ userRole,setUserRole ] =useState('');
    const [urlProfile  ,setUrlProfile ] =useState('');
    const [grade ,setGrade ] =useState('');
    
    const navigte = useNavigate();
    const {userId}=useParams();

    

    const saveorUodateEnseignant =(e) =>{
        e.preventDefault();
        let Enseignant;

        if(userId){
            Enseignant = {userId,name,lastName,email,password,userRole,urlProfile,grade};
            Enseignantservice.updateEnseignant(JSON.stringify(Enseignant)).then((Response)=>{
                navigte("/admin/listenseignant")
            }).catch(Error=>{
                console.log(Error)
                })
            
        }else{
             Enseignant = {name,lastName,email,password,userRole,urlProfile,grade};
              Enseignantservice.createEnseignant(JSON.stringify(Enseignant)).then((Response)=>{
              console.log(Response.data);
              navigte("/admin/listenseignant")
              }).catch(Error=>{
              console.log(Error)
              })

        }
        
    }
    
    useEffect(() => {
        Enseignantservice.getEnseignantbyid(userId).then((Response)=>{
            setName(Response.data.name)
            setLastName(Response.data.lastName)
            setEmail(Response.data.email)
            setPassword(Response.data.password)
            setUserRole(Response.data.userRole)
            setUrlProfile(Response.data.urlProfile)
            setGrade(Response.data.grade)
        }).catch(Error=>{
            console.log(Error)
        })
      
    }, [])
    
    const title = () =>{
        if(userId){
            return <h2 className="text-center">Update Enseignant</h2>
        }else{
            return <h2 className="text-center">Add Enseignant</h2>
        }

    } 
   
   
  return (
     
    <div>
           <br/>
           <br/>
         <div className="container">
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    {
                        title()
                    }
                    <div className="card-body">
                        <form>
                            <div className="form-group row">
                                <label className=" col-form-label"> First Name :</label>
                                
                                <input type="text" placeholder="name" name="name" className="form-control" value={name} onChange={(e)=>setName(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Last Name :</label>
                                
                                <input type="text" placeholder="Last Name" name="lastName" className="form-control" value={lastName} onChange={(e)=>setLastName(e.target.value)} ></input>
                                </div>
                           
                            <div className="form-group row">
                                <label className="col-form-label"> Email :</label>
                                
                                <input type="email" placeholder="Email" name="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Password :</label>
                                
                                <input type="password" placeholder="Password" name="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label"> User Role :</label>
                                
                                <input type="text" placeholder="name" name="User Role" className="form-control" value={userRole} onChange={(e)=>setUserRole(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Url Profile :</label>
                                
                                <input type="url" placeholder="Url Profile" name="urlProfile" className="form-control" value={urlProfile} onChange={(e)=>setUrlProfile(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label"> Grade :</label>
                                
                                <input type="text" placeholder="Grade" name="grade" className="form-control" value={grade} onChange={(e)=>setGrade(e.target.value)} ></input>
                                
                            </div>
                           
                            <button type="button" className="btn btn-success" onClick={(e)=>saveorUodateEnseignant(e)} >Success</button>
                            <Link to="/admin/listenseignant" className='btn btn-danger'>cancel</Link>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}

export default Addensienant