import React from "react"
import { useNavigate } from 'react-router-dom'
import {config} from "../config"
import axios from 'axios'
import {RespType, CommentType, UserType, TokenType} from '../Interfaces'
import { Link } from "react-router-dom"

// Component for the individual comment
/**
 * Reply Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.id - The id of the reply
 * @returns {JSX.Element} A React JSX element representing the Reply Component
*/
export default function Reply(props: {id: string}): JSX.Element{
    // State for comment object
    const [reply, setReply] = React.useState<CommentType>({
        _id: '',
        user: '',
        text: '',
        commentTime: '',
        replies: [],
        likes: []
    });

    // State for the number of likes for the comment
    const [numLikes, setNumLikes] = React.useState(0);

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

    // Used to navigate routes
    const history = useNavigate();

    /* 
    Returns a formatted time between the original posting and now   
    Computes the number of years, weeks, days, hours, minutes that have passed since posting
    The largest unit greater than or equal to 1 will be displayed 
    */
    function calculateTime(){
        const dateNow = new Date();
        const datePast = new Date(reply.commentTime);

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
    async function getReply(){
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
                
                // Sets reply, user, isLiked, and numLikes state when api call is successful
                if(res.data.message == 'Success') {
                    setReply(res.data.comment);
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
 
    // Updates the likes of the replies through the backendd api
    async function updateReplyLike(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            if(isLiked == reply.likes.includes(token.user._id)){
                return    
            } else {
                try {
                    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                    const res : RespType = await axios.put(
                        `${config.apiURL}/updatecomment/`, 
                        {
                            id: reply._id,
                            user: token.user._id,
                            increase: isLiked,
                        },
                        {
                            headers: headers
                        });

                    if (res.data.message == "Success"){
                        return;
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

    // Effect called to get replies when component is mounted
    React.useEffect(() => {
        void getReply();
    }, []);

    // Effect called to update reply likes on unmount
    React.useEffect(() => {
        return () => {
            void updateReplyLike();
        };
    }, [isLiked])

    // Calculates how long it has been since the comment was sent
    React.useEffect(() => {
        void calculateTime();
    }, [reply]);

    // Calculates and sets the states for the number of likes of a comment and the isLiked state
    function clickLike(){
        isLiked ? setNumLikes(numLikes - 1) : setNumLikes(numLikes + 1)

        setIsLiked(!isLiked);
    }

    return (
    <div className='comment-bubble reply'>
        {/* Comment bubble displays the users photo and name. Both the name and photo are linked to the user's profile*/}
        <Link to={`/user/${user._id}`}><img src={user.profilePhoto} className='comment-profile-photo'/></Link>
        <div>
            <div className='comment-text'>
                <Link to={`/user/${user._id}`} className='comment-name'>{`${user.firstName} ${user.lastName}`}</Link>
                <p>{reply.text}</p>
            </div>
             {/* The different interactions the user can have with the comment. Also displays the time state and the number of likes*/}
            <div className='interactions'>
                <p className={`comment-like${isLiked ? "d" : ''}`} onClick={clickLike}>Like</p>
                <p>{time}</p>
                <div className='likes'><span className="material-symbols-rounded like-icon">thumb_up</span><p>{numLikes}</p></div>
            </div>
        </div>
    </div>
    )
}