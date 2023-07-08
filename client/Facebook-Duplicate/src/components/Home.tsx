import React from "react"
import {useLocation, useNavigate} from 'react-router-dom'
import axios from "axios"

export default function Home(){
    const location = useLocation();
    const [user, setUser] = React.useState({});
    
    async function getUser(){
        try{
            await axios.get("http://localhost:3000/", {
                withCredentials: true,
            })
            .then(res => console.log(res))
            .catch(e => {console.log(e)})
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        void getUser();
    }, [])

    return (
        <div className="homepage">
            <h1>Hello {user.email} and welcome to the homepage.</h1>
        </div>
    )
}