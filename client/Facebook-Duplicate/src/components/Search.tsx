import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from './Navigationbar';
import { UserType, RespType, TokenType } from '../Interfaces';
import axios from 'axios';
import { config } from '../config';
import SearchResultContainer from './SearchResultContainer';

// Search Results from the navbar
export default function Search(){
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
        facebookid: "",
        friends: [],
        friendRequests: [],
        profilePhoto: "",
        posts: [],
        outGoingFriendRequests: []
    });

    const [users, setUsers] = React.useState<Array<UserType>>([]);

    async function getUsers(token: string){
        try{
            const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
            const res : RespType = await axios.get(
                `${config.apiURL}/searchusers/${name}`, 
                {
                    headers: headers
                });
            
            if(res.data.message == 'Success'){
                setUsers(res.data.users);
            } else {
                console.log(res.data.message);
            }
        } catch (err){
            console.log(err);
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
        <div className='homepage'>
            <Navbar user={user} home={'Neither'}/>

            {users.length > 0 && <h4 className='search-results-title'>Search results for "{name}"</h4>}
            {users.length == 0 && <h4 className='search-results-title'>No results for "{name}"</h4>}

            <div className='results-container'>
                {users.map((user: UserType) => <SearchResultContainer user={user} key={user._id}/>)}
            </div>
        </div>
    )
}