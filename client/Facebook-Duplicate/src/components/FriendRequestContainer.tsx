import React, {SyntheticEvent} from "react"
import { UserType, RespType, TokenType } from "../Interfaces"
import { config } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Container for the friend requests/friend container
export default function FriendRequestContainer(props: {id: string, req: string, user: UserType, setUser: React.Dispatch<React.SetStateAction<any>>}) {
    // Used for the routing
    const history = useNavigate();

    // State for the user
    const [friend, setFriend] = React.useState<UserType>({
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
                setFriend(data);
            }
        } catch (err){
            console.log(err);
        }
    }

    // Calculates the number of mutual friends between users
    function getMutualFriends(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            const intersection = friend.friends.filter(x => props.user.friends.includes(x));
    
            return intersection.length;
        } else {
            return 0
        }
    }

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            void fetchUser(token.token, props.id);
        }
    }, [])

    // Async Function that accepts a friend request
    async function acceptRequest(e: SyntheticEvent){
        e.preventDefault();
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token) {
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/accept_req`, 
                    {
                        user_id: token.user._id,
                        friend_id: props.id,
                    },
                    {
                        headers: headers
                    });
                if(res.data.message == 'Success'){
                    // Sets the user state with the new accepted friend id
                    props.setUser({...props.user, 'friends': [...props.user.friends, props.id], 'friendRequests': props.user.friendRequests.filter(item => item !== props.id)});
                    
                } else{
                    console.log(res.data.message);
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    // Async Function that denies a friend request
    async function denyRequest(e: SyntheticEvent){
        e.preventDefault();

        // Retrieves token from localStorage, ensures user is logged in
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token) {
            try{
                // Authorization headers for backend call
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/deny_req`, 
                    {
                        user_id: token.user._id,
                        friend_id: props.id,
                    },
                    {
                        headers: headers
                    });
                if(res.data.message == 'Success'){
                    // Deletes the declined user from the friendRequests array, therefore, state is changed and user is updated
                    props.setUser({...props.user, 'friendRequests': props.user.friendRequests.filter(item => item !== props.id)});
                    
                } else{
                    console.log(res.data.message);
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    // View Profile Redirect
    function redirect(e: SyntheticEvent){
        e.preventDefault();
        history(`/user/${props.id}`)
    }

    return (
        <div className='friend-container'>
            <img src={friend.profilePhoto} onClick={redirect}/>
            <h4 onClick={redirect}>{`${friend.firstName} ${friend.lastName}`}</h4>
            <h5>{`${getMutualFriends()} mutual friends`}</h5>
            {props.req == 'request' &&
            <div className='friend-button-container'>
                    <button className="friend-request-container" onClick={acceptRequest}>Confirm</button>
                    <button className="deny-friend-container" onClick={denyRequest}>Delete</button>
            </div>
            }
            {props.req == 'friend' &&
            <div className='friend-button-container'>
                    <button className="deny-friend-container" onClick={redirect}>View Profile</button>
            </div>
            }

        </div>
    )
}