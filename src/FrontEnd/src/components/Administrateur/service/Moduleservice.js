import axios from 'axios';
const Module_API_BASE_URL1="http://localhost:8080/admin/api/Module/getModulecontrole";
const Module_API_BASE_URL2="http://localhost:8080/admin/api/Module/save";
const Module_API_BASE_URL3="http://localhost:8080/admin/api/Module/getModulebyidcontrole";
const Module_API_BASE_URL4="http://localhost:8080/admin/api/Module/updateModulecontrole";
const Module_API_BASE_URL5="http://localhost:8080/admin/api/Module/deleteModule"
class Moduleservice {

    getAllModules(){
        return axios.get(Module_API_BASE_URL1,{withCredentials:true})
    }

    createModule(Module){
        return axios.post(Module_API_BASE_URL2,Module,{withCredentials:true})
    }
    getModulebyid(id){
        console.log(id)
        return axios.get(Module_API_BASE_URL3 +'/'+ id,{withCredentials:true})
    }
    updateModule(id,Module){
        return axios.put(Module_API_BASE_URL4+'/'+id,Module,{withCredentials:true})
    }
    deleteModule(id){
        return axios.delete(Module_API_BASE_URL5+'/'+ id,{withCredentials:true})
    }
}


export default new Moduleservice();