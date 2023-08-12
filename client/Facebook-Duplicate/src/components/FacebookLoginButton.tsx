import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { config } from '../config';
import { loginRespType } from '../Interfaces';
import { useNavigate } from 'react-router-dom';

/**
 * FacebookLoginButton Component
 *  
 * @param {Object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setLoggedIn - A function that updates the loggedIn state
 * @returns {JSX.Element} A React JSX element representing the FacebookLoginButton Component, a button allowing users to login with their real facebook accounts
*/
export default function FacebookLoginButton(props: { setLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element{
    // Used to navigate routes
    const history = useNavigate();

    // Async function that calls the facebook login procedure in the backend
    async function fbLogin(response: loginRespType){
        if (response.accessToken){
            try{
                const user : loginRespType = await axios.post(
                    `${config.apiURL}/facebookLogin`, 
                    {},
                    { 
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${response.accessToken}`
                        },
                    }
                );
    
                if (user){
                    localStorage.setItem('token', JSON.stringify({token: user.data.token, user: user.data.user, time: Date.now() }))
                    props.setLoggedIn(true);
                }
            } catch (err){
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleFbLogin = (response: loginRespType) => {
        void fbLogin(response);
    }

    return (
        <div>
            <FacebookLogin appId={`${config.facebookAppID}`} fields="name,email,birthday" scope="openid" cssClass="facebook-login" callback={handleFbLogin} icon='fa-facebook'/>
        </div>
    )
}