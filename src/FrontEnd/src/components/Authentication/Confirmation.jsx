import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardHeader, CardContent, TextField, Typography, InputAdornment, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
;
const Confirmation = () => {
    const [errorMsg, setError] = useState({ message: "",
        activated: false, leftTrails: 2 });
    const [activationCode, setActivationCode] = useState("");
    const activationUrl = "http://localhost:8080/authorization/activate";
    const navigate = useNavigate();

    const confirm = () => {
        const content = {
            code: activationCode
        };
        axios
            .post(activationUrl, JSON.stringify(content), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(response => {
            if (response.status == 200) {
                console.log("login confirmed");
                navigate("/" + response.data.toLowerCase() + "/schedual");
            }
            else {
                throw "error";
            }
        }).catch(error => {
            const testsLeft = errorMsg.leftTrails;
            if (testsLeft > 0) {
                setError({ message: "Mauvais code Réessayé", activated: true, leftTrails: (testsLeft - 1) });
            }
            else {
                navigate("/login");
            }
            console.log("hello");
        });
    };

    return (<Grid container alignItems={"center"} width={"100vw"} height={"100vh"}>
            <Grid item xs={4}></Grid>
            <Grid item xs={3}>
                <Card variant="outlined">
                    <CardHeader title="Confirmer Authentification"></CardHeader>
                    <CardContent>
                        <Typography variant="h6">Essaye restant : {errorMsg.leftTrails}</Typography>
                    </CardContent>
                    <CardContent>
                        <TextField label="Code de confirmation" variant="outlined" required fullWidth InputProps={{
            startAdornment: (<InputAdornment position="start">
                                        <LockIcon />  
                                    </InputAdornment>)
        }} onChange={e => {
            setActivationCode(e.currentTarget.value);
        }}>
                        </TextField>
                    </CardContent>
                    <CardContent>
                        <Grid container>
                            <Grid xs={12} display={"flex"} justifyContent={"center"}>
                                <Button variant="contained" onClick={e => {
            confirm();
        }}>
                                    Confirmer
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}></Grid>
            
        </Grid>);
};
export default Confirmation;
