import { UserType, TokenType, RespType } from "../Interfaces";
import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import { useNavigate } from 'react-router-dom'

/**
 * SearchResultContainer Component
 *  
 * @param {Object} props - The component props.
 * @param {UserType} props.user - The user object containing the user information of the profile you are on
 * @returns {JSX.Element} A React JSX element representing the SearchResultContainer Component, the search results from the search
*/
export default function SearchResultContainer(props: {user: UserType}): JSX.Element{
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

    // Finds isFriends, isYou and request state values on mount
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
    async function requestFriend() {
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
                
                // If successful, the request state is set
                if (res.data.message == 'Success'){
                    setRequest("Outgoing");
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'outGoingFriendRequests': [...token.user.outGoingFriendRequests, props.user._id]}}));
                }
            } catch (err){
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

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
                        friend_id: props.user._id,
                    },
                    {
                        headers: headers
                    });

                // If successful the isFriends state is set, request state is reset, and localstoraget is updated to reflect the new friend
                if(res.data.message == 'Success'){
                    setIsFriends(true);
                    setRequest('');
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'friends': [...token.user.friends, props.user._id]}}));
                }
            } catch(err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleAcceptOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void acceptRequest();
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleRequestOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void requestFriend();
    }

    return (
        <div className='search-result-user'>
            {/* Link to the search result user's profile page */}
            <Link to={`/user/${props.user._id}`}><img className='results-profile-photo' src={props.user.profilePhoto}/></Link>
            <div className='search-result-mid'>
                <Link to={`/user/${props.user._id}`} className='result-link'>{`${props.user.firstName} ${props.user.lastName}`}</Link>
                <p>{`${(isYou || isFriends) ? (isYou ? "You ·" : "Friend ·") : ""} ${getMutualFriends()} mutual friends`}</p>
            </div>

            {/* Redirects/calls a function depending on the different states */}
            {isYou == false && isFriends == false && request == "" &&<button className='friend-request' onClick={handleRequestOnClick}>Add Friend</button>}
            {isFriends == false &&  request == "Outgoing" && <button className='friend-request' onClick={(event) => redirect(event, `/friends`)}>Pending Request</button>}
            {isFriends == false &&  request == 'Incoming' && <button className='friend-request' onClick={handleAcceptOnClick}>Accept Request</button>}
            {(isYou == true || isFriends == true) && <button className='friend-request' onClick={(event) => redirect(event, `/user/${props.user._id}`)}>View Profile</button>}
        </div>
    )
}