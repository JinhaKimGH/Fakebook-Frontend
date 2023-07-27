import React, {SyntheticEvent} from "react"
import { TokenType, RespType } from "../Interfaces";
import { config } from "../config";
import axios from "axios";

export default function ProfilePictureForm(props: {user_id: string, setProfileForm: React.Dispatch<React.SetStateAction<any>>, profileForm: boolean}){
    // Reference to the form
    const formRef = React.useRef(null);

    // Error State of the form
    const [error, setError] = React.useState('');

    // Form Link State 
    const [link, setLink] = React.useState('');

    // Close form function
    function closeForm(e: SyntheticEvent){
        e.preventDefault();

        props.setProfileForm(false);

        setLink('');

    }

    // Async function to submit the form
    async function submitForm(e: SyntheticEvent){
        e.preventDefault();

        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(!token){
            return;
        } else {
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.put(
                    `${config.apiURL}/updateuser/`, 
                    {
                        id: token.user._id,
                        edit_type: 'pfp',
                        content: link,
                    },
                    {
                        headers: headers
                    });
                if(res.data.message == 'Success'){
                    setLink('');
                    props.setProfileForm(false);
                    setError('');

                    localStorage.setItem("token", JSON.stringify({token: token.token, user: {...token.user, 'profilePhoto': link}, time: Date.now() }));
                } else{
                    setError(res.data.message);
                }
            } catch (error){
                console.log(error);
            }
        }
    }

    // If the IsUser props changes, this function is called that adds an event listener to mousedown
    React.useEffect(() => {
        const formHandler = (e: SyntheticEvent) => {
            // If the formRef contains the event target, we change the setOpen for the form
            // The form closes when the user clicks anything outside of the form
            if(!formRef.current.contains(e.target)){
                props.setProfileForm(false);
            }
        }
        
        document.addEventListener('mousedown', formHandler);

        return () => {
            // Removes event listener on unmount
            document.removeEventListener('mousedown', formHandler)
        }
    }, [props.profileForm]);

    return (
        <div className={`post-form-popup-screen ${props.profileForm ? 'active' : 'inactive'}`}>
            <div className='post-form-popup' ref={formRef}>
                <form className='profile-pic-form'>
                    <h1>Change Profile Pic</h1>
                    <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_link</span><input placeholder='Profile Picture Link' id='link' onChange={(e) => {setLink(e.target.value)}}/></div>
                    <div className="form-error-post">{error}</div>
                    <div className='edit-form-buttons'>
                        <button className='form-button-cancel' onClick={closeForm}>Cancel</button>
                        <button className='form-button-save' onClick={submitForm}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}