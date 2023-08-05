import React from 'react'
import Post from './Post';
import About from './About';
import CreatePost from './CreatePost';
import {UserType, TokenType} from '../Interfaces'
import FriendRequestContainer from './FriendRequestContainer';

/**
 * ProfileFeedContainer Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.tab - The tab that the profile feed container is on
 * @param {UserType} props.user - The user object containing user information of the profile you are on
 * @param {boolean} props.isUser - A flag indicating if the current user is viewing their own profile
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setUser - A function that updates the user state
 * @returns {JSX.Element} A React JSX element representing the ProfileFeedContainer Component, the bottom half of the user's profile, shows the posts, about section, and friends
*/
export default function ProfileFeedContainer(props: {tab: string, user: UserType, isUser: boolean, setUser: React.Dispatch<React.SetStateAction<UserType>>}){
    
    // State for the current user
    const [currUser, setCurrUser] = React.useState<UserType>({
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

    // Effect that sets the current user on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (token){
            setCurrUser(token.user);
        }
    }, [])

    
    return (
        <div>
            {/* If the tab is Posts and the profile is the logged-on user's, renders the CreatePost component */}
            {(props.tab == 'Posts' && props.isUser) ?
                <CreatePost user={props.user} isUser={props.isUser} setUser={props.setUser}/>
            : ''}
            {/* If the tab is posts, the posts are mapped to the posts component */}
            {props.tab === 'Posts' ? (
                props.user && props.user.posts && props.user.posts.length !== 0 ? (
                    [...props.user.posts].reverse().map((post: string) => <Post user_id={props.user._id} id={post} key={post} style={''} />)
                ) : null
            ) : null}

            {props.tab === 'Posts' && props.user.posts.length === 0 &&
                <h4 className='profile-feed-container-no-posts'> No Posts</h4>
            }
            {/* If the tab is About, the about component is rendered */}
            {props.tab == 'About' ? <About setUser={props.setUser} user={props.user} isUser={props.isUser}/> : ''}

            {/* If the tab is Friends, the friends are mapped to the FriendRequestContainer */}
            {props.tab === 'Friends' ? 
                <div className='friend-requests list'>
                    <div className='friend-requests-list'>
                        {props.user.friends.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'friend'} user={currUser} setUser={setCurrUser}/>)}
                    </div>
                </div> : ''
            }
        </div>
    )

}
