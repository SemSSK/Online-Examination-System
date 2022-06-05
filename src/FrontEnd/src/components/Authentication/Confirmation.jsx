import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import './loginStyle.css';

const Confirmation = () => {
    const [errorMsg, setError] = useState({ message: "",
        activated: false, leftTrails: 2 });
    const [activationCode, setActivationCode] = useState("");
    const activationUrl = "http://localhost:8080/authorization/activate";
    const[failedLoginClass,setFailedLoginClass] = useState("");
    const[successLoginClass,setSuccessLoginClass] = useState("");
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
                setSuccessLoginClass("success");
                setTimeout(()=>{
                    navigate("/" + response.data.toLowerCase() + "/schedual");
                },500)

            }
        }).catch(error => {
            const testsLeft = errorMsg.leftTrails;
            setFailedLoginClass("failed red")

            setTimeout(() => {
                setFailedLoginClass("red")
                if (testsLeft > 0) {
                    setError({ message: "Mauvais code Réessayé", activated: true, leftTrails: (testsLeft - 1) });
                }
                else {
                    setFailedLoginClass("")
                    navigate("/login");
                }
            },500)


            console.log("hello");
        });
    };

    return (
        <div className="loginContainer">
            <div className="content">
                {/*<div className="alert">*/}
                {/*    <h4>Payment failure</h4>*/}
                {/*    <div className="alert_text">Please correct the information below and try again.</div>*/}
                {/*</div>*/}
                <div className="loginTitle_container">

                    <h1 className="loginTitle"> Verification Code</h1>
                    <div className="lockIcon_container">
                        <input id="inpLock" type="checkbox" checked={true}  className={failedLoginClass +" "+ successLoginClass }  disabled="disabled"/>
                        <label className="btn-lock" htmlFor="inpLock">
                            <svg width="25" height="35" viewBox="0 0 36 40">
                                <path className="lockb"
                                      d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"></path>
                                <path className="lock"
                                      d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
                                <path className="bling" d="M29 20L31 22"></path>
                                <path className="bling" d="M31.5 15H34.5"></path>
                                <path className="bling" d="M29 10L31 8"></path>
                            </svg>
                        </label>
                    </div>
                </div>
                <div className="prompt">
                    Enter the code Sent to your email account to log in!
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
                    value={activationCode}
                    onChange={(activationCode) => setActivationCode(activationCode)}
                    numInputs={6}
                    separator={<span style={{margin: "3px"}}></span>}
                />
                <button className="btn"
                    onClick={()=>confirm()}
                >Confirm</button>
            </div>
        </div>
    );
};
export default Confirmation;
