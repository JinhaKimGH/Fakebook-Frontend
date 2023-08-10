import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { config } from '../config';
import { loginRespType } from '../Interfaces';

/**
 * FacebookLoginButton Component
 *  
 * @param {Object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setLoggedIn - A function that updates the loggedIn state
 * @returns {JSX.Element} A React JSX element representing the FacebookLoginButton Component, a button allowing users to login with their real facebook accounts
*/
export default function FacebookLoginButton(props: { setLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element{
    async function fbLogin(response: loginRespType){
        if (response.accessToken){
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
        }
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleFbLogin = (response: loginRespType) => {
        void fbLogin(response);
    }

    return (
        <div>
            <FacebookLogin appId={`${config.facebookAppID}`} fields="name,email,birthday" scope="openid" callback={handleFbLogin} icon='fa-facebook'/>
        </div>
    )
}