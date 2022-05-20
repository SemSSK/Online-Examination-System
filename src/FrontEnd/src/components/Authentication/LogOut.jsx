import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
const LogOut = () => {
    const navigate = useNavigate();
    const url = "http://localhost:8080/logout";
    const logout = () => {
        axios.post(url, null, { withCredentials: true }).then(response => {
            if (response.status === 200) {
                navigate("/login");
            }
            else {
                throw response.data;
            }
        })
            .catch(e => {
            console.log(e);
        });
    };
    return (<Button startIcon={<LogoutIcon />} onClick={e => { logout(); }} variant="contained" color={"secondary"}>
                LogOut
            </Button>);
};
export default LogOut;
