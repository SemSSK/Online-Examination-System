import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../components/LoadingPage/LoadingPage";


const ProtectedPath : React.FC<{component : React.ReactElement}> = (props)=>{
    
    const [isLoading,setIsLoading] = useState(true);
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>();

    useEffect(()=>{
        axios.get("http://localhost:8080/authorization/loggedIn",{withCredentials:true})
        .then(res => {
            if(res.status == 200){
                console.log("Connected")
                setIsAuthenticated(true);
            }
            setIsLoading(false)
        })
        .catch(err => {
            setIsAuthenticated(false);
            setIsLoading(false);
        })
    },[]);

    return (
        <>
            {isLoading && <LoadingPage/>}
            {!isLoading && <>
                {isAuthenticated ? props.component : <Navigate to={"/login"}></Navigate>}
            </>}
        </>
    )
}

export default ProtectedPath;