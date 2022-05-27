import React,{useState,useEffect} from 'react'
import {Link, useNavigate , useParams} from 'react-router-dom';
import Etudiantservise from '../service/Etudiantservise';

const AddEtudiant = () => {

    const [ name , setName ] =useState('');
    const [ lastName , setLastName] =useState('');
    const [email  ,setEmail ] =useState('');
    const [password  ,setPassword ] =useState('');
    const [ userRole,setUserRole ] =useState('');
    const [urlProfile  ,setUrlProfile ] =useState('');
    const [niveau  ,setNiveau ] =useState('');
    const [section  ,setSection ] =useState('');
    const [groupe  ,setGroupe ] =useState('');

   
    const navigte = useNavigate();
    const {userId}=useParams();
    console.log(useParams())
    

    const saveorUodateEtudiant =(e) =>{
        e.preventDefault();
        let Etudiant;
         console.log(Etudiant)
        if(userId){
            Etudiant  ={userId,name,lastName,email,password,userRole,urlProfile,niveau,section,groupe};
            Etudiantservise.updateEtudiant(Etudiant).then((Response)=>{
                navigte("/admin/listetudiant")
            }).catch(Error=>{
                console.log(Error)
                })
            
        }else{
            Etudiant  ={name,lastName,email,password,userRole,urlProfile,niveau,section,groupe};
            Etudiantservise.createEtudiant(Etudiant).then((Response)=>{
              console.log(Response.data);
              navigte("/admin/listetudiant")
              }).catch(Error=>{
              console.log(Error)
              })

        }
        
    }

    useEffect(() => {
        Etudiantservise.getEtudiantbyid(userId).then((Response)=>{
            setName(Response.data.name)
            setLastName(Response.data.lastName)
            setEmail(Response.data.email)
            setPassword(Response.data.password)
            setUserRole(Response.data.userRole)
            setUrlProfile(Response.data.urlProfile)
            setNiveau(Response.data.niveau)
            setSection(Response.data.section)
            setGroupe(Response.data.groupe)
           
        }).catch(Error=>{
            console.log(Error)
        })
      
    }, [])
    

    const title = () =>{
        if(userId){
            return <h2 className="text-center">Update Etudiant</h2>
        }else{
            return <h2 className="text-center">Add Etudiant</h2>
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
                                
                                <input type="email"  placeholder="Email" name="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} ></input>
                                
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
                                
                                <input type="file" placeholder="Url Profile" name="urlProfile" className="form-control" value={urlProfile} onChange={(e)=>setUrlProfile(e.target.value)} ></input>
                                
                            </div>
                          
                            <div className="form-group row">
                                <label className="col-form-label"> Niveau :</label>
                                <select  type="text" placeholder="Niveau" name="niveau" className="form-control" onChange={(e)=>setNiveau(e.target.value)}  >
                                        <option value="premier annèe licence" onChange={(e)=>setNiveau(e.target.value)}>premier annèe licence</option>
                                        <option value="deuxime annèe licence" >deuxime annèe licence</option>
                                        <option value="L3_GL" >L3_GL </option>
                                        <option value="troisime annèe licence ti" >troisime annèe licence ti</option>
                                        <option value="troisime annèe licence sci" >troisime annèe licence sci</option>
                                        <option value="troisime annèe licence si" >troisime annèe licence si</option>
                                        <option value="master1  gl" >master1  gl </option>
                                        <option value="master1  ti" >master1  ti</option>
                                        <option value="master1  sci" >master1  sci</option>
                                        <option value="master1  si" >master1  si</option>
                                        <option value="master2  gl" >master2  gl </option>
                                        <option value="master2  ti" >master2  ti</option>
                                        <option value="master2  sci" >master2  sci</option>
                                        <option value="master2  si" >master2  si</option>
                                        
                                     </select>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Section :</label>
                                
                                <input type="number" min="1" placeholder="Section" name="section" className="form-control" value={section} onChange={(e)=>setSection(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Groupe :</label>
                                
                                <input type="number" min="1" placeholder="Groupe" name="groupe" className="form-control" value={groupe} onChange={(e)=>setGroupe(e.target.value)} ></input>
                                
                            </div>
                            <button type="button" className="btn btn-success" onClick={(e)=>saveorUodateEtudiant(e)}  >Success</button>
                            <Link to="/admin/listetudiant" className='btn btn-danger'>cancel</Link>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}

export default AddEtudiant