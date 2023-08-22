import { useParams, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import React from "react"
import {config} from "../config"
import axios from 'axios'
import Navbar from './Navigationbar'
import Microlink from '@microlink/react';
import CommentContainer from './CommentContainer';
import {UserType, PostType, TokenType, RespType} from '../Interfaces'
import PostOptions from "./PostOptions";
import loadingGif from '../loading.gif'

/**
 * FullPost Component
 *  
 * @returns {JSX.Element} A React JSX element representing the FullPost Component, when the post is fully opened up
*/
export default function FullPost(): JSX.Element{
    // Finds the id of the post from the url
    const post_id : string = useParams().id || '';

    // Used to navigate routes
    const history = useNavigate();

    // State for the current logged on user
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
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: [],
        savedPosts: [],
    });

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

    // State for the post
    const [post, setPost] = React.useState<PostType>({
        _id: "",
        user: '',
        text: '',
        link: '',
        postTime: '',
        comments: [],
        image: '',
        likes: []
    });

    // State for the number of likes of the post
    const [likes, setLikes] = React.useState(0);

    // Boolean state that determines if the user has liked this post
    const [isLiked, setIsLiked] = React.useState(false);

    // State for the list of comments
    const [comments, setComments] = React.useState<Array<string>>([]);

    // Async function that retrieves the post
    async function getPost(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            // Sets the currentUser state
            setCurrentUser(token.user);
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`};

                const res : RespType = await axios.get(
                    `${config.apiURL}/getpost/${post_id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the post, isLiked state if api call was successful
                    setPost(res.data.post);
                    setIsLiked(res.data.post.likes.includes(token.user._id));
                    setLikes(res.data.post.likes.length);
                    setComments(res.data.post.comments);
                }

            } catch (error){
                // If error, re-directs to the error page
                history('/error');
            }
        }
    }

    // Async function that retrieves the poster
    async function getPoster(){
        if(!post.user){
            return;
        }
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/user/${post.user}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the poster
                    const data : UserType = res.data.user;
                    setPoster(data);
                } else {
                    // If error, redirects to error page
                    history('/error');
                }
            } catch (error) {
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
                    `${config.apiURL}/updatepost/${post_id}/${increase ? 'increase' : 'decrease'}`, 
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

    // Gets the post information
    React.useEffect(() => {
        void getPost();
    }, [post_id])

    // Gets the poster information
    React.useEffect(() => {
        void getPoster();
    }, [post.user])

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

    // Function to go back to the previous page
    function goBack(){
        history(-1);
    }

    return (
        <div className='homepage'>
            <Navbar user={currentUser} home={''}/>

            <div className='fullpost'>
                {/* If one of the poster or post state hasn't been loaded in yet, a loading gif will be displayed */}      
                {(post._id && poster._id) ? <div className='post-feed'>
                    <div className='fullpost-top'>
                        <span className="material-symbols-rounded back-button" onClick={goBack}>west</span>
                        <h4>Post</h4>
                        <PostOptions post_id={post._id} post_author={poster._id} current_user={currentUser} savedPosts={currentUser.savedPosts} setCurrentUser={setCurrentUser}/>
                    </div>
                    {/* Contains the post creation info. User profile picture, name, and date of post */}
                    <div className="post-creation-info">
                        <Link to={`/user/${post.user}`} className='profile-link-post-feed'>
                            <img className='nav-profile-photo' src={poster.profilePhoto}/>
                            <div>
                                <div className='post-feed-author'>{`${poster.firstName} ${poster.lastName}`}</div>
                                <div className='post-feed-date'>{`${(new Date(post.postTime)).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} at ${new Date(post.postTime).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}`}</div>
                            </div>
                        </Link>
                    </div>
                    <div className='post-content'>
                        {/* Content of the post: text and image or link */}
                        <p className='post-text'>{post.text}</p>
                        {post.image && <img src={post.image} className='post-image'></img>}
                        {post.link && <div className='micro-link'>
                            {post.link && <Microlink url={post.link} style={{'marginBottom': '10px', 'width': '100%'}} />}
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
                        <button className='comment'><span className="material-symbols-rounded interactions">chat_bubble</span>Comments</button>
                    </div>
                    {/* The comments section if commentsIsHidden is false */}
                    <CommentContainer currentUser={currentUser} comments={comments} setComments={setComments} postID={post_id}/>
                </div> :
                
                <div className='post-loading-container'><img src={loadingGif} className='post-loading'/></div>
                }
            </div>

        </div>
    )
}