import React from "react"
import {useLocation, useNavigate} from 'react-router-dom'
import axios from "axios"
import Navbar from "./Navigationbar";

interface IsUser {
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    birthday: Date,
    accountCreationDate: string,
    password: string,
    bio: string,
    facebookid: string
}

interface Token {
    user: IsUser,
    token: string,
    message: string,
}

// Homepage component
export default function Home(){
    const location = useLocation();
    const history = useNavigate();
    const [user, setUser] = React.useState({});

    // If there is no token saved, go to login automatically
    React.useEffect(() => {
        const token : Token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            history("/");
        } else{
            setUser(token.user)
        }
    }, [])

    return (
        <div className="homepage">
            <Navbar user={user}/>
        </div>
    )
}

// TODO: Create a Nav bar, routed to all the facebook stuff, and style the home page