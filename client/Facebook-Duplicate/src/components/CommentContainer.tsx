import Comment from "./Comment";
import React, { SyntheticEvent } from "react";
import { useNavigate } from 'react-router-dom'
import {config} from "../config";
import axios from 'axios';
import { UserType, RespType, TokenType } from "../Interfaces";

// Component for the container for comments of a post
export default function CommentContainer(props: {comments: Array<string>, setComments: React.Dispatch<React.SetStateAction<any>>, setCommentsIsHidden: React.Dispatch<React.SetStateAction<any>>, currentUser: UserType, postID: string}){
    // Used to navigate routes
    const history = useNavigate();

    // State for comment input text
    const [commentText, setCommentText] = React.useState("");

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    // Updates the states for inputs
    function handleChange(event : SyntheticEvent){

        const {value} = event.target as HTMLTextAreaElement;
        setCommentText(value);
    }

    // Async Function that calls the backend to create a new comment
    async function submit(event: SyntheticEvent){
        event.preventDefault();

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
                `${config.apiURL}/createcomment`, 
                {
                    user: props.currentUser._id,
                    text: commentText,
                    postID: props.postID,
                },
                {
                    headers: headers
                });

            // Checks response message to verify status of the api POST call
            if(res.data.message == 'User does not exist.' || res.data.message == 'Post not found.' || res.data.message == 'Internal Server Error'){
                return; //TODO: ADD ERROR PAGE
            } else if (res.data.message == "Invalid Text"){
                // Sets Error state if invalid text
                setError('Please Enter Text to Post.');
            } else if (res.data.message == 'Success'){
                // If success, resets the form
                if(document.getElementById('comment-form')){
                    (document.getElementById('comment-form') as HTMLInputElement)!.value = "";
                }
                setCommentText('');
                setError('');
                props.setComments([...props.comments, res.data.id]);
            }
        } catch(err){
            console.log(err);
        }
    }
    }

    return (
        <div className="comments-popup">
            <div className='comments-top'>
                <h2>Comments</h2>
                <button onClick={() => {props.setCommentsIsHidden(true)}}>✕</button>
            </div>
            <div className='comment-container'>
                {props.comments.length > 0 ? props.comments.map((comment) => <Comment key={comment} id={comment}/>) : <div className='comment-nonexistent'>No Comments</div>}
            </div>
            <div className="form-error-post">{error}</div>
            <form className='comment-form'>
                <input id='comment-form' className='comment-input' name='comment' placeholder='Write a comment...' onChange={handleChange}></input>
                <button className='send-comment' onClick={submit}><span className="material-symbols-rounded send">send</span></button>
            </form>
        </div>
    )
}