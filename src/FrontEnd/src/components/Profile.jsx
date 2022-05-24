import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import newStyle from "./appStyling/newStyle.module.css";
import avatar from "./appStyling/avatar.png";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
const Profile = () => {
    const [utilisateur,setUtilisateur] = useState();
    const [isLoaded,setIsLoaded] = useState(false)

    useEffect(()=>{
        const url = "http://localhost:8080/authorization/userData"
        axios.get(url,{withCredentials:true})
        .then(response => {
            if(response.status === 200){
                setUtilisateur(response.data);
                setIsLoaded(true);
            }
        })
    },[])

    return (
        <li className={newStyle.nav_item}>
            { isLoaded && <>
                <div className={newStyle.logo}>
                    <img src={avatar} alt="profile logo"/>
                </div>
                <div className={newStyle.profileUsername}>
                <a href="#" className={newStyle.nav_link}>
                    {utilisateur.lastName +' '+ utilisateur.name}
                </a>
                </div>
                <div className={newStyle.userProfile}>
                <IconButton size='medium' color="inherit">
                <ArrowDropDownCircleIcon fontSize='medium'/>
                </IconButton>
                </div>
            </>}
        </li>
        );
};
export default Profile;
