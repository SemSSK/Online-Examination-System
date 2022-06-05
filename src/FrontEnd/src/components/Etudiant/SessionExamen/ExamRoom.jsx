import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import  './examRoom.css';
import  {CKEditor}  from "@ckeditor/ckeditor5-react";
import ClassicEditor from 'ckeditor5-build-classic-base64-upload';
import LocalVideo from './LocalVideo'
import newStyle from "../../appStyling/newStyle.module.css";


const ExamRoom = ({socket, ...props}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [copy, setCopy] = useState({});
    const navigate = useNavigate();
    const [readyToJoin,setReadyToJoin] = useState(false);
    const [stream,setStream] = useState(null);

    const canAskForCopy = () => {
        return (props.presence.sessionExamen.state === "STARTED" && props.presence.state === "PRESENT");
    };
    const canPostCopy = () => {
        return !(props.presence.state === "PRESENT");
    };

    useEffect(()=>{
            getCopy();
    },[props.presence])

    const getCopy = () => {
        if(canAskForCopy()) {
            const url = `http://localhost:8080/etudiant/examen/${props.code}`;
            axios.post(url, {}, {withCredentials: true})
                .then(response => {
                    let examen = response.data;
                    const numberOfQuestions = examen.examenQuestions.length;
                    let copy = {
                        exam: examen,
                        reponses: new Array(numberOfQuestions)
                    };
                    for (let i = 0; i < numberOfQuestions; i++) {
                        copy.reponses[i] = {
                            content: '',
                            question: examen.examenQuestions[i].question,
                            points: examen.examenQuestions[i].points
                        };
                    }
                    setCopy(copy);
                    setIsLoading(true);
                });
        }
    };
    const postCopy = () => {
        if(canPostCopy()){
            const url = `http://localhost:8080/etudiant/examen/${props.code}/copie`;
            axios.post(url, JSON.stringify(copy), { withCredentials: true, headers: {
                    'Content-Type': 'application/json'
                } })
                .then(response => {
                console.log(response.data);
                socket.close();
                navigate("/etudiant");
            })
                .catch(err => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    }else{
                        console.log(`Error: ${err.message}`);
                    }
            })
        }
    };

    const editReponse = (newVal, reponse) => {
        const reponses = copy.reponses.slice();
        reponses[reponses.indexOf(reponse)].content = newVal;
        const newCopy = copy;
        newCopy.reponses = reponses;
        setCopy(newCopy);
        console.log(copy);
    };

     return (
         <>
             <div id="container" className="container">
                 <div className="header">
                     <div className="header_width">

                         <div className="logotext">
                             <span>Exam : </span>
                             Cyber Security
                         </div>

                         <div className="timing">
                             <div className='timeLeft'>01:30:00</div>
                             <div className="timeLoader"></div>
                         </div>
                         {
                             (props.presence.sessionExamen.state === "STARTED" && props.presence.state === "PRESENT") ?
                                 <div className="rendreCopie_btn">
                                     <button className="btn"
                                        onClick={()=>postCopy()}
                                     > Validate</button>
                                 </div>
                             :""
                         }
                     </div>
                 </div>
                 {
                     (props.presence.sessionExamen.state === "STARTED" && props.presence.state === "PRESENT") ?
                         <div className="content">
                             { isLoading ?
                                 copy.reponses.map((response,index) => {
                                    return (
                                     <div key={index}>
                                         <div className="page card_b page_width">
                                             <div id="post1"></div>
                                             <h1>Exercise {index + 1}<span>{response.points} points</span></h1>
                                             {parse(response.question.content)}
                                         </div>

                                         <div className="page card_b page_width">
                                             <div className="responseSpace"><h1>Response :</h1></div>
                                             <div className='CKEditor_container'>
                                                 <CKEditor
                                                     className="special__CKEditor"
                                                     editor={ClassicEditor}
                                                     data=""
                                                     config={{placeholder: "type your answer here...."}}

                                                     onReady={ editor => {
                                                         // You can store the "editor" and use when it is needed.
                                                         console.log( 'Editor is ready to use!', editor );
                                                     } }
                                                     onChange={ ( event, editor ) => {
                                                         const data = editor.getData();
                                                         editReponse(data, response);
                                                     } }
                                                     onBlur={ ( event, editor ) => {
                                                         console.log( 'Blur.', editor );
                                                     } }
                                                     onFocus={ ( event, editor ) => {
                                                         console.log( 'Focus...' );

                                                     } }
                                                 />
                                             </div>
                                         </div>
                                     </div>
                                    )
                                })
                                :  <div className={newStyle.loadingContainer}><div className={newStyle.loader}> <span>Loading...</span> </div></div>
                             }

                         </div>
                         :
                         <div className="waitingContainer" >
                             <div className="waitingCard">
                                 <div className="readyTitle">
                                     <h1>Waite for exam session to start !</h1>
                                 </div>
                                 <div className="spinner">
                                     <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none">
                                         <path stroke="#E91E63" strokeWidth="1.5" d="M9.743 10.25c3.213 1.96 5.017 4.676 7.248 4.676 2.588 0 2.791-4.8.518-5.668-3.107-1.187-5.178 3.719-8.284 5.03-1.415.677-3.41 1.014-4.09-1.14-.251-.797-.13-1.65.133-2.442v0c.425-1.278 2.132-1.66 3.35-1.081.304.144.668.346 1.125.625z" strokeDashoffset="100" strokeDasharray="100" className="path">
                                         </path>
                                     </svg>
                                 </div>
                             </div>
                         </div>
                 }
                 <div className="darkmode card-b fas fa-moon" ></div>
             </div>

             <div className="clip"></div>
             <div className="videoWrraper">
                <LocalVideo setMediaReady={setReadyToJoin} source={"camera"}  width={450} height={260} willCollapse={true}
                            stream={stream} setStream={setStream}
                />
            </div>


         </>
     );
};
export default ExamRoom;
