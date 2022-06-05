import React,{useState,useEffect} from 'react'
import {Link, useNavigate , useParams} from 'react-router-dom';
import EnseignantService from './EnseignantService';
import '../AdminStyle/styleForm.css'


const AddEnsienant = () => {

    const [name, setName]= useState("");
    const [lastName, setLastName]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [userRole, setUserRole]= useState("");
    const [urlProfile, setUrlProfile]= useState("");
    const [grade, setGrade]= useState("");
    const [title, setTitle]= useState("Add Enseignant")
    
    const navigate = useNavigate();
    const {userId} = useParams();

    const saveOrUpdateEnseignant =() =>{
        let Enseignant;
        if(userId){
            Enseignant = {userId,name,lastName,email,password,userRole,urlProfile,grade};
            EnseignantService.updateEnseignant(JSON.stringify(Enseignant)).then((Response)=>{
                navigate("/admin/listensEignants")
            }).catch(Error=>{
                console.log(Error)
                })
            
        }else{
             Enseignant = {name,lastName,email,password,userRole,urlProfile,grade};
              EnseignantService.createEnseignant(JSON.stringify(Enseignant)).then((Response)=>{
              console.log(Response.data);
              navigate("/admin/listEnseignants")
              }).catch(Error=>{
              console.log(Error)
              })

        }
        
    }
    
    useEffect(() => {
        if(userId){
            setTitle("Update Enseignant")
            EnseignantService.getEnseignantbyid(userId).then((Response)=>{
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
        }
      
    }, [])
    

  return (
     
    <div className="forumContainer" >
        <h3 className="sectionTitle">{title}</h3>
        <div className="input-container">
            <label >First Name :</label>
            <input 
                type="text" className="input"
                placeholder="First Name"
                value={name} 
                onChange={(e)=>setName(e.target.value)}
            />
        </div>
        <div className="input-container">
            <label >Last Name :</label>
            <input 
                type="text" className="input" 
                placeholder="Last Name"
                value={lastName} 
                onChange={(e)=>setLastName(e.target.value)}
            />
        </div>
        <div className="input-container">
            <label >Email Address :</label>
            <input 
                type="text" className="input" 
                placeholder="Email Address"  
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
            />
        </div>
        
        <div className="input-container">
            <label >Grade :</label>
            <input 
                type="text"  className="input" 
                placeholder="grade"
                value={grade} 
                onChange={(e)=>setGrade(e.target.value)}
            />
        </div>
                    
        <div className="forumButtons">
            <button 
                className='forumButton'
                onClick={()=>saveOrUpdateEnseignant()}
            ><span>save</span></button>
            <button 
                className='forumButton'
                onClick={()=>{navigate("admin/listEnseignants")}}
            ><span>cancel</span></button>
        </div>
    </div>
  )
}

export default AddEnsienant;
/*<form>
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
                            <Link to="/admin/listEnseignants" className='btn btn-danger'>cancel</Link>
                        </form>*/