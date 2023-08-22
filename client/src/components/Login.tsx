import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import React, { SyntheticEvent } from "react"
import {config} from "../config"
import { RespType } from "../Interfaces";
import FacebookLoginButton from "./FacebookLoginButton";

/**
 * Login Component
 *  
 * @returns {JSX.Element} A React JSX element representing the Login Component, logs the user into the app
*/
export default function Login(): JSX.Element{
    // Used to navigate routes
    const history = useNavigate();

    // State to determine whether sign in is loading
    const [loading, setLoading] = React.useState(false);

    // Sets the state for the email input
    const [email, setEmail] = React.useState("");

    // Sets the state for the password input
    const [password, setPassword] = React.useState("");

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    // State determines whether the user is logged in
    const [loggedIn, setLoggedIn] = React.useState(false);

    // Helper function ensures that inputted email is a valid email
    function validateEmail(inputEmail: string){
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');

        return emailRegex.test(inputEmail);
    }

    // If there is a token saved, go to home automatically, happens onMount and when the loggedIn state changes
    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            history("/home");
        }
    }, [loggedIn])

    // Asynchronous function which handles the login submission
    async function submit(){
        if(loading){
            return;
        }
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
            // Sets loading to true before the api call
            setLoading(true);
            const res : RespType = await axios.post(`${config.apiURL}/login`, { 
                email: email,
                password: password, 
            });

            const data = res.data;
            
            if(data.message == "Success"){
                if (data.token){
                    // Sets loading state to false after the api call
                    setLoading(false);
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: data.token, user: data.user, time: Date.now() }));
                    return history('/home');
                }
            } else if (data.message == "Incorrect email or password.") {
                // Sets loading state to false after the api call
                setLoading(false);
                // Sets the form error
                setError("Incorrect email or password.");
            }

         } catch(err) {
            // Sets loading state to false after the api call
            setLoading(false);
            // If error, re-directs to error page
            history('/error');
        }
    }

    // A login function for a guest user
    async function guestLogin(){
        if(loading){
            return;
        }
        try{
            // Sets loading state to true before the api call
            setLoading(true);
            const res : RespType = await axios.post(`${config.apiURL}/login`, { 
                email: 'guest@email.com',
                password: 'password', 
            });

            const data = res.data;
            
            if(data.message == "Success"){
                if (data.token){
                    // Sets loading state to false after the api call
                    setLoading(false);
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: data.token, user: data.user, time: Date.now() }));
                    return history('/home');
                }
            } else if (data.message == "Incorrect email or password.") {
                // Sets loading state to false after the api call
                setLoading(false);
                // Sets the form error
                setError("Incorrect email or password.");
            }
        } catch(err){
            // Sets loading state to false after the api call
            setLoading(false);
            // If error, re-directs to error page
            history('/error');
        }
    }
    
    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSubmitOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void submit();
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleGuestSubmitOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void guestLogin();
    }

    return (
        <div className="login">
            <div>
                <h1 className="fakebook-logo-login">fakebook</h1>
                <h3 className="login-subheading">Connect with friends and the world around you on Fakebook.</h3>
            </div>
            {/* Login form */}
            <div className="login-form-box">
                <form action="POST">
                    <input type="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" name="email" id="email" required/>
                    <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" name="password" id="password" required/>
                    <div className="form-error">{error}</div>
                    {loading ? <button className='login-submit-disabled' onClick={handleSubmitOnClick}><img src='loading.gif' className='about-property-loading'/></button> : <button className="submit" onClick={handleSubmitOnClick}>Login</button>}
                    <div className='login-buttons'>
                        {loading ? <button className='facebook-login-disabled' onClick={handleGuestSubmitOnClick}><img src='loading.gif' className='about-property-loading'/></button>: <button className='facebook-login' onClick={handleGuestSubmitOnClick}>Login as a Guest</button>}
                        <FacebookLoginButton setLoggedIn={setLoggedIn}/>
                    </div>
                </form>

                <div className="break"></div>
                {/* Link to create a new account, the sign-up page */}
                <Link to="/signup" className="create-account">Create new account</Link>
            </div>

        </div>
    );
}