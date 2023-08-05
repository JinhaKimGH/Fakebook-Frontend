import React, {SyntheticEvent} from 'react';
import {config} from "../config";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {UserType, RespType, TokenType} from '../Interfaces'

/**
 * CreatePost Component
 *  
 * @param {Object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<UserType>>} props.setUser - A function that updates the user state
 * @param {UserType} props.user - The user object containing the logged-on user's information
 * @param {boolean} props.isUser - A flag indicating if the current user is viewing their own profile
 * @returns {JSX.Element} A React JSX element representing the CreatePost Component, the form for creating a post
*/
export default function CreatePost(props: {user: UserType, isUser: boolean, setUser: React.Dispatch<React.SetStateAction<UserType>>}): JSX.Element{
    // Used to navigate routes
    const history = useNavigate();

     // State for opening and closing the post form
     const [open, setOpen] = React.useState(false);

    // Reference to the form
    const formRef = React.useRef<HTMLDivElement>(null);

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    // Async function to send a request to the backend api to create a post
    async function submit(){

        // Gets values of all the text inputs
        const textPost = (document.getElementById('text') as HTMLInputElement).value;
        const linkPost = (document.getElementById('link') as HTMLInputElement).value;
        const imageUrlPost = (document.getElementById('image-url') as HTMLInputElement).value;
        
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(!token){
            return;
        }
        
        try{
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
            const res : RespType = await axios.post(
                `${config.apiURL}/createpost`, 
                {
                    text: textPost,
                    link: linkPost,
                    image: imageUrlPost,
                    user: props.user._id,
                },
                {
                    headers: headers
                });
                
            // Checks response message to verify status of the api POST call
            if(res.data.message == 'Success') {
                // If the call was successful and the form can be closed
                setOpen(false);

                // Updates the user's state and adds the new post id
                props.setUser({...props.user, posts: [...props.user.posts, res.data.id]});
            } else {
                // Otherwise the error message is set
                setError(res.data.message)
            }
            
        } catch (err) {
            // If error, re-directs to error page
            history('/error');
        }
    }

    // If the IsUser props changes, this function is called that adds an event listener to mousedown

    React.useEffect(() => {
        const formHandler = (e: MouseEvent) => {
            // If the formRef contains the event target, we change the setOpen for the form
            // The form closes when the user clicks anything outside of the form
            if(formRef.current && !formRef.current.contains(e.target as Node)){
                setOpen(false);
            }
        }

        if(props.isUser){
            document.addEventListener('mousedown', formHandler);
        }

        return () => {
            // Removes event listener on unmount
            document.removeEventListener('mousedown', formHandler)
        }
    }, [props.isUser])

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSubmitOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void submit();
    }

    return (
        <div className='create-post'>
            {/* If clicked, the form trigger opens the full post form on the screen */}
            <div className='post-form'>
                <img className='nav-profile-photo' src={props.user.profilePhoto}/>
                <div className='form-trigger' onClick={() => {setOpen(!open)}}>{`What's on your mind, ${props.user.firstName}?`}</div>
            </div>
            {/* If opened, the post form is opened on the screen */}
            <form className={`post-form-popup-screen ${open ? 'active' : 'inactive'}`}>
                <div className="post-form-popup" ref={formRef}>
                    <div className='post-form-popup-top'><h3>Create Post</h3></div>
                    <div className='post-form-user'><img className='nav-profile-photo' src={props.user.profilePhoto}/><p>{`${props.user.firstName} ${props.user.lastName}`}</p></div>
                    <div className='post-form-inputs'>
                        <textarea id='text' name="text" placeholder={`What's on your mind, ${props.user.firstName}?`} className='post-text-area'/>
                        <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_a_photo</span><input name='image-url' placeholder='Enter an image Link' id='image-url'/></div>
                        <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_link</span><input name='link' placeholder='External Link' id='link'/></div>
                    </div>
                    {/* Displays any error sent back from the backend */}
                    <div className="form-error-post">{error}</div>
                    <button className='post-submit' onClick={handleSubmitOnClick}>Post</button>
                </div>
            </form>
        </div>
    )
}