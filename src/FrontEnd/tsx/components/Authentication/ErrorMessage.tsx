import { Container, Typography } from "@mui/material";
import React from "react";

const ErrorMessage : React.FC<{msg:string}> = (prop)=>{
    return(
        <Container>
            <Typography variant="h4">Erreur:</Typography>
            <Typography>{prop.msg}</Typography>
        </Container>
    )
}

export default ErrorMessage;