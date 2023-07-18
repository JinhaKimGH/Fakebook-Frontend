import { Link } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import {config} from "../config";

interface IsUser {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    birthday: string,
    accountCreationDate: string,
    password: string,
    bio: string,
    facebookid: string,
    friends: Array<string>,
    profilePhoto: string,
    posts: Array<string>
}

interface Post {
    _id: string,
    user: string,
    text: string,
    link: string
    postTime: string,
    comments: Array<string>,
    image: string,
    likes: Array<string>
}

interface Token {
    user: IsUser,
    token: string,
    message: string,
}

interface Response {
    data: Data
}

interface Data{
    message: string
}


export default function Post(props : {user: IsUser, post: Post}) {
    const [isLiked, setIsLiked] = React.useState(findLiked())
    const [likes, setLikes] = React.useState(props.post.likes.length);
    const [comments, setComments] = React.useState(props.post.comments.length)

    function findLiked(){
        const tokenJSON = localStorage.getItem("token");
        const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;

        if(token){
            return props.post.likes.includes(token.user._id);
        }
        return false;
    }

    async function updateLikes(increase: boolean) {
        const tokenJSON = localStorage.getItem("token");
        const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;
        if(token && (isLiked !== props.post.likes.includes(token.user._id))){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : Response = await axios.put(
                    `${config.apiURL}/updatepost/${props.post._id}/${increase ? 'increase' : 'decrease'}`, 
                    {
                        user: token.user._id,
                    },
                    {
                        headers: headers
                    });
    
                if(res.data.message == "Success"){
                    return
                } else{
                    console.log(res.data.message)
                }
                    
            } catch (err) {
                console.log(err)
            }
        }
    }
    React.useEffect(() => {
        return () => {
            void updateLikes(likes > props.post.likes.length);
        };
    })

    function thumbsUp(){
        if(isLiked == true){ 
            setLikes(prevLikes => prevLikes - 1);
        } else {
            setLikes(prevLikes => prevLikes + 1);
        }
        setIsLiked(prevLiked => !prevLiked);
    }

    return(
        <div className='post-feed'>
            <div className="post-creation-info">
                <Link to={`/user/${props.user._id}`} className='profile-link-post-feed'>
                    <img className='nav-profile-photo' src={props.user.profilePhoto}/>
                    <div>
                        <div className='post-feed-author'>{`${props.user.firstName} ${props.user.lastName}`}</div>
                        <div className='post-feed-date'>{`${(new Date(props.post.postTime)).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} at ${new Date(props.post.postTime).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}`}</div>
                    </div>
                </Link>
            </div>
            <div className='post-content'>
                <p className='post-text'>{props.post.text}</p>
                {props.post.image && <img src={props.post.image}></img>}
                <div className='post-likes-comments'>
                    {likes > 0 ? <div>{`${likes} likes`}</div> : <div>No Likes</div>}
                    {comments > 0 ? <div>{`${comments} comments`}</div> : <div>No Comments</div>}
                </div>
            </div>
            <div className='post-interactions'>
                <button className={`thumbs-up ${isLiked ? 'liked' : ""}`} onClick={thumbsUp}><span className="material-symbols-rounded interactions">thumb_up</span>Like</button>
                <button className='comment'><span className="material-symbols-rounded interactions">chat_bubble</span>Comment</button>
            </div>
        </div>
    )
}