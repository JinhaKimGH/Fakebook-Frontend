import Navbar from "./Navigationbar"
import React from "react"
import { TokenType, UserType, RespType } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import FriendRequestContainer from "./FriendRequestContainer";

// This is the component for the Friends page, which displays all the different friends and friend requests of the user
export default function Friend() {
    // Used for the routing
    const history = useNavigate();

    // User State
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
        profilePhoto: "",
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

            if(res.data == null){
                history('/'); //TODO: Error Page
            } else {
                // Sets the data and also sets the token data since we are fetching the user's data
                const data : UserType = res.data.user;
                setUser(data);
                localStorage.setItem('token', JSON.stringify({token: token, user: data}));
            }
        } catch (err){
            console.log(err);
        }
    }

    // If there is no token saved, go to login automatically, called on mount
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
        if (!token) {
            history("/");
        } else if(user._id != ""){
            localStorage.setItem('token', JSON.stringify({token: token.token, user: user}));
        }
    }, [user])

    return (
        <div className='homepage'>
            <Navbar user={user} home={'friends'}/>

            { user.friendRequests.length > 0 &&
                <div className='friend-requests'>
                    <h4>Friend Requests</h4>
                    <div className='friend-requests-list'>
                        {user.friendRequests.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'request'} user={user} setUser={setUser}/>)}
                    </div>
                </div>
            }

            <div className='friend-requests list'>
                <h4>Friends</h4>
                <div className='friend-requests-list'>
                    {user.friends.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'friend'} user={user} setUser={setUser}/>)}
                </div>
            </div>
            
        </div>
    )
}