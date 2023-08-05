import { useParams, useNavigate } from 'react-router-dom'
import React, { SyntheticEvent } from 'react'
import {config} from "../config"
import axios from 'axios'
import Navbar from './Navigationbar'
import ProfileFeedContainer from './ProfileFeedContainer'
import {UserType, TokenType, RespType} from '../Interfaces'
import ProfilePictureForm from './ProfilePictureForm'

/**
 * User Component
 *  
 * @returns {JSX.Element} A React JSX element representing the User Component, the profile section for the user
*/
export default function User(): JSX.Element{
    // Finds the id of the user from the url
    const id : string  = useParams().id || '';

    // Used to navigate routes
    const history = useNavigate();

    // State for the current user, the user of the page we are on
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

    // State for the user logged into the site
    const [selfUser, setSelfUser] = React.useState<UserType>({
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

    // State of whether the user is the current user's friend
    const [isFriend, setIsFriend] = React.useState(false);
    
    // State that is true when the profile we are on is the profile of the person who is logged in
    const [isUser, setIsUser] = React.useState(false);

    // State that shows the tab we are on of the profile
    const [tab, setTab] = React.useState('Posts');

    // State that determines whether the profile picture form is open
    const [profileForm, setProfileForm] = React.useState(false);

    // State that determines if there is an outgoing/incoming request
    const [request, setRequest] = React.useState("");

    // Determines if you have a request from or sent an outgoing request to this user
    function getRequest(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if (token) {
            if(token.user.outGoingFriendRequests.includes(id)){
                return "Outgoing";
            } if(token.user.friendRequests.includes(id)){
                return 'Incoming';
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    // Fetches the profile of the user
    async function fetchUser(token: string) {
        try{
            const res : RespType = await axios.get(`${config.apiURL}/user/${id}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if(res.data.message == 'Success'){
                // Set user state when successful
                const data : UserType = res.data.user;
                setUser(data);
            }
        } catch (err){
            // If error, re-directs to error page
            history('/error');
        }
    }

    // If there is no token saved, go to login automatically, otherwise determine who the user is in relation to the logged-in user
    // And fetch the profile of the user
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            setSelfUser(token.user);
            // User is looking at their own page
            if( id === token.user._id){
                setIsUser(true);
                void fetchUser(token.token);
            // User is looking at someone else's page
            } else {
                setIsUser(false);
                setRequest(getRequest);
                if (token.user.friends.includes(id)){
                    setIsFriend(true);
                } else {
                    setIsFriend(false);
                }

                void fetchUser(token.token);

            }
        }
    }, [id, history])

    // Calculates the number of mutual friends between users
    function getMutualFriends(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            const intersection = user.friends.filter(x => token.user.friends.includes(x));
    
            return intersection.length;
        } else {
            return 0
        }
    }

    // Function which changes the selection to the clicked tab
    function changeTab(e : SyntheticEvent){
        const input = e.target as HTMLElement;
        setTab(input.innerText);
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
                        friend_id: id,
                    },
                    {
                        headers: headers
                    });
                // If successful, request state is set, local storage is updated to reflect outGoingFriendRequest
                if (res.data.message == 'Success'){
                    setRequest('Outgoing');
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'outGoingFriendRequests': [...token.user.outGoingFriendRequests, id]}}));
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
                        friend_id: id,
                    },
                    {
                        headers: headers
                    });
                // If successful, isFriend and request state is set, local storage is updated to reflect the accepted request
                if(res.data.message == 'Success'){
                    setIsFriend(true);
                    setRequest('');
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'friends': [...token.user.friends, id], 'friendRequests': token.user.friendRequests.filter(item => item !== id)}}));
                }
            } catch(err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Async Function that Unfriends
    async function unfriend(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token) {
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/unfriend`, 
                    {
                        user_id: token.user._id,
                        friend_id: id,
                    },
                    {
                        headers: headers
                    });

                // If successful, isFriend and request state are reset, local storage is updated to reflect the unfriend
                if(res.data.message == 'Success'){
                    setIsFriend(false);
                    setRequest('');
                    localStorage.setItem('token', JSON.stringify({token: token.token, user: {...token.user, 'friends': token.user.friends.filter(item => item !== id)}}));
                } 
            } catch(err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleUnfriendOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void unfriend();
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleRequestFriendOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void requestFriend();
    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleAcceptRequestOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void acceptRequest();
    }

    return (
        <div className="profile">
            <Navbar user={selfUser} home={'neither'}/>
            {/* Displays the top of the profile, with name, number of friends, mutual friends, and profile picture */}
            <div className='top-profile'>
                {isUser ?  <div className='profile-pic-wrapper'><img className="profile-picture hover" src={user.profilePhoto} onClick={() => {setProfileForm(true)}}/></div> : <div className='profile-pic-wrapper'><img className="profile-picture" src={user.profilePhoto}/></div>}
                {isUser && <div className='profile-picture-openform' onClick={() => {setProfileForm(true)}}><span className="material-symbols-rounded">photo_camera</span></div>}
                <div className='profile-friends-container'>
                    <div className="profile-name">{`${user.firstName} ${user.lastName}`}</div>
                    {isUser ? <div className='profile-friends'>{`${user.friends.length} friends`}</div> : <div className='profile-friends'>{`${user.friends.length} friends • ${getMutualFriends()} mutual friends`}</div>}
                </div>

                {/* Depending on the isUser and isFriend states, different buttons exist */}
                {!isUser && isFriend ? <div className='profile-friend'><span className="material-symbols-rounded button-icon">how_to_reg</span>Friends</div> : ''}
                {!isUser && isFriend ? <div className='profile-unfriend' onClick={handleUnfriendOnClick}><span className="material-symbols-rounded button-icon">person_remove</span>Unfriend?</div> : ''}
                {!isUser && !isFriend && request == '' ? <div className='profile-not-friend' onClick={handleRequestFriendOnClick}><span className="material-symbols-rounded button-icon" >person_add</span>Add Friend</div> : ''}
                {!isUser && !isFriend && request == 'Incoming' ? <div className='profile-not-friend' onClick={handleAcceptRequestOnClick}><span className="material-symbols-rounded button-icon">check_circle</span>Accept Request?</div> : ''}
                {!isUser && !isFriend && request == 'Outgoing' ? <div className='profile-not-friend'><span className="material-symbols-rounded button-icon">schedule</span>Pending</div> : ''}
            </div>
            {/* Different profile tabs for the profile feed container */}
            <ul className='profile-tabs'>
                {tab == 'Posts' ? <li className='tab-chosen'>Posts</li> : <li className='not-chosen' onClick={changeTab}>Posts</li>}
                {tab == 'About' ? <li className='tab-chosen'>About</li> : <li className='not-chosen' onClick={changeTab}>About</li>}
                {tab == 'Friends' ? <li className='tab-chosen'>Friends</li> : <li className='not-chosen' onClick={changeTab}>Friends</li>}
            </ul>
            {/* Profile feed container displays content based on the tab state */}
            <div className='profile-feed'>
                <ProfileFeedContainer setUser={setUser} tab={tab} user={user} isUser={isUser}/>
            </div>
            {/* Profile picture form, displays content based on the profileForm state */}
            <ProfilePictureForm user_id={user._id} profileForm={profileForm} setProfileForm={setProfileForm}/>
        </div>
    )
}
