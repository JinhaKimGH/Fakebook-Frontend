import { Link } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import {config} from "../config";
import CommentContainer from "./CommentContainer";
import Microlink from '@microlink/react';
import {UserType, PostType, TokenType, RespType} from '../Interfaces'
import { useNavigate } from "react-router-dom";
import PostOptions from "./PostOptions";

/**
 * Post Component
 *  
 * @param {Object} props - The component props.
 * @param {PostType} props.post - The post object displayed in this component
 * @param {string} props.style - A string that sets the className of the post
 * @param {boolean} props.display - A boolean that decides if the component is displayed
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setPostCount - A function that updates the count state
 * @returns {JSX.Element} A React JSX element representing the Post component, component that displays the posts
*/
export default function Post(props : {post: PostType, style:string, display: boolean, setPostCount: React.Dispatch<React.SetStateAction<number>>}): JSX.Element {
    // For routing
    const history = useNavigate();

    // State for the poster
    const [poster, setPoster] = React.useState<UserType>({
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
        savedPosts: [],
    });

    // State for the number of likes of the post
    const [likes, setLikes] = React.useState(0);

    // State for the list of comments
    const [comments, setComments] = React.useState<Array<string>>([]);

    // State for whether the comments are hidden or not on the post
    const [commentsIsHidden, setCommentsIsHidden] = React.useState(true);

    // State for the current User that is logged in
    const [currentUser, setCurrentUser] = React.useState<UserType>({
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
        profilePhoto: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1",
        posts: [],
        outGoingFriendRequests: [],
        savedPosts: [],
    });
    
    // Boolean state that determines if the user has liked this post
    const [isLiked, setIsLiked] = React.useState(false);

    // Effect that runs when post.likes property is updated, sets the current user and sets the isLiked state
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token: TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        
        // Sets the currentUser and isLiked state when there is a token
        if (token) {
          setCurrentUser(token.user);
          setIsLiked(props.post.likes.includes(token.user._id));
        }
    }, []);

    // Fetches the profile of the user
    async function fetchUser() {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            try{
                const res : RespType = await axios.get(`${config.apiURL}/user/${props.post.user}`, {
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: `Bearer ${token.token}`,
                    }
                });

                if(res.data.message == 'Success'){
                    // Sets the poster
                    const data : UserType = res.data.user;
                    setPoster(data);
                    // Post can be displayed, increase the count
                    props.setPostCount(prevCount => prevCount + 1);
                } else {
                    // If error, re-directs to error page
                    history('/error');
                }
            } catch (err){
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Async function that is a backend api call that updates the likes of a post
    async function updateLikes(increase: boolean) {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/updatepost/${props.post._id}/${increase ? 'increase' : 'decrease'}`, 
                    {
                        user: token.user._id,
                    },
                    {
                        headers: headers
                    });
    
                // If the api call is successful
                if(res.data.message == "Success"){
                    return
                }
            } catch (err) {
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Effect fetches post information on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            setCurrentUser(token.user);
            setIsLiked(props.post.likes.includes(token.user._id))
        }
        setLikes(props.post.likes.length);
        setComments(props.post.comments)
        void fetchUser();
    }, [])
    
    // Function that setsLikes and isLiked
    function thumbsUp(){
        if(isLiked == true){ 
            setLikes(prevLikes => prevLikes - 1);
            void updateLikes(false);
        } else {
            setLikes(prevLikes => prevLikes + 1);
            void updateLikes(true)
        }
        setIsLiked(prevLiked => !prevLiked);
    }

    return(
        <div>
            {props.display && 
                <div className={`post-container ${props.post.link || props.post.image ? "big" : "small"} ${props.style}`}>
                    <div className="fill-space">
                    </div>
                    {/* If one of the poster or post state hasn't been loaded in yet, a loading gif will be displayed */}      
                    <div className='post-feed'>
                        {/* Contains the post creation info. User profile picture, name, and date of post */}
                            <div className="post-creation-info">
                                <Link to={`/user/${props.post.user}`} className='profile-link-post-feed'>
                                    <img className='nav-profile-photo' src={poster.profilePhoto}/>
                                    <div>
                                        <div className='post-feed-author'>{`${poster.firstName} ${poster.lastName}`}</div>
                                        <div className='post-feed-date'>{`${(new Date(props.post.postTime)).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} at ${new Date(props.post.postTime).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}`}</div>
                                    </div>
                                </Link>
                                <PostOptions post_id={props.post._id} post_author={poster._id} current_user={currentUser} savedPosts={currentUser.savedPosts} setCurrentUser={setCurrentUser}/>
                            </div>
                            <div className='post-content'>
                                {/* Content of the post: text and image or link */}
                                <p className='post-text'>{props.post.text}</p>
                                {props.post.image && <img src={props.post.image} className='post-image'></img>}
                                {props.post.link && <div className='micro-link'>
                                    {props.post.link && <Microlink url={props.post.link} style={{'marginBottom': '10px', 'width': '100%'}} />}
                                </div>}
                            </div>
                            {/* Number of likes and comments of a post */}
                            <div className='post-likes-comments'>
                                {likes > 0 ? <div>{`${likes} likes`}</div> : <div>No Likes</div>}
                                {comments.length > 0 ? <div>{`${comments.length} comments`}</div> : <div>No Comments</div>}
                            </div>
                            {/* Buttons to like the post and open the comments section of a post */}
                            <div className='post-interactions'>
                                <button className={`thumbs-up ${isLiked ? 'liked' : ""}`} onClick={thumbsUp}><span className="material-symbols-rounded interactions">thumb_up</span>Like</button>
                                <button className='comment' onClick={() => {setCommentsIsHidden(!commentsIsHidden)}}><span className="material-symbols-rounded interactions">chat_bubble</span>Comment</button>
                            </div>
                    </div>
                    
                    {/* The comments section if commentsIsHidden is false*/}
                    <div className={`post-right ${commentsIsHidden ? "inactive" : "active"}`}>
                        {commentsIsHidden ? <div className='empty-container'></div> : <CommentContainer currentUser={currentUser} comments={comments} setCommentsIsHidden={setCommentsIsHidden} setComments={setComments} postID={props.post._id}/>}
                    </div>
                </div>

            }
        </div>
    )
}
