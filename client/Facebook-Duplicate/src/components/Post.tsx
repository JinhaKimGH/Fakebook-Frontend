import { Link } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import {config} from "../config";
import CommentContainer from "./CommentContainer";
import Microlink from '@microlink/react';
import {UserType, PostType, TokenType, RespType, CommentType} from '../Interfaces'
import { useNavigate } from "react-router-dom";


export default function Post(props : {user_id: string, id: string}) {
    // For routing
    const history = useNavigate();

    // State for the post object
    const [post, setPost] = React.useState<PostType>({
        _id: "",
        user: '',
        text: '',
        link: '',
        postTime: '',
        comments: [],
        image: '',
        likes: [],
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
        facebookid: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: []
    });

    // State for the number of likes of the post
    const [likes, setLikes] = React.useState(0);
    // State for the comments of a post
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
        facebookid: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: []
    });
    // Boolean state that determines if the user has liked this post
    const [isLiked, setIsLiked] = React.useState(false);

    // Effect that runs when post.likes property is updated, sets the current user and sets the isLiked state
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token: TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
      
        if (token) {
          setCurrentUser(token.user);
          setIsLiked(post.likes.includes(token.user._id));
        }
    }, [post.likes]);

    // Async function that fetches the post information
    async function fetchPost(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/getpost/${props.id}/`, 
                    {
                        headers: headers
                    });

                if (res.data.message == 'Success'){
                    setPost(res.data.post);
                    setLikes(res.data.post.likes.length);
                    setComments(res.data.post.comments);
                    setCurrentUser(token.user);
                    setIsLiked(res.data.post.likes.includes(token.user._id));
                } else {
                    console.log(res.data.message)
                    // TODO: Re-direct to error page
                }
            } catch (err){
                console.log(err)
            }
        }
    }

    // Fetches the profile of the user
    async function fetchUser() {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            try{
                const res : RespType = await axios.get(`${config.apiURL}/user/${props.user_id}`, {
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: `Bearer ${token.token}`,
                    }
                });

                if(res.data == null){
                    history('/'); //TODO: Error Page
                } else {
                    // Sets the poster
                    const data : UserType = res.data.user;
                    setPoster(data);
                }
            } catch (err){
                console.log(err);
            }
        }
    }

    // Async function that is a backend api call that updates the likes of a post
    async function updateLikes(increase: boolean) {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token && (isLiked !== post.likes.includes(token.user._id))){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/updatepost/${post._id}/${increase ? 'increase' : 'decrease'}`, 
                    {
                        user: token.user._id,
                    },
                    {
                        headers: headers
                    });
    
                // If the api call is successful
                if(res.data.message == "Success"){
                    return
                } else{
                    // Otherwise, there is an error
                    console.log(res.data.message)
                }
                    
            } catch (err) {
                console.log(err)
            }
        }
    }

    // Effect that calls the updateLikes async function on unmount
    React.useEffect(() => {
        return () => {
            void updateLikes(likes > post.likes.length);
        };
    }, [isLiked])

    
    // Effect fetches post information on mount
    React.useEffect(() => {
        void fetchPost();
        void fetchUser();
    }, [])
    
    // Function that setsLikes and isLiked
    function thumbsUp(){
        if(isLiked == true){ 
            setLikes(prevLikes => prevLikes - 1);
        } else {
            setLikes(prevLikes => prevLikes + 1);
        }
        setIsLiked(prevLiked => !prevLiked);
    }

    return(
        <div className={`post-container ${post.link || post.image ? "big" : "small"}`}>
            <div className='post-feed'>
                    <div className="post-creation-info">
                        <Link to={`/user/${props.user_id}`} className='profile-link-post-feed'>
                            <img className='nav-profile-photo' src={poster.profilePhoto}/>
                            <div>
                                <div className='post-feed-author'>{`${poster.firstName} ${poster.lastName}`}</div>
                                <div className='post-feed-date'>{`${(new Date(post.postTime)).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} at ${new Date(post.postTime).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}`}</div>
                            </div>
                        </Link>
                    </div>
                    <div className='post-content'>
                        <p className='post-text'>{post.text}</p>
                        {post.image && <img src={post.image} className='post-image'></img>}
                        {post.link && <Microlink url={post.link} style={{'marginBottom': '10px'}} />}
                    </div>
                    <div className='post-likes-comments'>
                        {likes > 0 ? <div>{`${likes} likes`}</div> : <div>No Likes</div>}
                        {comments.length > 0 ? <div>{`${comments.length} comments`}</div> : <div>No Comments</div>}
                    </div>
                    <div className='post-interactions'>
                        <button className={`thumbs-up ${isLiked ? 'liked' : ""}`} onClick={thumbsUp}><span className="material-symbols-rounded interactions">thumb_up</span>Like</button>
                        <button className='comment' onClick={() => {setCommentsIsHidden(!commentsIsHidden)}}><span className="material-symbols-rounded interactions">chat_bubble</span>Comment</button>
                    </div>
            </div>
            <div className={`post-right ${commentsIsHidden ? "inactive" : "active"}`}>
                {commentsIsHidden ? <div className='empty-container'></div> : <CommentContainer currentUser={currentUser} comments={comments} setCommentsIsHidden={setCommentsIsHidden} setComments={setComments} postID={post._id}/>}
            </div>
        </div>
    )
}
