import React from "react"
import {useNavigate} from 'react-router-dom'
import Navbar from "./Navigationbar";
import SideItem from "./SideItem";
import SideProfile from "./SideProfile";
import { UserType, TokenType } from "../Interfaces";

// Homepage component
export default function Home(){
    // Used for the routing
    const history = useNavigate();

    // The user state, for the user that is currently logged in
    const [user, setUser] = React.useState<UserType>({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        birthday: "",
        accountCreationDate: "",
        password: "",
        bio: "",
        facebookid: "",
        friends: [],
        profilePhoto: "",
        posts: []
    });

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            setUser(token.user)
        }
    }, [])

    return (
        <div className="homepage">
            <Navbar user={user} home={'home'}/>
            <div className="home-items">
                <div className="home-options">
                    <SideProfile image={user.profilePhoto} text={`${user.firstName} ${user.lastName}`} id={`${user._id}`}/>
                    <SideItem icon={"group"} text="Friends" link="/friends"/>
                </div>
                <div className="home-feed">

                </div>
                <div className="home-contact-list">
                    {user.friends.map((friend) => <SideProfile image="" text="" id={friend} />)}
                </div>
            </div>
        </div>
    )
}

// TODO: Create a Nav bar, routed to all the facebook stuff, and style the home page