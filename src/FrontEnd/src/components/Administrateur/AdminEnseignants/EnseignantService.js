import axios from 'axios';
const ENSEIGNANT_API_BASE_URL1="http://localhost:8080/admin/enseignant";
const ENSEIGNANT_API_BASE_URL2="http://localhost:8080/admin/enseignant/save";
const ENSEIGNANT_API_BASE_URL3="http://localhost:8080/admin/enseignant/getEnseignant";
const ENSEIGNANT_API_BASE_URL4="http://localhost:8080/admin/enseignant/editEnseignant";
const ENSEIGNANT_API_BASE_URL5="http://localhost:8080/admin/enseignant/deleteEnseignant"
class EnseignantServive {

    getAllEnseignants(){
        return axios.get(ENSEIGNANT_API_BASE_URL1,{withCredentials:true})
    }

    createEnseignant(Enseignant){
        return axios.post(ENSEIGNANT_API_BASE_URL2,Enseignant,{withCredentials:true,
            headers: {
                'Content-Type': 'application/json'
            }})
    }
    getEnseignantbyid(userId){
        console.log(userId)
        return axios.get(ENSEIGNANT_API_BASE_URL3 +'/'+ userId,{withCredentials:true})
    }
    updateEnseignant(Enseignant){
        return axios.put(ENSEIGNANT_API_BASE_URL4,Enseignant,{withCredentials:true,
            headers: {
                'Content-Type': 'application/json'
            }})
    }
    deleteEnseignant(userId){
        return axios.delete(ENSEIGNANT_API_BASE_URL5+'/'+ userId,{withCredentials:true})
    }
}


export default new EnseignantServive();