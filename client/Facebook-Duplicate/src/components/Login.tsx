/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import React, { SyntheticEvent } from "react"
import {config} from "../config"

export default function Login(){
    const history = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    function validateEmail(inputEmail: string){
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

        return emailRegex.test(inputEmail);
    }
    async function getUser(){
        try{
            await axios.get(`${config.apiURL}/user`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(res => console.log(res))
            .catch(e => {console.log(e)})
        } catch (err) {
            console.log(err)
        }
    }
    async function submit(e : SyntheticEvent){
        e.preventDefault();
        document.getElementById("email")!.classList.remove("input-err")
        document.getElementById("password")!.classList.remove("input-err")
        if(!validateEmail(email)){
            setError("Please enter a valid email address.");
            document.getElementById("email")!.classList.add("input-err")
            return;
        }

        if(password == ""){
            setError("Please enter your password.");
            document.getElementById("password")!.classList.add("input-err")
            return; 
        }

        try{
            await axios.post(config.apiURL, { 
                username: email,
                password: password, 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(res=>{
                if(res.data == "Success"){
                    void getUser();
                    //history("/home");
                } else if (res.data == "Incorrect email or password.") {
                   setError("Incorrect email or password.");
                }
            })
            .catch(e => {
                console.log(e)
            })

         } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="login">
            <div>
                <img className="facebook-logo-login" src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"/>
                <h3 className="login-subheading">Connect with friends and the world around you on Facebook.</h3>
            </div>
            
            <div className="login-form-box">
                <form action="POST">
                    <input type="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" name="email" id="email" required/>
                    <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" name="password" id="password" required/>
                    <div className="form-error">{error}</div>
                    <button className="submit" onClick={submit}>Log In</button>
                </form>

                <div className="break"></div>

                <Link to="/signup" className="create-account">Create new account</Link>
            </div>

        </div>
    );
}