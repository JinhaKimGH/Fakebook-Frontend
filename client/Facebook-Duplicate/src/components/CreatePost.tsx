import React, {SyntheticEvent} from 'react';
import {config} from "../config";
import axios from 'axios';
import {UserType, RespType, TokenType} from '../Interfaces'

// Component that creates a post and opens and closes the form
export default function CreatePost(props: {user: UserType, isUser: boolean, setUser: React.Dispatch<React.SetStateAction<any>>}){

     // State for opening and closing the post form
     const [open, setOpen] = React.useState(false);

     // Reference to the form
    const formRef = React.useRef(null);

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    // Async function to send a request to the backend api to create a post
    async function submit(e: SyntheticEvent){
        e.preventDefault();

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
            if(res.data.message == 'Error'){
                // Sets error state in the form
                setError("Please Enter Text to Post.");
            } else if(res.data.message == 'Exceeded Max Character Limit of 300'){
                setError(res.data.message);
            } else if(res.data.message == "Invalid Image URL"){
                // Sets error state in the form
                setError("Please Enter a Valid Image URL");
            } else if(res.data.message == "Can only enter one link."){
                // Sets error state in the form
                setError("You may only enter an image link or an external link, not both.");
            } else if (res.data.message == "Invalid External Link"){
                // Sets error state in the form
                setError("Please Enter a Valid External URL");
            } else {
                // Otherwise, the call was successful and the form can be closed
                setOpen(false);
                props.setUser({...props.user, posts: [...props.user.posts, res.data.id]});
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    // If the IsUser props changes, this function is called that adds an event listener to mousedown

    React.useEffect(() => {
        const formHandler = (e: SyntheticEvent) => {
            // If the formRef contains the event target, we change the setOpen for the form
            // The form closes when the user clicks anything outside of the form
            if(!formRef.current.contains(e.target)){
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

    return (
        <div className='create-post'>
            <div className='post-form'>
                <img className='nav-profile-photo' src={props.user.profilePhoto}/>
                <div className='form-trigger' onClick={() => {setOpen(!open)}}>{`What's on your mind, ${props.user.firstName}?`}</div>
            </div>
            <form className={`post-form-popup-screen ${open ? 'active' : 'inactive'}`}>
                <div className="post-form-popup" ref={formRef}>
                    <div className='post-form-popup-top'><h3>Create Post</h3></div>
                    <div className='post-form-user'><img className='nav-profile-photo' src={props.user.profilePhoto}/><p>{`${props.user.firstName} ${props.user.lastName}`}</p></div>
                    <div className='post-form-inputs'>
                        <textarea id='text' name="text" placeholder={`What's on your mind, ${props.user.firstName}?`} className='post-text-area'/>
                        <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_a_photo</span><input name='image-url' placeholder='Enter an image Link' id='image-url'/></div>
                        <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_link</span><input name='link' placeholder='External Link' id='link'/></div>
                    </div>
                    <div className="form-error-post">{error}</div>
                    <button className='post-submit' onClick={submit}>Post</button>
                </div>
            </form>
        </div>
    )
}