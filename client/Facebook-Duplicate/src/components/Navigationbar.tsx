import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import React, { SyntheticEvent } from "react"
import {config} from "../config"
import { CSSTransition } from 'react-transition-group';
import DropDownMenuItem from "./DropDownMenuItem";
import {UserType} from '../Interfaces'

// TODO: SOMETHING ON SUBMIT

export default function Navbar(props: {user: UserType,  home: string}){

    // State for opening and closing the dropdown menu
    const [open, setOpen] = React.useState(false);

    // Reference to the drop-down menu
    const menuRef = React.useRef(null);

    const history = useNavigate();

    // Clears the token from local storage
    function logout() {
        localStorage.clear();
        history('/')
    }

    // If the component is loaded, this function is called that adds an event listener to mousedown

    React.useEffect(() => {
        const handler = (e: SyntheticEvent) => {
            // If the menuRef contains the event target, we change the setOpen for the menu
            // The menu closes when the user clicks anything outside of the menu
            if(!menuRef.current.contains(e.target)){
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener('mousedown', handler)
        }
    }, [])


    return (
        <div className="navbar">
            <ul className='nav-items'>
                <div className='nav-left'>
                     <li className=".list-item"><Link to="/home"><img className="nav-app-icon" src="/facebookLogo.png"></img></Link></li>
                    <div className='search-glass-div'>
                        <span className="material-symbols-outlined searchIcon">search</span>
                    </div> 
                    <input className="nav-search-box" placeholder='Search Fakebook'/> 
                </div>
                <div className='nav-middle'>
                    {props.home == 'home' ? <Link to="/home" className="nav-link"><div className='selected-container'><span className="material-symbols-rounded nav-item-selected">home</span></div></Link> : <Link to="/home" className="nav-link"><div className='unselected-container'><span className="material-symbols-rounded nav-item-unselected">home</span></div></Link>}
                    {props.home == 'friends' ? <Link to="/home" className="nav-link"><div className='selected-container'><span className="material-symbols-outlined nav-item-selected">group</span></div></Link> : <Link to="/friends" className="nav-link"><div className='unselected-container'><span className="material-symbols-outlined nav-item-unselected">group</span></div></Link>}
                </div>
                <div className='nav-right' ref={menuRef}>
                    <div className='menu-container'>
                        <div className='menu-trigger' onClick={() => {setOpen(!open)}}>
                            <img src={props.user.profilePhoto} className="nav-profile-photo"></img>
                        </div>

                        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                            <h3>Menu</h3>
                            <ul>
                                <Link to={`/user/${props.user._id}`} className='dropdownItem-link'>
                                    <div className='nav-profile'>
                                        <img src={props.user.profilePhoto} className="dropdown-profile-photo"></img>
                                        <p className='nav-name'>{`${props.user.firstName} ${props.user.lastName}`}</p>
                                    </div>
                                </Link>
                                <DropDownMenuItem icon="edit" text="Post" link="/post"></DropDownMenuItem>
                                <DropDownMenuItem icon="settings" text="Settings" link='/settings'></DropDownMenuItem>
                                <div className="dropdownItem-link" onClick={logout}>
                                    <li className='dropdownItem'>
                                        <span className="material-symbols-rounded dropdown-item-icon"> logout </span>
                                        <div className="dropdown-item-text">Log Out</div>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </div>


                </div>
            </ul>
        </div>
    )
}