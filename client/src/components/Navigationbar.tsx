import { useNavigate, Link } from "react-router-dom";
import React from "react"
import {UserType} from '../Interfaces'

/**
 * Navbar Component
 *  
 * @param {Object} props - The component props.
 * @param {UserType} props.user - The user object containing the user information of the profile you are on
 * @param {string} props.home - Indicates whether the user is on the homepage, friends page or neither
 * @returns {JSX.Element} A React JSX element representing the Navbar Component, the navbar component of the website
*/
export default function Navbar(props: {user: UserType,  home: string}): JSX.Element{

    // State for opening and closing the dropdown menu
    const [open, setOpen] = React.useState(false);

    // Reference to the drop-down menu
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Used for the routing
    const history = useNavigate();

    // Clears the token from local storage, logs the user out
    function logout() {
        localStorage.clear();
        history('/')
    }

    // If the component is loaded, this function is called that adds an event listener to mousedown

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            // If the menuRef contains the event target, we change the setOpen for the menu
            // The menu closes when the user clicks anything outside of the menu
            if(menuRef.current && !menuRef.current.contains(e.target as Node)){
                setOpen(false)
            }
        }

        // Searches for user when searching in searchbar
        const keyPress = (e: KeyboardEvent) => {
            if(e.key == 'Enter'){
                e.preventDefault();
                const input = (document.getElementById("nav-search") as HTMLInputElement).value;
                // Redirects to search results with the search input in the url
                history('/search_results/' +  input);
            } 
        };

        document.addEventListener("mousedown", handler);

        const input = document.getElementById("nav-search") as HTMLInputElement;

        input.addEventListener('keypress', keyPress)

        // On unmount, removes the event listener for the handler and keypress
        return () => {
            document.removeEventListener('mousedown', handler)
            input.removeEventListener('keypress', keyPress)
        }
    }, [])


    return (
        <div className="navbar">
            <ul className='nav-items'>
                {/* Left side of the nav, contains the app icon that links to home, and the search bar */}
                <div className='nav-left'>
                     <li className="nav-list-item"><Link to="/home"><img className="nav-app-icon" src="facebookLogo.png"></img></Link></li>
                    <div className='search-glass-div'>
                        <span className="material-symbols-outlined searchIcon">search</span>
                    </div> 
                    <input id='nav-search' className="nav-search-box" placeholder='Search for People'/> 
                </div>
                {/* Middle of the navbar contains links to the homepage and friends page */}
                <div className='nav-middle'>
                    {props.home == 'home' ? <Link to="/home" className="nav-link"><div className='selected-container'><span className="material-symbols-rounded nav-item-selected">home</span></div></Link> : <Link to="/home" className="nav-link"><div className='unselected-container'><span className="material-symbols-rounded nav-item-unselected">home</span></div></Link>}
                    {props.home == 'friends' ? <Link to="/friends" className="nav-link"><div className='selected-container'><span className="material-symbols-outlined nav-item-selected">group</span></div></Link> : <Link to="/friends" className="nav-link"><div className='unselected-container'><span className="material-symbols-outlined nav-item-unselected">group</span></div></Link>}
                </div>
                {/* Right side of the nav, contains a dropdown menu */}
                <div className='nav-right' ref={menuRef}>
                    {/* If the user clicks the profile picture the dropdown menu appears */}
                    <div className='menu-container'>
                        <div className='menu-trigger' onClick={() => {setOpen(!open)}}>
                            <img src={props.user.profilePhoto} className="nav-profile-photo"></img>
                        </div>
                        {/* Dropdown menu has links to the user's page and a logout link */}
                        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                            <h3>Menu</h3>
                            <ul>
                                <Link to={`/user/${props.user._id}`} className='dropdownItem-link'>
                                    <div className='nav-profile'>
                                        <img src={props.user.profilePhoto} className="dropdown-profile-photo"></img>
                                        <p className='nav-name'>{`${props.user.firstName} ${props.user.lastName}`}</p>
                                    </div>
                                </Link>
                                {props.user.email !== "guest@email.com" && <Link to={`/deleteUser`} className='dropdownItem-link'>
                                    <li className='dropdownItem'>
                                        <span className="material-symbols-rounded dropdown-item-icon"> delete </span>
                                        <div className="dropdown-item-text">Delete Account</div>
                                    </li>
                                </Link>}
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