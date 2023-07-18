import axios from 'axios'
import {config} from "../config"
import React from 'react'
import Post from './Post';
import About from './About';
import CreatePost from './CreatePost';
import { useNavigate } from 'react-router-dom'

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
    profilePhoto: string,
    posts: Array<string>
}

interface Token {
    user: IsUser,
    token: string,
    message: string,
}

interface Post {
    _id: string,
    user: string,
    text: string,
    link: string
    postTime: string,
    comments: Array<string>,
    image: string,
    likes: Array<string>
}

interface Response {
    data: Data
}

interface Data{
    message: string,
    posts: Array<Post>
}

// The bottom half of the user's profile, shows the posts, about section, and friends
export default function ProfileFeedContainer(props: {tab: string, user: IsUser, isUser: boolean}){
    // State for the array of posts
    const [posts, setPosts] = React.useState<Array<Post>>([]);

    const history = useNavigate();

    // Fetches the posts from the user
    async function fetchPosts(token : string) {
        try{
            const res : Response = await axios.get(`${config.apiURL}/getposts/${props.user._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if(res.data.message == 'User Not Found.'){
                history('/home')
            }
            if(res.data.message == 'Posts Not Found'){
                return
            } if(res.data.message == 'Success'){
                setPosts(res.data.posts);
            }
            
        
        } catch (err) {
            console.log(err);
        }
    }

    // Fetches the post when the 'posts' tab is selected
    React.useEffect(() => {
        if(props.tab == 'Posts'){
            const tokenJSON = localStorage.getItem("token");
            const token : Token | null = tokenJSON ? JSON.parse(tokenJSON) as Token : null;
            if(token){
                void fetchPosts(token.token);
            }
        }
    }, [props.tab, props.user]);

    return (
        <div>
            {(props.tab == 'Posts' && props.isUser) ?
                <CreatePost user={props.user} isUser={props.isUser}/>
            : ''}
            {props.tab == 'Posts' ? (posts.length == 0 ? '' : posts.map((post) => <Post user={props.user} post={post} key={post._id}/> )) : ''}
            {props.tab == 'About' ? <About gender={props.user.gender} birthday={props.user.birthday} email={props.user.email} accountCreationDate={props.user.accountCreationDate} bio={props.user.bio} numPosts={props.user.posts.length}/> : ''}
        </div>
    )

}

// CHANGE POST to not include that many props, but instead, an object of props