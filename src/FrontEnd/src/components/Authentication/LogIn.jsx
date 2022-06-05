import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './loginStyle.css';

const LogIn = () => {

    const navigate = useNavigate();
    const[emailValue,setEmailValue] = useState("");
    const[passwordValue,setPasswordValue] = useState("");
    const[failedLoginClass,setFailedLoginClass] = useState("");
    const[successLoginClass,setSuccessLoginClass] = useState("");

    const loginUrl = "http://localhost:8080/login";

    const login = () => {
        console.log("logging...")
        const credentials = new FormData();
        credentials.append("username", emailValue);
        credentials.append("password", passwordValue);
        axios.post(loginUrl, credentials, { withCredentials: true }).then(response => {
            console.log(response)
            if (response.status === 200) {
                console.log("successfuly loggedIn");
                setSuccessLoginClass("success");
                setTimeout(()=>{
                    navigate("/activation");
                },500)

            }
            else {
                console.log("something else loggedIn");
                throw response.data;
            }
        }).catch(error => {
            console.log(error);
            setFailedLoginClass("failed red")
            setTimeout(() => {
                setFailedLoginClass("red")
            },500)

        });
    };
    
    return (
        <div className="loginContainer">
            <div className="content">
                <div className="loginTitle_container">
                    <h1 className="loginTitle"> Sign in</h1>
                    <div className="lockIcon_container">
                        <input id="inpLock" type="checkbox" checked={true} className={failedLoginClass +" "+ successLoginClass } disabled="disabled"/>
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

                <div
                    className="loginForm"
                >
                    <div className="field">
                        <input className="field--input" type="text" value={emailValue}
                               onChange={(e) => setEmailValue(e.target.value)}
                               required
                        />
                        <span className="fas fa-user"></span>
                        <label className="field--label">Email</label>
                    </div>
                    <div className="field">
                        <input className="field--input" type="password"
                               value={passwordValue}
                               onChange={(e) => setPasswordValue(e.target.value)}
                               required
                        />
                        <span className="fas fa-lock"></span>
                        <label className="field--label">Password</label>
                    </div>
                    {/* <div className="forgot-pass">
                        <a href="#">Forgot Password ?</a>
                    </div> */}
                    <button className="btn"
                        onClick={()=>login()}
                    >Sign in</button>
                    {/* <div className="sign-up"> Not a member ?
                        <a href="#"> SignUp now</a>
                    </div> */}
                </div>
            </div>
        </div>
    );
};
export default LogIn;
