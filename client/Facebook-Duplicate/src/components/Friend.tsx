import Navbar from "./Navigationbar"
import React from "react"
import { TokenType, UserType, RespType } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config";

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
                const data : UserType = res.data.user;
                setUser(data);
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

    return (
        <div className='homepage'>
            <Navbar user={user} home={'friends'}/>

            <div className='friend-requests'>
                <h4>Friend Requests</h4>
                
            </div>
            
        </div>
    )
}