import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import React, { SyntheticEvent } from "react"
import {config} from "../config"

interface Response {
    data: Data
}

interface Data {
    message: string,
    token: string,
    user: object,
}

// Login form component
export default function Login(){
    // Used to navigate routes
    const history = useNavigate();

    // Sets the state for the email input
    const [email, setEmail] = React.useState("");

    // Sets the state for the password input
    const [password, setPassword] = React.useState("");

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    // Sets the state that determines whether the user is already logged in
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);

    // Helper function ensures that inputted email is a valid email
    function validateEmail(inputEmail: string){
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

        return emailRegex.test(inputEmail);
    }

    // If there is a token saved, go to home automatically
    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            history("/home");
        }
    }, [])

    // Asynchronous function which handles the login submission
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

        // If there are any errors with the form, a class is added to the form to indicate to the user, which inputs have errors

        // Otherwise, accesses the api and gets a response
        try{
            const res : Response = await axios.post(`${config.apiURL}/login`, { 
                email: email,
                password: password, 
            });

            const data : Data = res.data;
            
            if(data.message == "Success"){
                if (data.token){
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: data.token, user: data.user, time: Date.now() }));
                    setUserLoggedIn(true);
                    return history('/home');
                }
            } else if (data.message == "Incorrect email or password.") {
                setError("Incorrect email or password.");
            }

         } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="login">
            <div>
                <h1 className="fakebook-logo-login">fakebook</h1>
                <h3 className="login-subheading">Connect with friends and the world around you on Fakebook.</h3>
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