
import axios from 'axios';
const Etudiant_API_BASE_URL1="http://localhost:8080/admin/etudiant";
const Etudiant_API_BASE_URL2="http://localhost:8080/admin/etudiant/save";
const Etudiant_API_BASE_URL3="http://localhost:8080/admin/etudiant/getEtudiant";
const Etudiant_API_BASE_URL4="http://localhost:8080/admin/etudiant/editEtudiant";
const Etudiant_API_BASE_URL5="http://localhost:8080/admin/etudiant/deleteEtudiant";


class Etudiantservise {
    getAllEtudiants(){
        return axios.get(Etudiant_API_BASE_URL1,{withCredentials:true})
    }
    createEtudiant(Etudiant){
        return axios.post(Etudiant_API_BASE_URL2,Etudiant,{withCredentials:true})
    }
    getEtudiantbyid(userId){
        console.log(userId)
        return axios.get(Etudiant_API_BASE_URL3 +'/'+ userId,{withCredentials:true})
    }
    updateEtudiant(Etudiant){
        return axios.put(Etudiant_API_BASE_URL4,Etudiant,{withCredentials:true,
            headers: {
                'Content-Type': 'application/json'
            }})
    }
    deleteEtudiant(userId){
        return axios.delete(Etudiant_API_BASE_URL5+'/'+ userId,{withCredentials:true})
    }

}
export default new Etudiantservise();