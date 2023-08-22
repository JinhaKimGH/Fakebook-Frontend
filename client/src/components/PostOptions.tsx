import React, { SyntheticEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { RespType, TokenType, UserType } from '../Interfaces';
import axios from 'axios';
import { config } from '../config';

/**
 * PostOptions Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.post_id - The id of the post
 * @param {string} props.post_author - The id of the post's author
 * @param {UserType} props.current_user - The id of the current user viewing the post
 * @param {Array<string>} props.savedPosts - An array containing a list of ids of posts that the user has saved
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setCurrentUser - A function that updates the currentUser
 * @returns {JSX.Element} A React JSX element representing the PostOptions component, the options menu for a post
*/
export default function PostOptions(props: {post_id: string, post_author: string, current_user: UserType, savedPosts: Array<string>, setCurrentUser: React.Dispatch<React.SetStateAction<UserType>>}): JSX.Element{
    // The state that determines whether the post options are shown or not
    const [optionsIsHidden, setOptionsIsHidden] = React.useState(true);

    // For routing
    const history = useNavigate();

    // Reference to the options element
    const optionsRef = React.useRef<HTMLDivElement>(null);

    // State for loading the save/unsave/delete requests
    const [loadReq, setLoadReq] = React.useState(false);

    // If the post_id props changes, this function is called that adds an event listener to mousedown
    React.useEffect(() => {
        const formHandler = (e: MouseEvent) => {
            // If the optionsRef contains the event target, we change the setOptionsIsHidden for the form
            // The options closes when the user clicks anything outside of the form
            if(optionsRef.current && !optionsRef.current.contains(e.target as Node)){
                setOptionsIsHidden(true);
            }
        }

        if(props.post_id){
            document.addEventListener('mousedown', formHandler);
        }

        return () => {
            // Removes event listener on unmount
            document.removeEventListener('mousedown', formHandler)
        }
    }, [props.post_id])

    // Async function that is a backend api call that updates the savedPosts property, post_id is added to the array
    async function savePost(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(loadReq){
            return
        }

        if(token){
            try{
                // Sets load state to true before api call
                setLoadReq(true)
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(`${config.apiURL}/addsavedpost/`, 
                    {
                        user_id: token.user._id,
                        post_id: props.post_id,
                    },
                    {
                        headers: headers
                    });

                // If the api call is successful
                if (res.data.message == 'Success'){
                    // Sets load state to false after api call
                    setLoadReq(false);
                    props.setCurrentUser({...props.current_user, "savedPosts": [...props.current_user.savedPosts, props.post_id]});
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: token.token, user: {...props.current_user, "savedPosts": [...props.current_user.savedPosts, props.post_id]}, time: Date.now() }));
                    return
                }
            } catch (err){
                // Sets load state to false after api call
                setLoadReq(false);
                // If error, re-directs to error page
                history('/error');
            }
        }

    }

    // Async function that is a backend api call that updates the savedPosts property, post_id is added to the array
    async function unsavePost(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(loadReq){
            return
        }

        if(token){
            try{
                // Sets load state to true before api call
                setLoadReq(true);
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(`${config.apiURL}/removesavedpost/`, 
                    {
                        user_id: token.user._id,
                        post_id: props.post_id,
                    },
                    {
                        headers: headers
                    });

                // If the api call is successful, sets the current user state with the post_id popped
                if (res.data.message == 'Success'){
                    // Sets load state to false after api call
                    setLoadReq(false);
                    const newSavedPosts = [];

                    for (let i = 0; i < props.current_user.savedPosts.length; i++){
                        if(props.current_user.savedPosts[i] != props.post_id){
                            newSavedPosts.push(props.current_user.savedPosts[i]);
                        }
                    }

                    props.setCurrentUser({...props.current_user, "savedPosts": newSavedPosts});
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: token.token, user: {...props.current_user, "savedPosts": newSavedPosts}, time: Date.now() }));
                    return
                }
            } catch (err){
                // Sets load state to false after api call
                setLoadReq(false);
                // If error, re-directs to error page
                history('/error');
            }
        }

    }

    // Async function that is a backend api call that deletes a post
    async function deletePost(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(loadReq){
            return
        }

        if(token){
            try{
                // Sets load state to true before api call
                setLoadReq(true);
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.post(`${config.apiURL}/deletepost/`, 
                    {
                        user_id: token.user._id,
                        post_id: props.post_id,
                    },
                    {
                        headers: headers
                    });
                console.log(res)
                // If the api call is successful, sets the current user state with the post_id popped
                if (res.data.message == 'Success'){
                    // Sets load state to false after api call
                    setLoadReq(false);
                    const newUserPosts = [];

                    for (let i = 0; i < props.current_user.savedPosts.length; i++){
                        if(props.current_user.savedPosts[i] != props.post_id){
                            newUserPosts.push(props.current_user.posts[i]);
                        }
                    }

                    props.setCurrentUser({...props.current_user, "posts": newUserPosts});
                    // Sets the token, user, and time in localStorage
                    localStorage.setItem("token", JSON.stringify({token: token.token, user: {...props.current_user, "posts": newUserPosts}, time: Date.now() }));
                    window.location.reload();
                    return
                }
            } catch (err) {
                // Sets load state to false after api call
                setLoadReq(false);
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSavePostOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void savePost();
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleUnsavePostOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void unsavePost();
    }

    // Work around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleDeletePostOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void deletePost();
    }
    
    return (
        <div className='post-options-parent' ref={optionsRef}>
            {/* The options button for the post */}
            <div className="post-options" onClick={() => setOptionsIsHidden(false)}><span className="material-symbols-rounded interactions">more_vert</span></div>

            {/* The options for a post if optionsIsHidden is false*/}
            <div className={`post-options-menu ${optionsIsHidden ? "inactive" : "active"}`}>
                {props.savedPosts.includes(props.post_id) ? 
                    <div className='save-post' onClick={handleUnsavePostOnClick}>{loadReq ? 
                        <img src='loading.gif' className='about-property-loading save'/> : <span className="material-symbols-outlined icon-save-post">bookmark</span>}
                        Unsave Post</div> : <div className='save-post' onClick={handleSavePostOnClick}>
                            {loadReq ? <img src='loading.gif' className='about-property-loading save'/> : <span className="material-symbols-outlined icon-save-post">bookmark_border</span>}Save Post</div>}
                            
                { props.current_user._id == props.post_author &&
                    <div>
                        <div className="break save"></div>
                        <div className='save-post' onClick={handleDeletePostOnClick}>{loadReq ? <img src='loading.gif' className='about-property-loading save'/> : <span className="material-symbols-outlined icon-save-post">delete</span>}Delete Post</div>
                    </div>
                }
            </div>
        </div>
    )
}