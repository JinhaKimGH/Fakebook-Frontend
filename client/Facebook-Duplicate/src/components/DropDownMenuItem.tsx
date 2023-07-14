import {Link} from 'react-router-dom'
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