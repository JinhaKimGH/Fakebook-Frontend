import React from "react"
import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from "./Navigationbar";
import SideItem from "./SideItem";
import SideProfile from "./SideProfile";

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
    profilePhoto: string
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
    const [user, setUser] = React.useState<IsUser>({
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
        profilePhoto: ""
    });

    // If there is no token saved, go to login automatically
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;
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