
import axios from 'axios';
const Etudiant_API_BASE_URL1="http://localhost:8080/admin/students";
const Etudiant_API_BASE_URL2="http://localhost:8080/admin/students/save";
const Etudiant_API_BASE_URL3="http://localhost:8080/admin/students/getEtudiantbyidcontrole";
const Etudiant_API_BASE_URL4="http://localhost:8080/admin/students/updateEtudiantcontrole";
const Etudiant_API_BASE_URL5="http://localhost:8080/admin/students/deleteEtudiant";


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
    updateEtudiant(userId,Etudiant){
        return axios.put(Etudiant_API_BASE_URL4+'/'+ userId,Etudiant,{withCredentials:true})
    }
    deleteEtudiant(userId){
        return axios.delete(Etudiant_API_BASE_URL5+'/'+ userId,{withCredentials:true})
    }

}
export default new Etudiantservise();