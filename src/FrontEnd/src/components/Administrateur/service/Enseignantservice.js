import axios from 'axios';
const ENSEIGNANT_API_BASE_URL1="http://localhost:8080/admin/api/Enseignant/getEnseignant";
const ENSEIGNANT_API_BASE_URL2="http://localhost:8080/admin/api/Enseignant/save";
const ENSEIGNANT_API_BASE_URL3="http://localhost:8080/admin/api/Enseignant/getEnseignantbyidcontrole";
const ENSEIGNANT_API_BASE_URL4="http://localhost:8080/admin/api/Enseignant/updateEnseignantcontrole";
const ENSEIGNANT_API_BASE_URL5="http://localhost:8080/admin/api/Enseignant/deleteEnseignant"
class EnseignantServive {

    getAllEnseignants(){
        return axios.get(ENSEIGNANT_API_BASE_URL1,{withCredentials:true})
    }

    createEnseignant(Enseignant){
        return axios.post(ENSEIGNANT_API_BASE_URL2,Enseignant,{withCredentials:true})
    }
    getEnseignantbyid(userId){
        console.log(userId)
        return axios.get(ENSEIGNANT_API_BASE_URL3 +'/'+ userId,{withCredentials:true})
    }
    updateEnseignant(userId,Enseignant){
        return axios.put(ENSEIGNANT_API_BASE_URL4+'/'+ userId,Enseignant,{withCredentials:true})
    }
    deleteEnseignant(userId){
        return axios.delete(ENSEIGNANT_API_BASE_URL5+'/'+ userId,{withCredentials:true})
    }
}


export default new EnseignantServive();