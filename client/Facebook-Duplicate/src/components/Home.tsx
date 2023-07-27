import React from "react"
import {useNavigate} from 'react-router-dom'
import Navbar from "./Navigationbar";
import SideItem from "./SideItem";
import SideProfile from "./SideProfile";
import CreatePost from "./CreatePost";
import axios from "axios";
import Post from "./Post";
import { config } from "../config";
import { UserType, TokenType, RespType, PostType } from "../Interfaces";

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
        friendRequests: [],
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: []
    });

    // State for the posts that appear in the home page, limited to the 50 most recent posts
    const [posts, setPosts] = React.useState<Array<PostType>>([]);

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            setUser(token.user)
            void getPosts();
        }
    }, [])

    // Async function that retrives the posts for the homepage (friends + user), that are sorted by date
    async function getPosts(){
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/gethomeposts/${token.user._id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the posts state array if the api call was successful
                    setPosts(res.data.posts);
                } else {
                    console.log(res.data.message);
                }
            } catch (err){
                console.log(err);
            }
        }
    }

    return (
        <div className="homepage">
            <Navbar user={user} home={'home'}/>
            <div className="home-items">
                <div className="home-options">
                    <SideProfile image={user.profilePhoto} text={`${user.firstName} ${user.lastName}`} id={`${user._id}`}/>
                    <SideItem icon={"group"} text="Friends" link="/friends"/>
                </div>
                <div className="home-feed">
                    <CreatePost user={user} isUser={true} setUser={setUser}/>
                    {posts.length > 0 &&
                        posts.map((post) => <Post user_id={post.user} id={post._id} key={post._id}/>)
                    }
                </div>
                <div className="home-contact-list">
                    {user.friends.map((friend) => <SideProfile image="" text="" id={friend} />)}
                </div>
            </div>
        </div>
    )
}