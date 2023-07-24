import {Link} from 'react-router-dom'

// Component for the items on the side of the homepage screen
export default function SideItem(props: {icon: string, text: string, link: string}){
    return(
        <Link to={props.link} className="sideItem-link">
            <li className='sideItem'>
                <span className="material-symbols-rounded sideItem-icon"> {props.icon} </span>
                <div className="sideItem-text">{props.text}</div>
            </li>
        </Link>
    )
}