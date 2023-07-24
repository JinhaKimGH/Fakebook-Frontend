import { useParams, useNavigate } from 'react-router-dom'
import React, { SyntheticEvent } from 'react'
import {config} from "../config"
import axios from 'axios'
import Navbar from './Navigationbar'
import ProfileFeedContainer from './ProfileFeedContainer'
import {UserType, TokenType, RespType} from '../Interfaces'

// Component for the profile page of a user
export default function User(){
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
        profilePhoto: "",
        posts: []
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
        profilePhoto: "",
        posts: []
    });

    // State of whether the user is the current user's friend
    const [isFriend, setIsFriend] = React.useState(false);
    
    // State that is true when the profile we are on is the profile of the person who is logged in
    const [isUser, setIsUser] = React.useState(false);

    // State that shows the tab we are on of the profile
    const [tab, setTab] = React.useState('Posts');

    // Fetches the profile of the user
    async function fetchUser(token: string) {
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

    // If there is no token saved, go to login automatically, otherwise determine who the user is in relation to the logged-in user
    // And fetch the profile of the user
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            setSelfUser(token.user);
            if( id === token.user._id){
                setIsUser(true);
                void fetchUser(token.token);
            } else {
                setIsUser(false);
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

    return (
        <div className="profile">
            <Navbar user={selfUser} home={'neither'}/>
            <div className='top-profile'>
                <img className="profile-picture" src={user.profilePhoto}/>
                <div className='profile-friends-container'>
                    <div className="profile-name">{`${user.firstName} ${user.lastName}`}</div>
                    {isUser ? <div className='profile-friends'>{`${user.friends.length} friends`}</div> : <div className='profile-friends'>{`${user.friends.length} friends • ${getMutualFriends()} mutual friends`}</div>}
                </div>

                {!isUser && isFriend ? <div className='profile-friend'><span className="material-symbols-rounded button-icon">how_to_reg</span>Friends</div> : ''}
                {!isUser && !isFriend ? <div className='profile-not-friend'><span className="material-symbols-rounded button-icon">person_add</span>Add Friend</div> : ''}
            </div>
            <ul className='profile-tabs'>
                {tab == 'Posts' ? <li className='tab-chosen'>Posts</li> : <li className='not-chosen' onClick={changeTab}>Posts</li>}
                {tab == 'About' ? <li className='tab-chosen'>About</li> : <li className='not-chosen' onClick={changeTab}>About</li>}
                {tab == 'Friends' ? <li className='tab-chosen'>Friends</li> : <li className='not-chosen' onClick={changeTab}>Friends</li>}
            </ul>
            <div className='profile-feed'>
                <ProfileFeedContainer setUser={setUser} tab={tab} user={user} isUser={isUser}/>
            </div>
        </div>
    )
}

//TODO: Make the Friend Contianer, and make all the buttons functional (edit profile, friend, unfriend)