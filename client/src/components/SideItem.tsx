import {Link} from 'react-router-dom'

/**
 * SideItem Component
 *  
 * @param {Object} props - The component props.
 * @param {string} props.icon - The icon displayed next to the side item
 * @param {string} props.text - The name of the side item
 * @param {string} props.link - The link of the side item
 * @returns {JSX.Element} A React JSX element representing the SideItem Component, a sideItem on the homepage
*/
export default function SideItem(props: {icon: string, text: string, link: string}): JSX.Element{
    return(
        <Link to={props.link} className="sideItem-link">
            <li className='sideItem'>
                <span className="material-symbols-rounded sideItem-icon"> {props.icon} </span>
                <div className="sideItem-text">{props.text}</div>
            </li>
        </Link>
    )
}