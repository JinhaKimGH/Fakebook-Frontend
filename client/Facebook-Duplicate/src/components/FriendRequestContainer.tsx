import React, {SyntheticEvent} from "react"
import { UserType, RespType, TokenType } from "../Interfaces"
import { config } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * FriendRequestContainer Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.id - The id of the friend/requester that is being displayed
 * @param {string} req - The request type, friend request or just friend
 * @param {UserType} props.user - The user object containing the user information of the profile you are on
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setUser - A function that updates the user state
 * @returns {JSX.Element} A React JSX element representing the FriendRequestContainer Component, a container for the friend requests/friend container
*/
export default function FriendRequestContainer(props: {id: string, req: string, user: UserType, setUser: React.Dispatch<React.SetStateAction<UserType>>}): JSX.Element {
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

            if(res.data.message == 'Success'){
                const data : UserType = res.data.user;
                setFriend(data);
            } else {
                // If error, re-directs to error page
                history('/error');
            }
        } catch (err){
            // If error, re-directs to error page
            history('/error');
        }
    }

    // Calculates the number of mutual friends between users
    function getMutualFriends(){
        // Retrieve the token from local storage
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            const intersection = friend.friends.filter(x => props.user.friends.includes(x));
    
            return intersection.length;
        } else {
            return 0
        }
    }

    // If there is no token saved, go to login automatically, fetches the friend/user on mount
    React.useEffect(() => {
        // Retrieve the token from local storage
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            void fetchUser(token.token, props.id);
        }
    }, [])

    // Async Function that accepts a friend request
    async function acceptRequest(){
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
                    // If error, re-directs to error page
                    history('/error');
                }
            } catch(err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Async Function that denies a friend request
    async function denyRequest(){

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
                    // If error, re-directs to error page
                    history('/error');
                }
            } catch(err) {
               // If error, re-directs to error page
               history('/error');
            }
        }
    }

    // View Profile Redirect - redirects to profile when clicked
    function redirect(e: SyntheticEvent){
        e.preventDefault();
        history(`/user/${props.id}`)
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleAcceptRequestOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void acceptRequest();
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleDenyRequestOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void denyRequest();
    }

    return (
        <div className='friend-container'>
            {/* Redirects to friend profile when photo, name, or view profile is clicked */}
            <img src={friend.profilePhoto} onClick={redirect}/>
            <h4 onClick={redirect}>{`${friend.firstName} ${friend.lastName}`}</h4>
            <h5>{`${getMutualFriends()} mutual friends`}</h5>
            {/* If this is a friend request, the user can choose to accept/deny their request. */}
            {props.req == 'request' &&
            <div className='friend-button-container'>
                    <button className="friend-request-container" onClick={handleAcceptRequestOnClick}>Confirm</button>
                    <button className="deny-friend-container" onClick={handleDenyRequestOnClick}>Delete</button>
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