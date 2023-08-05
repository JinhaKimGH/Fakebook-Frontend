import {Link} from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import {config} from "../config"
import { useNavigate } from "react-router-dom";
import { TokenType, RespType, UserType } from '../Interfaces'

/**
 * SideProfile Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.image - The image link
 * @param {string} props.text - The text of the side profile
 * @param {string} props.id - The id of the user relevant to the side profile
 * @returns {JSX.Element} A React JSX element representing the SideProfile Component, the side profiles in the homepage
*/
export default function SideProfile(props: {image: string, text: string, id: string}): JSX.Element{
    // Used for the routing
    const history = useNavigate();

    // The profile state, an object of the user's info
    const [profile, setProfile] = React.useState<UserType>();

    // Fetches the user from the backend api
    async function fetchUser(token: string) {
        try{
            const res : RespType = await axios.get(`${config.apiURL}/user/${props.id}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            // Sets profile state if successful
            if(res.data.message == 'Success'){
                setProfile(res.data.user);
            }
        } catch (err){
            // If error, re-directs to error page
            history('/error');
        }
    }
    
    // React effect that fetches the user if the image and text prop are not set (This would be when the sideprofile being displayed is not the logged in user)
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if(token){
            // Fetches user if image and text props not given, otherwise sets it to profile state
            if(props.image == "" && props.text == ""){
                void fetchUser(token.token);
            } else{
                setProfile(token.user)
            }
        }
    }, [])

    return(
        <Link to={`/user/${props.id}`} className="sideItem-profile">
            <li className='sideItem sideProfile'>
                <img className="sideProfile-image" src={profile ?  profile.profilePhoto : props.image}/>
                <div className="sideProfile-text">{profile ? `${profile.firstName} ${profile.lastName}` : props.text}</div>
            </li>
        </Link>
    )
}