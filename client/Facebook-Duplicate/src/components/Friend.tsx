import Navbar from "./Navigationbar"
import React from "react"
import { TokenType, UserType, RespType } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import FriendRequestContainer from "./FriendRequestContainer";

/**
 * Friend Component
 *  
 * @returns {JSX.Element} A React JSX element representing the Friend Component, the friends page on Fakebook
*/
export default function Friend(): JSX.Element {
    // Used for the routing
    const history = useNavigate();

    // Logged-on user State
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
        facebookid: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1",
        posts: [],
        outGoingFriendRequests: []
    });

    // Fetches the profile of the user
    async function fetchUser(token: string, id: string) {
        try{
            const res : RespType = await axios.get(`${config.apiURL}/user/${id}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if(res.data.message == "Success"){
                // Sets the data and also sets the token data since we are fetching the logged-on user's data
                const data : UserType = res.data.user;
                setUser(data);
                localStorage.setItem('token', JSON.stringify({token: token, user: data}));
            } else {
                // If error, re-directs to error page
                history('/error');
            }
        } catch (err){
            // If error, re-directs to error page
            history('/error');
        }
    }

    // Fetches user on mount, If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            void fetchUser(token.token, token.user._id);
        }
    }, [])

    // Effect that updates the local storage user object whenever a change is made to it
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(user._id != "" && token){
            localStorage.setItem('token', JSON.stringify({token: token.token, user: user}));
        }
    }, [user])

    return (
        <div className='homepage'>
            <Navbar user={user} home={'friends'}/>
            {/* Displays friend requests if the user has any incoming friend requests */}
            { user.friendRequests.length > 0 && user._id !== "" &&
                <div className='friend-requests'>
                    <h4>Friend Requests</h4>
                    <div className='friend-requests-list'>
                        {user.friendRequests.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'request'} user={user} setUser={setUser}/>)}
                    </div>
                </div>
            }
            {/* Displays list of friends */}
            {user._id !== "" && 
                <div className='friend-requests list'>
                    <h4>Friends</h4>
                    <div className='friend-requests-list'>
                        {user.friends.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'friend'} user={user} setUser={setUser}/>)}
                    </div>
                </div>
            }   

            {/* If user state hasn't loaded in yet from the API */}
            {user._id == "" && 
                <img src='/loading.gif' className='friends-loading'/>
            }
            
        </div>
    )
}