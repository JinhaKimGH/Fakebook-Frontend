import React from 'react'
import {useNavigate} from 'react-router-dom'
import Post from './Post';
import About from './About';
import CreatePost from './CreatePost';
import {UserType, TokenType, RespType, PostType} from '../Interfaces'
import axios from 'axios';
import { config } from '../config';
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
export default function ProfileFeedContainer(props: {tab: string, user: UserType, isUser: boolean, setUser: React.Dispatch<React.SetStateAction<UserType>>}): JSX.Element{
    // Used for the routing
    const history = useNavigate();

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
        facebookId: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: [],
        savedPosts: []
    });

    // State that determines the number of posts to be loaded
    const [postCount, setPostCount] = React.useState(0);

    // State for the posts that appear in the home page, limited to the 50 most recent posts
    const [posts, setPosts] = React.useState<Array<PostType>>([]);

    // Effect that sets the current user on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (token){
            setCurrUser(token.user);
        }
    }, [])

    // Gets posts when the user property changes
    React.useEffect(() => {
        void getPosts();
    }, [props.user, props.tab])

    // The state to determine if posts are being loaded from the api
    const [postLoading, setPostLoading] = React.useState(false);

    // Async function that retrives the posts for the homepage (friends + user), that are sorted by date
    async function getPosts(){
        if(postLoading){
            return;
        }
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                if(props.tab == 'Posts'){
                    // Sets loading state to true before api call
                    setPostLoading(true);
                    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                    const res : RespType = await axios.get(
                        `${config.apiURL}/getposts/${props.user._id}`, 
                        {
                            headers: headers
                        });
    
                    if(res.data.message == 'Success'){
                        // Sets the posts state array if the api call was successful
                        setPosts(res.data.posts);
                        // Sets loading state to false after api call
                        setPostLoading(false);
                    } else {
                        // Sets loading state to false after api call
                        setPostLoading(false);
                    }
                } else if (props.tab == 'Bookmarks'){
                    // Sets loading state to true before api call
                    setPostLoading(true);
                    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                    const res : RespType = await axios.get(
                        `${config.apiURL}/getsavedposts/${props.user._id}`, 
                        {
                            headers: headers
                        });
    
                    if(res.data.message == 'Success'){
                        // Sets the posts state array if the api call was successful
                        setPosts(res.data.posts);
                        // Sets loading state to false after api call
                        setPostLoading(false);
                    } else {
                        // Sets loading state to false after api call
                        setPostLoading(false);
                    }
                } else {
                    return;
                }
            } catch (err){
                // Sets loading state to false after api call
                setPostLoading(false);
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    
    return (
        <div>
            {/* If the tab is Posts and the profile is the logged-on user's, renders the CreatePost component */}
            {(props.tab == 'Posts' && props.isUser) ?
                <CreatePost user={props.user} isUser={props.isUser} setUser={props.setUser}/>
            : ''}
            {/* If the posts are loading, or the count state is less than the length of the array the loading gif is displayed */}
            {(props.tab === 'Posts' || props.tab === 'Bookmarks') && (postLoading || postCount < posts.length) && 
                        <div className='post-loading-container'><img src='/loading.gif' className='post-loading'/></div>
            }
            {/* If the tab is posts or bookmarks, the posts are mapped to the posts component */}
            {props.tab == 'Bookmarks' && 
                <h4 className='profile-feed-container-title'>Bookmarks</h4>
            }
            {(props.tab === 'Posts' || props.tab === 'Bookmarks') ? (
                props.user && props.user.posts && props.user.posts.length !== 0 ? (
                    posts.map((post) => <Post post={post} key={post._id} setPostCount={setPostCount} style={''} display={postCount >= posts.length}/>)
                ) : null
            ) : null}

            {(props.tab === 'Posts' || props.tab == 'Bookmarks') && props.user.posts.length === 0 &&
                <h4 className='profile-feed-container-no-posts'> No Posts</h4>
            }

            {/* If the tab is About, the about component is rendered */}
            {props.tab == 'About' ? <About setUser={props.setUser} user={props.user} isUser={props.isUser}/> : ''}

            {/* If the tab is Friends, the friends are mapped to the FriendRequestContainer */}
            {props.tab === 'Friends' ? 
                <div>
                    <h4 className='profile-feed-container-title'>Friends</h4>
                    <div className='friend-requests-list'>
                        {props.user.friends.map((friend) => <FriendRequestContainer key={friend} id={friend} req={'friend'} user={currUser} setUser={setCurrUser}/>)}
                    </div>
                </div>
                 : ''
            }
        </div>
    )

}
