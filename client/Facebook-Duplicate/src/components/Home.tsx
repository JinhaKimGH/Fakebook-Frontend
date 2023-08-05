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

/**
 * Home Component
 *  
 * @returns {JSX.Element} A React JSX element representing the Home Component, the home page of Fakebook
*/
export default function Home(): JSX.Element{
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

    // State for today's birthdays
    const [birthdays, setBirthdays] = React.useState<Array<UserType>>([]);

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
            // If the token exists, sets the user, gets homepage posts and gets list of birthdays
            setUser(token.user)
            void getPosts();
            void getBirthdays();
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
                }
            } catch (err){
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Async function that retrieves the birthdays
    async function getBirthdays(){
        const tokenJSON = localStorage.getItem('token');
        const token: TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/birthdays/${token.user._id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the posts state array if the api call was successful
                    setBirthdays(res.data.users);
                } 
            } catch (err){
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    return (
        <div className="homepage">
            <Navbar user={user} home={'home'}/>
            {/* The left side of the home page displays the logged-on user's profile, that the user can click on, adn a side item that redirects them to the friend page */}
            <div className="home-items">
                <div className="home-options">
                    <SideProfile image={user.profilePhoto} text={`${user.firstName} ${user.lastName}`} id={`${user._id}`}/>
                    <SideItem icon={"group"} text="Friends" link="/friends"/>
                </div>
                {/* The middle, the home-feed contains the create post component and the homepage posts */}
                <div className="home-feed">
                    <CreatePost user={user} isUser={true} setUser={setUser}/>
                    {posts.length > 0 &&
                        posts.map((post) => <Post user_id={post.user} id={post._id} key={post._id} style={'home'}/>)
                    }
                </div>
                {/* The right side contains the user's friends and today's birthdays */}
                <div className="home-contact-list">
                    <div className='contact-birthdays'>
                        <h4>Today's Birthdays</h4>
                        {birthdays.map((friend) => <SideProfile image="" text="" id={friend._id} key={friend._id}/>)}
                    </div>
                    <h4>Friends</h4>
                    {user.friends.map((friend) => <SideProfile image="" text="" id={friend} key={friend}/>)}
                </div>
            </div>
        </div>
    )
}