import React from "react";
import OtpInput from "react-otp-input";
import '../../Authentication/loginStyle.css';

const JoinExamRoom = (props) => {


    const joinSession = () => {
        props.setInSession(true);
        props.socket.send(JSON.stringify({
            type:"code",
            payload:props.code
        }));
    };
    
    return (
        <div className="loginContainer">
            <div className="content">
                <div className="loginTitle_container">
                    <h1 className="loginTitle"> Exam Code</h1>
                </div>
                <div className="prompt">
                    Enter the Exam Code 
                </div>
                <OtpInput
                    containerStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        width: "100%"
                    }}
                    inputStyle={{
                        height: "60px",
                        width: "100%",
                        outline: "none",
                        border: "none",
                        fontSize: "20px",
                        background: "rgb(232, 240, 254)",
                        color: "#595959",
                        borderRadius: "25px",
                        boxShadow: "inset 2px 2px 5px #babecc, inset -5px -5px 10px #ffffff73",

                    }}
                    value={props.code}
                    onChange={(code) => props.setCode(code)}
                    numInputs={6}
                    separator={<span style={{margin: "3px"}}></span>}
                />
                <button className="btn"
                    onClick={()=>joinSession()}
                >Confirm</button>
            </div>
        </div>
    );
};
export default JoinExamRoom;
