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
        facebookId: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1",
        posts: [],
        outGoingFriendRequests: [],
        savedPosts: [],
    });

    // State that determines the number of posts to be loaded
    const [postCount, setPostCount] = React.useState(0);

    // The state to determine if posts are being loaded from the api
    const [postLoading, setPostLoading] = React.useState(false);

    // State to determine if birthdays are being loaded from the api
    const [birthdayLoading, setBirthdayLoading] = React.useState(false);

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
            setUser(token.user);
            void getPosts();
            void getBirthdays();
        }
    }, [])

    // Async function that retrives the posts for the homepage (friends + user), that are sorted by date
    async function getPosts(){
        if(postLoading){
            return;
        }
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                // Sets loading state to true before api call
                setPostLoading(true);
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/gethomeposts/${token.user._id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the posts state array if the api call was successful
                    setPosts(res.data.posts);

                    // Sets loading state to false after api call
                    setPostLoading(false);
                }
            } catch (err){
                // Sets loading state to false after api call
                setPostLoading(false);
                // If error, re-directs to error page
                history('/error');
            }
        }
    }

    // Async function that retrieves the birthdays
    async function getBirthdays(){
        if(birthdayLoading){
            return;
        }
        const tokenJSON = localStorage.getItem('token');
        const token: TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;

        if(token){
            try{
                // Sets loading state to true before api call
                setBirthdayLoading(true);
                const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`}
                const res : RespType = await axios.get(
                    `${config.apiURL}/birthdays/${token.user._id}`, 
                    {
                        headers: headers
                    });

                if(res.data.message == 'Success'){
                    // Sets the posts state array if the api call was successful
                    setBirthdays(res.data.users);
                    // Sets loading state to false after api call
                    setBirthdayLoading(false);
                } 
            } catch (err){
                // Sets loading state to false after api call
                setBirthdayLoading(false);
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
                    {/* If the posts are loading, or the count state is less than the length of the array the loading gif is displayed */}
                    {(postLoading || postCount < posts.length) && 
                        <div className='post-loading-container'><img src='loading.gif' className='post-loading'/></div>
                    }
                    {posts.length > 0 &&
                        posts.map((post) => <Post post={post} key={post._id} style={'home'} display={postCount >= posts.length} setPostCount={setPostCount} />)
                    }
                </div>
                {/* The right side contains the user's friends and today's birthdays */}
                <div className="home-contact-list">
                    <div className='contact-birthdays'>
                        <h4>Today's Birthdays</h4>
                        {birthdayLoading && <div className='loading-birthdays'><img src='loading.gif' className='birthday-loading'/></div>}
                        {birthdays.map((friend) => <SideProfile image="" text="" id={friend._id} key={friend._id}/>)}
                    </div>
                    <h4>Friends</h4>
                    {user.friends.map((friend) => <SideProfile image="" text="" id={friend} key={friend}/>)}
                </div>
            </div>
        </div>
    )
}