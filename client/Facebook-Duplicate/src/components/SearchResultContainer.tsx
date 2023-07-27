import { UserType, TokenType, RespType } from "../Interfaces";
import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import { useNavigate } from 'react-router-dom'

export default function SearchResultContainer(props: {user: UserType}){
    // Is Friends State, checks if the two are friends
    const [isFriends, setIsFriends] = React.useState(false);

    // State that determines if you are the user
    const [isYou, setIsYou] = React.useState(false);

    // State that determines if there is an outgoing/incoming request
    const [request, setRequest] = React.useState("");

    // Used for routing
    const history = useNavigate();

    // Calculates the number of mutual friends between users
    function getMutualFriends(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            const intersection = props.user.friends.filter(x => token.user.friends.includes(x));
    
            return intersection.length;
        } else {
            return 0
        }
    }

    // Determines if the two are friends
    function getIsFriends(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            if(token.user.friends.includes(props.user._id)){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Determines if the you are the user
    function getIsYou(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            if(token.user._id == props.user._id){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Determines if you have a request from or sent an outgoing request to this user
    function getRequest(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if (token) {
            if(token.user.outGoingFriendRequests.includes(props.user._id)){
                return "Outgoing";
            } if(token.user.friendRequests.includes(props.user._id)){
                return 'Incoming';
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    // Finds isFriends and isYou and request state values on mount
    React.useEffect(() => {
        setIsFriends(getIsFriends);
        setIsYou(getIsYou);
        setRequest(getRequest)
    }, [props.user]);

    // Re-directs user to clicked profile
    function redirect(e: SyntheticEvent, path: string){
        e.preventDefault();
        history(path);
    }

    // Async function that sends a friend request
    async function requestFriend(e: SyntheticEvent) {
        e.preventDefault();
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/friend_req`, 
                    {
                        user_id: token.user._id,
                        friend_id: props.user._id,
                    },
                    {
                        headers: headers
                    });

                if (res.data.message == 'Success'){
                    setRequest("Outgoing");
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'outGoingFriendRequests': [...token.user.outGoingFriendRequests, props.user._id]}}));
                } else{
                    console.log(res.data.message);
                }
            } catch (err){
                console.log(err);
            }
        }
    }

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
                        friend_id: props.user._id,
                    },
                    {
                        headers: headers
                    });
                if(res.data.message == 'Success'){
                    setIsFriends(true);
                    setRequest('');
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'friends': [...token.user.friends, props.user._id]}}));
                } else{
                    console.log(res.data.message);
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    return (
        <div className='search-result-user'>
            <Link to={`/user/${props.user._id}`}><img className='results-profile-photo' src={props.user.profilePhoto}/></Link>
            <div className='search-result-mid'>
                <Link to={`/user/${props.user._id}`} className='result-link'>{`${props.user.firstName} ${props.user.lastName}`}</Link>
                <p>{`${(isYou || isFriends) ? (isYou ? "You ·" : "Friend ·") : ""} ${getMutualFriends()} mutual friends`}</p>
            </div>

            {isYou == false && isFriends == false && request == "" &&<button className='friend-request' onClick={requestFriend}>Add Friend</button>}
            {isFriends == false &&  request == "Outgoing" && <button className='friend-request' onClick={(event) => redirect(event, `/friends`)}>Pending Request</button>}
            {isFriends == false &&  request == 'Incoming' && <button className='friend-request' onClick={acceptRequest}>Accept Request</button>}
            {(isYou == true || isFriends == true) && <button className='friend-request' onClick={(event) => redirect(event, `/user/${props.user._id}`)}>View Profile</button>}
        </div>
    )
}