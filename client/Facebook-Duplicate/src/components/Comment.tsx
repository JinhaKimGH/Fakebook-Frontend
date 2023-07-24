import React, { SyntheticEvent } from "react"
import { useNavigate } from 'react-router-dom'
import {config} from "../config"
import axios from 'axios'
import {RespType, CommentType, UserType, TokenType} from '../Interfaces'
import { Link } from "react-router-dom"
import Reply from "./Reply"

// Component for the individual comment
export default function Comment(props: {id: string}){

    // State for comment object
    const [comment, setComment] = React.useState<CommentType>({
        _id: '',
        user: '',
        text: '',
        commentTime: '',
        replies: [],
        likes: []
    });

    // State for the number of likes for the comment
    const [numLikes, setNumLikes] = React.useState(0);

    // State to show reply form
    const [replyForm, setReplyForm] = React.useState(false);

    // State for comment time
    const [time, setTime] = React.useState('Just Now');

    // State for the user that wrote the comment
    const [user, setUser] = React.useState<UserType>({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: '',
        accountCreationDate: '',
        password: '',
        bio: '',
        facebookid: '',
        friends: [],
        profilePhoto: '',
        posts: []
    })

    // State for whether the user has liked the comment
    const [isLiked, setIsLiked] = React.useState(false)

    // State for comment input text
    const [commentText, setCommentText] = React.useState("");
    
    // State for opening replies
    const [openReplies, setOpenReplies] = React.useState(false);

    // Used to navigate routes
    const history = useNavigate();

    // Updates the states for inputs
    function handleChange(event : SyntheticEvent){

        const {value} = event.target as HTMLTextAreaElement;
        setCommentText(value);
    }

    // Returns a formatted time between the original posting and now
    function calculateTime(){
        const dateNow = new Date();
        const datePast = new Date(comment.commentTime);

        // In milliseconds
        const diffTime = Math.abs(dateNow.getTime() - datePast.getTime());
        
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));

        if (diffYears > 0){
            setTime(`${diffYears}y`);
            return;
        }

        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffWeeks> 0){
            setTime(`${diffWeeks}w`);
            return;
        }

        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 0){
            setTime(`${diffDays}d`);
            return;
        }

        const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); 

        if (diffHours > 0){
            setTime(`${diffHours}h`);
            return;
        }

        const diffMins = Math.floor(diffTime / (1000 * 60)); 

        if (diffMins > 0){
            setTime(`${diffMins}m`);
            return;
        }

    }
   
    // Async function that gets the comment by id from the backend
    async function getComment(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        // If the token does not exist, redirected to login page
        if(!token){
            history('/');
        } else {
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/getcomment/${props.id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success') {
                    setComment(res.data.comment);
                    setUser(res.data.user);
                    setIsLiked(res.data.comment.likes.includes(token.user._id));
                    setNumLikes(res.data.comment.likes.length);
                } else {
                    // TODO: CALL ERROR THING
                    console.log(res.data.message);
                }
            } catch (err) {
                console.log(err)
            }
        }

    }

    // Updates the likes of the comments through the backendd api
    async function updateCommentLike(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            if(isLiked == comment.likes.includes(token.user._id)){
                return    
            } else {
                try {
                    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                    const res : RespType = await axios.put(
                        `${config.apiURL}/updatecomment/`, 
                        {
                            id: comment._id,
                            user: token.user._id,
                            increase: isLiked,
                        },
                        {
                            headers: headers
                        });

                    if (res.data.message == "Success"){
                        return;
                    } if (res.data.message == 'Internal Server Error.'){
                        //TODO: REDIRECT TO ERROR PAGE
                        return;
                    } else {
                        console.log("ERROR")
                        return;
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            history('/');
        }
    }

    async function sendComment(event: SyntheticEvent){
        event.preventDefault();

        if(commentText == ''){
            return;
        }

        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        // If the token does not exist, redirected to login page
        if(!token){
            history('/')
        }

        else {
            try{
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
            const res : RespType = await axios.post(
                `${config.apiURL}/createreply`, 
                {
                    user: token.user._id,
                    text: commentText,
                    commentID: comment._id,
                },
                {
                    headers: headers
                });

            if(res.data.message == 'Success'){
                // If success, resets the form
                if(document.getElementById('reply-form')){
                    (document.getElementById('reply-form') as HTMLInputElement)!.value = "";
                }
                setCommentText('');
                setReplyForm(false);

                // Update the local state to include the reply
                setComment({...comment, replies: [...comment.replies, res.data.id]});
                return;
            } else {
                console.log(res.data.message);
                return; //TODO: Error page redirect
            }
            } catch (err){
                console.log(err);
            }
        }


    }

    // Effect called to get comments when component is mounted
    React.useEffect(() => {
        void getComment();
    }, []);

    // Effect called to update comment likes on unmount
    React.useEffect(() => {
        return () => {
            void updateCommentLike();
        };
    }, [isLiked])

    // Calculates how long it has been since the comment was sent
    React.useEffect(() => {
        void calculateTime();
    }, [comment]);

    // Calculates and sets the states for the number of likes of a comment and the isLiked state
    function clickLike(){
        isLiked ? setNumLikes(numLikes - 1) : setNumLikes(numLikes + 1)

        setIsLiked(!isLiked);
    }

    return (
        <div>
            <div className='comment-bubble'>
                <Link to={`/user/${user._id}`}><img src={user.profilePhoto} className='comment-profile-photo'/></Link>
                <div>
                    <div className='comment-text'>
                        <Link to={`/user/${user._id}`} className='comment-name'>{`${user.firstName} ${user.lastName}`}</Link>
                        <p>{comment.text}</p>
                    </div>
                    <div className='interactions'>
                        <p className={`comment-like${isLiked ? "d" : ''}`} onClick={clickLike}>Like</p>
                        <p className='comment-reply' onClick={() => setReplyForm(!replyForm)}>Reply</p>
                        <p>{time}</p>
                        <div className='likes'><span className="material-symbols-rounded like-icon">thumb_up</span><p>{numLikes}</p></div>
                    </div>
                </div>
            </div>
            {openReplies && comment.replies.length > 0 &&
                comment.replies.map((reply) => <Reply key={reply} id={reply}/>)
            }
            {comment.replies.length > 0 &&
            <div className='replies' onClick={() => setOpenReplies(!openReplies)}>
                <span className="material-symbols-rounded view-replies">shortcut</span>
                <p>{openReplies ? 'Hide Replies' : (comment.replies.length == 1 ? "1 Reply" : `${comment.replies.length} Replies`)}</p>
            </div>}
            {replyForm &&  <div>
            <form className='reply-form'>
                <input id='reply-form' className='reply-input' name='comment' placeholder='Write a reply...' onChange={handleChange}></input>
                <button className='send-reply' onClick={sendComment}><span className="material-symbols-rounded send">send</span></button>
            </form>
            </div>}
        </div>
    )
}