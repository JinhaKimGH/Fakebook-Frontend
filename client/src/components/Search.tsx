import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from './Navigationbar';
import { UserType, RespType, TokenType } from '../Interfaces';
import axios from 'axios';
import { config } from '../config';
import SearchResultContainer from './SearchResultContainer';

/**
 * Search Component
 *  
 * @returns {JSX.Element} A React JSX element representing the Search Component, displays the search results
*/
export default function Search(): JSX.Element{
    // Changes words to uppercase for the first character
    function titleCase(str: string) {
        const splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }

    // Finds the id of the user from the url
    const name : string  = titleCase(useParams().name || '');

    // State for loading time for the comment to send
    const [loading, setLoading] = React.useState(false);

    // Used for routing
    const history = useNavigate();

    // User State
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
        savedPosts: []
    });

    // The users state, an array of users that were found from the search
    const [users, setUsers] = React.useState<Array<UserType>>([]);

    // Async function that gets the search results from the backend
    async function getUsers(token: string){
        if(loading){
            return;
        }

        try{
            // Sets loading state to true before calling the api
            setLoading(true);
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
            const res : RespType = await axios.get(
                `${config.apiURL}/searchusers/${name}`, 
                {
                    headers: headers
                });
            
            if(res.data.message == 'Success'){
                setUsers(res.data.users);
                // Sets loading state to false after api call
                setLoading(false);
            }
        } catch (err){
            // Sets loading state to false after api call
            setLoading(false);
            // If error, re-directs to error page
            history('/error');
        }
    }

    // If there is no token saved, go to login automatically, called on mount
    React.useEffect(() => {
        const tokenJSON = localStorage.getItem("token");
        const token : TokenType | null = tokenJSON ? JSON.parse(tokenJSON) as TokenType : null;
        if (!token) {
            history("/");
        } else{
           setUser(token.user);
           void getUsers(token.token);
        }
    }, [name])

    return(
        <div className='searchpage'>
            <Navbar user={user} home={'Neither'}/>
            {/* Displays search results & maps them into the SearchResultsContainer component */}
            {users.length > 0 && <h4 className='search-results-title'>Search results for "{name}"</h4>}
            {users.length == 0 && !loading && <h4 className='search-results-title'>No results for "{name}"</h4>}
            {loading && <img src='/loading.gif' className='search-result-loading'/>}

            <div className='results-container'>
                {users.map((user: UserType) => <SearchResultContainer user={user} key={user._id}/>)}
            </div>
        </div>
    )
}