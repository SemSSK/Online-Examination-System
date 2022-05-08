import { CardContent, Typography } from "@mui/material";
import parse from "html-react-parser";
import React, { useEffect } from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic-base64-upload';
import QuestionCreator from "../Enseignant/Questions/QuestionCreator/QuestionCreator";


const Reponse : React.FC<{reponse,editReponse}> = (props)=>{

   

    return(
        <CardContent>
            <Typography>
                Enoncé:
                <div>
                    {parse(props.reponse.question.content)}
                </div>
            </Typography>
            <Typography>
                Votre réponse:
                <div className="Editor">
                <CKEditor
                    editor={ ClassicEditor }
                    onReady={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    }
                    }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        props.editReponse(data,props.reponse)
                    }}
                />
                </div>
            </Typography>
        </CardContent>
    )

}

export default Reponse;