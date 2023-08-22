import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React, { SyntheticEvent } from "react";
import {config} from "../config"
import { RespType } from "../Interfaces";
import loadingGif from '../loading.gif'

/**
 * SignUp Component
 *  
 * @returns {JSX.Element} A React JSX element representing the SignUp Component, the sign up form
*/
export default function SignUp(): JSX.Element{

    // Used to navigate routes
    const history = useNavigate(); 

    // State to determine whether sign in is loading
    const [loading, setLoading] = React.useState(false);

    // First name state for sign-up form
    const [firstName, setFirstName] = React.useState("");

    // Last name state for sign-up form
    const [lastName, setLastName] = React.useState("");

    // Email state for sign-up form
    const [email, setEmail] = React.useState("");

    // Password state for sign-up form
    const [password, setPassword] = React.useState("");

    // Gender state for sign-up form
    const [gender, setGender] = React.useState("");

    // Birthday state for sign-up form
    const [birthday, setBirthDate] = React.useState(new Date());

    // Error state for sign-up form
    const [error, setError] = React.useState("");

    // If there is a token saved, go to dashboard automatically
    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            history("/home");
        }
    }, [])

    // Helper function calculates the current age of the user, based on the birthday state
    function calculateAge(dob: Date) {
        const difference = Date.now() - dob.getTime();
        const age_dt = new Date(difference);
        
        return age_dt.getUTCFullYear() - 1970;
    }

    // Helper function ensures that inputted email is a valid email
    function validateEmail(inputEmail: string){
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

        return emailRegex.test(inputEmail);
    }

    // Removes the error class from all elements
    function resetClassError(){
        document.getElementById("firstName")!.classList.remove("input-err")
        document.getElementById("lastName")!.classList.remove("input-err")
        document.getElementById("email")!.classList.remove("input-err")
        document.getElementById("password")!.classList.remove("input-err")
        document.getElementById("date")!.classList.remove("input-err")
        document.getElementById("gender")!.classList.remove("input-err")
    }

    // Asynchronous function for submitting the sign up form
    async function submit(){
        if(loading){
            return;
        }

        resetClassError();

        // Sanity check for all fields, adds 'input-err' class to the input if there is an error
        if(firstName == ""){
            setError("Please enter your first name.");
            document.getElementById("firstName")!.classList.add("input-err")
            return;
        }

        if(lastName == ""){
            setError("Please enter your last name.");
            document.getElementById("lastName")!.classList.add("input-err")
            return;
        }

        if(!validateEmail(email)){
            setError("Please enter a valid email address.");
            document.getElementById("email")!.classList.add("input-err")
            return;
        }

        if(password == ""){
            setError("Please enter a password.");
            document.getElementById("password")!.classList.add("input-err")
            return; 
        }

        // Ensures age of the user is over 13
        if(calculateAge(birthday) < 13){
            setError("You must be older than 13 to sign up to Fakebook.");
            document.getElementById("date")!.classList.add("input-err")
            return;
        }

        if(gender == ""){
            setError("Please enter your gender.");
            document.getElementById("gender")!.classList.add("input-err")
            return;
        }

        // Accesses the API to create a new user or reject is if the email is in use
        try{
            // Sets loading to true before the api call
            setLoading(true);
            const res: RespType = await axios.post(
                `${config.apiURL}/signup`, 
                {
                    firstName, lastName, email, password, gender, birthday
                }
            );
            
            // Redirects to login page if sign up successful
            if(res.data.message == 'Success'){
                // Sets loading state to false after the api call
                setLoading(false);
                history('/');
            } else if (res.data.message == "Failure"){
                // Sets loading state to false after the api call
                setLoading(false);
                // Sets error state if email is in use
                setError("Email is already associated with an account.");
            }

         } catch(err) {
            // Sets loading state to false after the api call
            setLoading(false);
            // If error, re-directs to error page
            history('/error');
        }
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSubmitOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void submit();
    }

    return (
        <div className="signup">
            <div className="login-left-heading">
                <h1 className="fakebook-logo-login">fakebook</h1>                
                <h3 className="signup-subheading">Connect with friends and the world around you on Fakebook.</h3>
            </div>
            {/* Sign Up form with states for all inputs */}
            <div className="signup-form-box">
                <div className="signup-heading">
                    <div className="left">
                        <h1>Sign Up</h1>
                        <h3>It’s quick and easy.</h3>
                    </div>
                    <Link to="/" className="x-signup">✕</Link>
                </div>
                <div className="signup-break"></div>

                <form action="POST" className='sign-up-form'>
                    <input type="text" onChange={(e) => {setFirstName(e.target.value)}} placeholder="First Name" name="firstName" id="firstName" required/>
                    <input type="text" onChange={(e) => {setLastName(e.target.value)}} placeholder="Last Name" name="lastName" id="lastName" required/>    
                    <input type="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" name="email" id="email" required/>
                    <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="New Password" name="password" id="password" required/>
                    <label htmlFor="date" className="sign-up-label">Birthday</label>
                    <input type="date" onChange={(e) => {setBirthDate(new Date(e.target.value))}} id="date" required/>
                    <input type="text" onChange={(e) => {setGender(e.target.value)}} id="gender" placeholder="Gender" required/>
                    <div className="form-error">{error}</div>
                    {loading ? <button className='login-submit-disabled' onClick={handleSubmitOnClick}><img src={loadingGif} className='about-property-loading'/></button> : <button className="submit" onClick={handleSubmitOnClick}>Sign Up</button>}
                </form>
            </div>
        </div>
    );
}