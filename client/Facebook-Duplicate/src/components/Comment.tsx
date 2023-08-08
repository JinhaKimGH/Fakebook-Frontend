import React, { SyntheticEvent } from "react"
import { useNavigate } from 'react-router-dom'
import {config} from "../config"
import axios from 'axios'
import {RespType, CommentType, UserType, TokenType} from '../Interfaces'
import { Link } from "react-router-dom"
import Reply from "./Reply"

/**
 * Comment Component
 *  
 * @param {Object} props - The component props.
 * @param {String} props.id - The comments id
 * @returns {JSX.Element} A React JSX element representing the Comment Component
*/
export default function Comment(props: {id: string}): JSX.Element{

    // State for comment object
    const [comment, setComment] = React.useState<CommentType>({
        _id: '',
        user: '',
        text: '',
        commentTime: '',
        replies: [],
        likes: []
    });

    // State for loading time for the comment to send
    const [loading, setLoading] = React.useState(false);

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
        friendRequests: [],
        profilePhoto: '',
        posts: [],
        outGoingFriendRequests: []
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

    /* 
    Returns a formatted time between the original posting and now   
    Computes the number of years, weeks, days, hours, minutes that have passed since posting
    The largest unit greater than or equal to 1 will be displayed 
    */
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
                
                // If the api call was successful, the different states are set to the returned values
                if(res.data.message == 'Success') {
                    setComment(res.data.comment);
                    setUser(res.data.user);
                    setIsLiked(res.data.comment.likes.includes(token.user._id));
                    setNumLikes(res.data.comment.likes.length);
                } else {
                    // If error, re-directs to error page
                    history('/error');
                }
            } catch (err) {
                // If error, re-directs to error page
                history('/error');
            }
        }

    }

    // Updates the likes of the comments through the backendd api
    async function updateCommentLike(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            // Skips calling the api if the user hasn't interacted with the comment
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
                    // If successful, nothing happens
                    if (res.data.message == "Success"){
                        return;
                    } else {
                        // If error, re-directs to error page
                        history('/error');
                    }
                } catch (err) {
                    // If error, re-directs to error page
                    history('/error');
                }
            }
        } else {
            history('/');
        }
    }

    async function sendComment(){
        // If comment is blank, or a send comment is still loading, return
        if(commentText == '' || loading){
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
            // Sets the loading state for the api call
            setLoading(true);
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

            // If successful, the form is reset
            if(res.data.message == 'Success'){
                if(document.getElementById('reply-form')){
                    (document.getElementById('reply-form') as HTMLInputElement)!.value = "";
                }
                setCommentText('');
                setReplyForm(false);
                // Sets loading state to false after api call
                setLoading(false);

                // Update the local state to include the reply
                setComment({...comment, replies: [...comment.replies, res.data.id]});
                return;
            }
            } catch (err){
                // Sets loading state to false after api call
                setLoading(false);
                // If error, re-directs to error page
                history('/error');
            }
        }

    }

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSendCommentOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void sendComment();
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
            {
                comment._id == '' ? <div className="comment-bubble"><img src='/loading.gif' className='comment-loading'/></div> :

                <div className='comment-bubble'>
                    {/* Comment bubble displays the users photo, name, and reply. Both the name and photo are linked to the user's profile*/}
                    <Link to={`/user/${user._id}`}><img src={user.profilePhoto} className='comment-profile-photo'/></Link>
                    <div>
                        <div className='comment-text'>
                            <Link to={`/user/${user._id}`} className='comment-name'>{`${user.firstName} ${user.lastName}`}</Link>
                            <p>{comment.text}</p>
                        </div>
                        {/* The different interactions (like, reply) the user can have with the comment. Also displays the time state and the number of likes*/}
                        <div className='interactions'>
                            {/* Sets the isLiked state and the numLikes state */}
                            <p className={`comment-like${isLiked ? "d" : ''}`} onClick={clickLike}>Like</p>
                            {/* Opens the comment reply form when reply is clicked */}
                            <p className='comment-reply' onClick={() => setReplyForm(!replyForm)}>Reply</p>
                            <p>{time}</p>
                            <div className='likes'><span className="material-symbols-rounded like-icon">thumb_up</span><p>{numLikes}</p></div>
                        </div>
                    </div>
                </div>
            }
            {/* If the user clicks on the view replies option, the replies to a comment will be displayed */}
            {openReplies && comment.replies.length > 0 &&
                comment.replies.map((reply) => <Reply key={reply} id={reply}/>)
            }
            {/* When clicked, the replies of a comment open/close */}
            {comment.replies.length > 0 &&
            <div className='replies' onClick={() => setOpenReplies(!openReplies)}>
                <span className="material-symbols-rounded view-replies">shortcut</span>
                <p>{openReplies ? 'Hide Replies' : (comment.replies.length == 1 ? "1 Reply" : `${comment.replies.length} Replies`)}</p>
            </div>}
            {/* If the replyForm state is true, the form is displayed, if a previous reply is being sent, the button is disabled and a loading gif is shown */}
            {replyForm &&  <div>
            <form className='reply-form'>
                <input id='reply-form' className='reply-input' name='comment' placeholder='Write a reply...' onChange={handleChange}></input>
                {loading ? <img src='/loading.gif' className='about-property-loading'/> : ""}
                {loading ? <span className="material-symbols-rounded send-disabled">send</span> : <button className='send-reply' onClick={handleSendCommentOnClick}><span className="material-symbols-rounded send">send</span></button>}
            </form>
            </div>}
        </div>
    )
}