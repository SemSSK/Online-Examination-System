import React from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic-base64-upload';


const QuestionEditor : React.FC<{setData,data}> = (props)=>{
    return(
        <div className="Editor">
                <CKEditor
                    editor={ ClassicEditor }
                    data={props.data}
                    onReady={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        props.setData(data);
                    } 
                    }
                />
        </div>
    )
}   

export default QuestionEditor;