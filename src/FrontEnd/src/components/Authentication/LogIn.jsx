import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Button, TextField, Grid, Card, CardHeader, CardContent, InputAdornment } from '@mui/material';
//Icons
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
;
const LogIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ message: "",
        activated: false });
    const [activation, setActivation] = useState(false);
    const loginUrl = "http://localhost:8080/login";
    const login = () => {
        setIsLoading(true);
        const credentials = new FormData();
        credentials.append("username", email);
        credentials.append("password", password);
        axios.post(loginUrl, credentials, { withCredentials: true }).then(response => {
            if (response.status === 200) {
                console.log("successfuly loggedIn");
                navigate("/activation");
                setIsLoading(false);
            }
            else {
                throw response.data;
            }
        }).catch(error => {
            setError({ message: "Mauvais email ou mot de pass", activated: true });
            console.log(error);
            setIsLoading(false);
        });
    };
    return (<Grid container alignItems={"center"} width={"100vw"} height={"100vh"}>
                <Grid item xs={4}></Grid>
                <Grid item xs={3}>
                    <Card variant="outlined" color="primary">
                        <CardHeader title="Authentification">
                        </CardHeader>
                        {error.activated &&
            <CardContent>  
                                <ErrorMessage msg={error.message}></ErrorMessage>
                            </CardContent>}
                        <CardContent>
                            <TextField label="email" variant="outlined" required fullWidth onChange={e => {
            setEmail(e.currentTarget.value);
        }} margin="normal" InputProps={{
            startAdornment: (<InputAdornment position="start">
                                            <EmailOutlinedIcon />  
                                        </InputAdornment>)
        }}/>
                        </CardContent>
                        <CardContent>
                            <TextField type="password" label="password" variant="outlined" required fullWidth onChange={e => {
            setPassword(e.currentTarget.value);
        }} InputProps={{
            startAdornment: (<InputAdornment position="start">
                                            <KeyOutlinedIcon />  
                                        </InputAdornment>)
        }}/>
                        </CardContent>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                                    {isLoading && <LoadingPage />}
                                    {!isLoading && <Button variant="contained" onClick={() => { login(); }} endIcon={<LoginOutlinedIcon />}>Valider</Button>}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>);
};
export default LogIn;
