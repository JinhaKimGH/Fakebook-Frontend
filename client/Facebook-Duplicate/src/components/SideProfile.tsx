import {Link} from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import {config} from "../config"

interface IsUser {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    birthday: Date,
    accountCreationDate: string,
    password: string,
    bio: string,
    facebookid: string,
    friends: Array<string>,
    profilePhoto: string
}

interface Token {
    user: IsUser,
    token: string,
    message: string,
}

interface Response {
    data: IsUser
}

export default function SideProfile(props: {image: string, text: string, id: string}){
    async function fetchUser(token: string) {
        try{
            const res : Response = await axios.get(`${config.apiURL}/user/${props.id}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            const data : IsUser = res.data;
        } catch (err){
            console.log(err);
        }
    }
    
    React.useEffect(() => {
        if(props.image == "" && props.text == ""){
            const tokenJSON = localStorage.getItem("token");
            const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;
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