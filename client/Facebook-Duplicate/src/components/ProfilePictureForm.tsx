import React, {SyntheticEvent} from "react"
import { TokenType, RespType } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import axios from "axios";

/**
 * ProfilePictureForm Component
 *  
 * @param {Object} props - The component props.
 * @param {boolean} props.user_id - The id of the user.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setProfileForm - A function that sets the profileForm state
 * @param {boolean} props.profileForm - Flags whether the profileForm is open or not
 * @returns {JSX.Element} A React JSX element representing the ProfilePictureForm Component, a form for the user to update their profile picture
*/
export default function ProfilePictureForm(props: {user_id: string, setProfileForm: React.Dispatch<React.SetStateAction<boolean>>, profileForm: boolean}): JSX.Element{
    // Used for the routing
    const history = useNavigate();

    // State for loading time for the comment to send
    const [loading, setLoading] = React.useState(false);

    // Reference to the form
    const formRef = React.useRef<HTMLDivElement>(null);

    // Error State of the form
    const [error, setError] = React.useState('');

    // Form Link State 
    const [link, setLink] = React.useState('');

    // Close form function, sets the profileForm state to false, resets in the link state
    function closeForm(e: SyntheticEvent){
        e.preventDefault();

        props.setProfileForm(false);

        setLink('');

    }

    // Async function to submit the form
    async function submitForm(){
        // Don't call the api if it is already loading
        if(loading){
            return;
        }

        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(!token){
            return;
        } else {
            try{
                // Sets the loading state before the api call
                setLoading(true);
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
                // If successful, the link and error states are reset and the profileform is set to false, (closes the form)
                if(res.data.message == 'Success'){
                    setLink('');
                    props.setProfileForm(false);
                    setError('');
                    // Sets loading state to false after api call
                    setLoading(false);
                    localStorage.setItem("token", JSON.stringify({token: token.token, user: {...token.user, 'profilePhoto': link}, time: Date.now() }));
                } else{
                    // Sets loading state to false after api call
                    setLoading(false);
                    // Otherwise sets the error message
                    setError(res.data.message);
                }
            } catch (error){
                // Sets loading state to false after api call
                setLoading(false);
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // If the IsUser props changes, this function is called that adds an event listener to mousedown
    React.useEffect(() => {
        const formHandler = (e: MouseEvent) => {
            // If the formRef contains the event target, we change the setOpen for the form
            // The form closes when the user clicks anything outside of the form
            if(formRef.current && !formRef.current.contains(e.target as Node)){
                props.setProfileForm(false);
            }
        }
        
        document.addEventListener('mousedown', formHandler);

        return () => {
            // Removes event listener on unmount
            document.removeEventListener('mousedown', formHandler)
        }
    }, [props.profileForm]);

    // Work-around to ensure a void return is provided to the Onclick attribute instead of a promise
    const handleSubmitOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        void submitForm();
    }

    // Dummy Submit on click that only prevents default event of the form, is used when the api call is loading
    const handleDummyOnClick = (e: SyntheticEvent) => {
        e.preventDefault();
        return;
    }

    return (
        <div className={`post-form-popup-screen ${props.profileForm ? 'active' : 'inactive'}`}>
            <div className='post-form-popup' ref={formRef}>
                {/* Profile pic form change, that pops up when activated */}
                <form className='profile-pic-form'>
                    <h1>Change Profile Pic</h1>
                    <div className='post-form-icon'><span className="material-symbols-rounded about-button-icon">add_link</span><input placeholder='Profile Picture Link' id='link' onChange={(e) => {setLink(e.target.value)}}/></div>
                    <div className="form-error-post">{error}</div>
                    <div className='edit-form-buttons'>
                        {loading ? <button className='form-button-cancel disabled' onClick={handleDummyOnClick}>Cancel</button> : <button className='form-button-cancel' onClick={closeForm}>Cancel</button>}
                        {loading ? <button className='form-button-save disabled' onClick={handleDummyOnClick}><img src='/loading.gif' className='about-property-loading'/></button>: <button className='form-button-save' onClick={handleSubmitOnClick}>Submit</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}