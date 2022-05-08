import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
const Module = (props) => {
    const [affectationList, setAffectationList] = useState(props.affectationList);
    const changeModule = (module) => {
        props.setCurrentModule(module);
    };
    return (<FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Module</InputLabel>
            <Select variant="standard" id="module" defaultValue={props.currentModule} label="Module" onChange={e => { changeModule(e.target.value); }}>
                {affectationList.map(affectation => {
            return <MenuItem value={affectation} key={affectation.module.id}>{affectation.module.nomModule}</MenuItem>;
        })}
            </Select>
        </FormControl>);
};
export default Module;
