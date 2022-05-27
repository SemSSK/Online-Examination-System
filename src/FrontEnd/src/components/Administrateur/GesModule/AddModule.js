import React,{useState,useEffect} from 'react'
import {Link, useNavigate , useParams} from 'react-router-dom';
import Moduleservice from '../service/Moduleservice';

const AddModule = () => {

    const [ nomModule , setNomModule ] =useState('');
    const [ moduleAbrv , setModuleAbrv  ] =useState('');
    const [ coefficient , setCoefficient] =useState('');
    const [niveau  ,setNiveau ] =useState('');
    const [hasTDTP  ,setHasTDTP ] =useState('');
    
    const navigte = useNavigate();
    const {id}=useParams();
    console.log(useParams())

    const saveorUodateModule =(e) =>{
        e.preventDefault();
        let Module ;
         console.log(Module)
        if(id){
            Module ={id,nomModule,moduleAbrv,coefficient,niveau,hasTDTP};
            Moduleservice.updateModule(JSON.stringify(Module)).then((Response)=>{
                navigte("/admin/listmodule")
            }).catch(Error=>{
                console.log(Error)
                })
            
        }else{
            Module = {nomModule,moduleAbrv,coefficient,niveau,hasTDTP};
            Moduleservice.createModule(JSON.stringify(Module)).then((Response)=>{
              console.log(Response.data);
              navigte("/admin/listmodule")
              }).catch(error=>{
              console.log(error.message)
              })

        }
        
    }

    
        
    useEffect(() => {
        Moduleservice.getModulebyid(id).then((Response)=>{
            setNomModule(Response.data.nomModule)
            setCoefficient(Response.data.coefficient)
            setNiveau(Response.data.niveau)
            setHasTDTP(Response.data.hasTDTP)
            setModuleAbrv(Response.data.moduleAbrv)
          
        }).catch(Error=>{
            console.log(Error)
        })
      
    }, [])
    
    const title = () =>{
        if(id){
            return <h2 className="text-center">Update Module</h2>
        }else{
            return <h2 className="text-center">Add Module</h2>
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
                                <label className=" col-form-label"> Nom Module :</label>
                                
                                <input type="text" placeholder="Nom Module" name="nomModule" className="form-control" value={nomModule} onChange={(e)=>setNomModule(e.target.value)} ></input>
                                
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Module Abbreviation :</label>

                                <input type="text"  placeholder="Abbreviation" name="moduleAbrv" className="form-control" value={moduleAbrv} onChange={(e)=>setModuleAbrv(e.target.value)} ></input>
                            </div>
                            <div className="form-group row">
                                <label className=" col-form-label"> Coefficient :</label>
                                
                                <input type="number" min="1" placeholder="Coefficient" name="coefficient" className="form-control" value={coefficient} onChange={(e)=>setCoefficient(e.target.value)} ></input>
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
                            <label className=" col-form-label" >HasTDTP :</label>

                                     <select  placeholder="HasTDTP" name="hasTDTP" className="form-control" onChange={(e)=>setHasTDTP(e.target.value)} >
                                        <option value="false" >non</option>
                                        <option value="true" >oui</option>
                                     </select>

        
                                
                            </div>
                            
                           
                            <button type="button" className="btn btn-success" onClick={(e)=>saveorUodateModule(e)}   >Success</button>
                            <Link to="/admin/listmodule" className='btn btn-danger'>cancel</Link>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}

export default AddModule