import React from 'react'
import Post from './Post';
import About from './About';
import CreatePost from './CreatePost';
import {UserType} from '../Interfaces'

// The bottom half of the user's profile, shows the posts, about section, and friends
export default function ProfileFeedContainer(props: {tab: string, user: UserType, isUser: boolean, setUser: React.Dispatch<React.SetStateAction<any>>}){
    
    return (
        <div>
            {(props.tab == 'Posts' && props.isUser) ?
                <CreatePost user={props.user} isUser={props.isUser} setUser={props.setUser}/>
            : ''}
            {props.tab === 'Posts' ? (
                props.user && props.user.posts && props.user.posts.length !== 0 ? (
                    [...props.user.posts].reverse().map((post: string) => <Post user_id={props.user._id} id={post} key={post} />)
                ) : null
            ) : null}
            {props.tab == 'About' ? <About setUser={props.setUser} user={props.user} isUser={props.isUser}/> : ''}
        </div>
    )

}
