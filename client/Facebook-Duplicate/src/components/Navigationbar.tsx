import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import React, { SyntheticEvent } from "react"
import {config} from "../config"
import { CSSTransition } from 'react-transition-group';


interface IsUser {
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    birthday: Date,
    accountCreationDate: string,
    password: string,
    bio: string,
    facebookid: string
}

export default function Navbar(props: {user: IsUser}){
    const [isFocus, setIsFocus] = React.useState(false)

    

    return (
        <div className="navbar">
            <ul className='nav-items'>
                <div className='nav-left'>
                    {!isFocus && <li className=".list-item"><Link to="/home"><img className="nav-app-icon" src="/facebookLogo.png"></img></Link></li>}
                    {!isFocus && <div className='search-glass-div'>
                        <span className="material-symbols-outlined searchIcon">search</span>
                    </div> }

                    <CSSTransition
                        in={isFocus}
                        className="arrow"
                        unmountOnExit
                    >
                        <div className="arrow">
                            <span className="material-symbols-outlined arrowIcon">arrow_back</span>
                        </div>
                    </CSSTransition>
                    <input className="nav-search-box" placeholder='Search Fakebook' onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)}/>
                </div>
                <li className=".list-item"></li>
                <li className=".list-item"></li>
            </ul>
        </div>
    )
}