import {Link} from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import {config} from "../config"
import { TokenType, RespType } from '../Interfaces'

// Function to fetch the side profiles under the functions tab in the homepage
export default function SideProfile(props: {image: string, text: string, id: string}){
    // Fetches the user from the backend api
    async function fetchUser(token: string) {
        try{
            const res : RespType = await axios.get(`${config.apiURL}/user/${props.id}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = res.data;
        } catch (err){
            console.log(err);
        }
    }
    
    // React effect that fetches the user if the image and text prop are not set (This would be when the sideprofile being displayed is not the logged in user)
    React.useEffect(() => {
        if(props.image == "" && props.text == ""){
            const tokenJSON = localStorage.getItem("token");
            const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
            if(token){
               void fetchUser(token.token);
            }
        }
    }, [])

    return(
        <Link to={`/user/${props.id}`} className="sideItem-profile">
            <li className='sideItem sideProfile'>
                <img className="sideProfile-image" src={props.image}/>
                <div className="sideProfile-text">{props.text}</div>
            </li>
        </Link>
    )
}