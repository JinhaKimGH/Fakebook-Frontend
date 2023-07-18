import React, {SyntheticEvent} from 'react';
import {config} from "../config";
import axios from 'axios';

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

interface Data{
    message: string
}

interface Response{
    data: Data
}

interface Token {
    user: IsUser,
    token: string,
    message: string,
}

export default function CreatePost(props: {user: IsUser, isUser: boolean}){

     // State for opening and closing the post form
     const [open, setOpen] = React.useState(false);

     // Reference to the form
    const formRef = React.useRef(null);

    // Sets the error message for the form
    const [error, setError] = React.useState("");

    async function submit(e: SyntheticEvent){
        e.preventDefault();

        const textPost = (document.getElementById('text') as HTMLInputElement).value;
        const linkPost = (document.getElementById('link') as HTMLInputElement).value;
        const imageUrlPost = (document.getElementById('image-url') as HTMLInputElement).value;
        
        const tokenJSON = localStorage.getItem("token");
        const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;

        if(!token){
            return;
        }
        
        try{
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
            const res : Response = await axios.post(
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
                
            if(res.data.message == 'Error'){
                setError("Please Enter Text to Post.");
            } else {
                setOpen(false);
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        const formHandler = (e: SyntheticEvent) => {
            if(!formRef.current.contains(e.target)){
                setOpen(false);
            }
        }

        if(props.isUser){
            document.addEventListener('mousedown', formHandler);
        }

        return () => {
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
                        <textarea id='text' name="text" placeholder="What's on your mind, Jinha?" className='post-text-area'/>
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