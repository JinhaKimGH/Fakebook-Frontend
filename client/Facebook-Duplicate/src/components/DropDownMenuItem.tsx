import {Link} from 'react-router-dom'

// Component for items in the dropdown menu when you click the profile picture in the top right
export default function DropDownMenuItem(props: {icon: string, text: string, link: string}){
    return(
        <Link to={props.link} className="dropdownItem-link">
            <li className='dropdownItem'>
                <span className="material-symbols-rounded dropdown-item-icon"> {props.icon} </span>
                <div className="dropdown-item-text">{props.text}</div>
            </li>
        </Link>
    )
}