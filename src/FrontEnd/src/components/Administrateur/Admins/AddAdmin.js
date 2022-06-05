import React,{useState} from 'react';
import '../AdminStyle/styleForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {

    const [newAdmin, setNewAdmin] = useState(null);
    const navigate = useNavigate();
   
     function saveNewAdmin() {
        console.log("new admin: ",newAdmin)
        const url = "http://localhost:8080/admin/save"

        axios.post(url, JSON.stringify(newAdmin), 
            {   withCredentials:true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(response => {
            console.log(response)
            navigate("admin/listAdmins")
        })
        .catch (err => {
            if(err.response){
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            }else{
                console.log(`Error: ${err.message}`);
            }
        })
    }

    return(
        <div className="forumContainer" >
                        
                    <h3 className="sectionTitle">Add Administrator</h3>
                    
                    <div className="input-container">
                        <label >First Name :</label>
                        <input 
                            type="text" className="input"
                            placeholder="First Name"
                            onChange={(e)=>setNewAdmin( admin => {
                                const newValue = {...admin}
                                newValue.name = e.target.value
                                return newValue;
                            })}
                        />
                    </div>
                    <div className="input-container">
                        <label >Last Name :</label>
                        <input 
                            type="text" className="input" 
                            placeholder="Last Name"
                            onChange={(e)=>setNewAdmin( admin => {
                                const newValue = {...admin}
                                newValue.lastName = e.target.value
                                return newValue;
                            })} 
                        />
                    </div>
                    <div className="input-container">
                        <label >Email Address :</label>
                        <input 
                            type="text" className="input" 
                            placeholder="Email Address"  
                            onChange={(e)=>setNewAdmin( admin => {
                                const newValue = {...admin}
                                newValue.email = e.target.value
                                return newValue;
                            })}
                        />
                    </div>
                    
                    <div className="input-container">
                        <label >Privilege :</label>
                        <input 
                            type="number" min="1" className="input" 
                            placeholder="privilege"
                            onChange={(e)=>setNewAdmin( admin => {
                                const newValue = {...admin}
                                newValue.privilege = e.target.value
                                return newValue;
                            })}
                        />
                    </div>
                    <div className="input-container">
                        <label >Profile Picture :</label>
                        <input 
                            type="file" 
                            placeholder="Profile Picture" 
                            className="input"   
                            onChange={(e)=>setNewAdmin( admin => {
                                const newValue = {...admin}
                                newValue.urlProfile = e.target.value
                                return newValue;
                            })}
                        />
                    </div>
                               
                    <div className="forumButtons">
                        <button 
                            className='forumButton'
                            onClick={()=> saveNewAdmin()}
                        ><span>save</span></button>
                        <button 
                            className='forumButton'
                            onClick={()=>{navigate("admin/listAdmins")}}
                        ><span>cancel</span></button>
                    </div>
                    
                </div>
    )
}
export default AddAdmin;