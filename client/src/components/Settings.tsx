import React, { SyntheticEvent } from "react"
import {useNavigate} from 'react-router-dom'
import Navbar from "./Navigationbar"
import { UserType, TokenType, RespType } from "../Interfaces";
import axios from "axios";
import { config } from "../config";

/**
 * Settings Component
 *  
 * @returns {JSX.Element} A React JSX element representing the Settings Component, allows user to delete their account
*/
export default function Settings(): JSX.Element{
    // Used for the routing
    const history = useNavigate();
    
     // The user state, for the user that is currently logged in
     const [user, setUser] = React.useState<UserType>({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        birthday: "",
        accountCreationDate: "",
        password: "",
        bio: "",
        facebookId: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1",
        posts: [],
        outGoingFriendRequests: [],
        savedPosts: [],
    });

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            // If the token exists, sets the user, gets homepage posts and gets list of birthdays
            setUser(token.user);
        }
    }, [])

    // Asynchronous function that deletes the account of the user
    async function deleteAccount(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        
        if (token){
            try{
                const res : RespType = await axios.post(`${config.apiURL}/deleteuser/${token.user._id}`, 
                    {
                        user: token.user._id
                    },
                    {
                        headers: {
                            'Content-Type': "application/json",
                            Authorization: `Bearer ${token.token}`,
                        }
                    });

                if (res.data.message == 'Success'){
                    // Clears local storage and logs out
                    localStorage.clear();
                    history('/');
                } 
            } catch (err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleDeletionOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void deleteAccount();
    }

    return (
        <div className='homepage'>
            <Navbar user={user} home={'neither'}/>

            <div className='settings'>
                <div className='delete-user'>
                    <h4>Delete Account</h4>
                    <p>Would you like to delete your account?</p>
                    {user.email !== "guest@email.com" ? <div className='delete-user-button-container'>
                        <button className='delete-user-btn' onClick={handleDeletionOnClick}>Delete Your Account</button>
                    </div> :
                    <p>This feature is not available for a guest.</p>
                    }
                </div>
            </div>
        </div>
    )
}