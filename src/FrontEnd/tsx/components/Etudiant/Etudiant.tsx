import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {Routes,Route, useNavigate} from 'react-router-dom';
import PassExam from "./PassExam";

const Etudiant = ()=>{
    return(
        <Box width="100%" height="100%"> 
        <Typography>
            Hello Etudiant
        </Typography>
        </Box>
    );
}

export default Etudiant;