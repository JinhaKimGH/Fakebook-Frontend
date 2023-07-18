import React, { SyntheticEvent } from 'react'

// Component which deals with the about section of a profile
export default function About(props: {gender: string, birthday: string, email: string, accountCreationDate: string, bio: string, numPosts:number}){
    // State for the selection of a tab on the about section
    const [selection, setSelection] = React.useState('Biography');

    // Function which changes the selection to the clicked tab
    function changeSelection(e: SyntheticEvent){
        const input = e.target as HTMLElement;
        setSelection(input.innerText);
    }
    
    return( 
    <div className='profile-about'>
        <div className='profile-about-left'>
            <h3>About</h3>
            <ul>
                {selection == 'Biography' ? <li className='selection-chosen'>Biography</li> : <li className='selection-not-chosen' onClick={changeSelection}>Biography</li>}
                {selection == 'Contact Info' ? <li className='selection-chosen'>Contact Info</li> : <li className='selection-not-chosen' onClick={changeSelection}>Contact Info</li>}
                {selection == 'Basic Info' ? <li className='selection-chosen'>Basic Info</li> : <li className='selection-not-chosen' onClick={changeSelection}>Basic Info</li>}
            </ul>
        </div>

        {selection == 'Biography' && 
            <div className='profile-about-right'>
                <h4>Biography</h4>
                <p className='contact-symbol'>{props.bio}</p>
            </div>
        }

        {selection == 'Contact Info' &&
            <div className='profile-about-right'>
                <h4>Contact Info</h4>
                <p className='contact-symbol'><span className="material-symbols-rounded about-button-icon">email</span>{props.email}</p>
                <p className='about-desc'>Email</p>
            </div>
        }

        {selection == 'Basic Info' &&
            <div className='profile-about-right'>
                <h4>Basic Info</h4>
                <p className='contact-symbol'>
                    {props.gender.toLowerCase() == 'male' ? <span className="material-symbols-rounded about-button-icon">man</span> : ""}
                    {props.gender.toLowerCase() == 'female' ? <span className="material-symbols-rounded about-button-icon">woman</span> : ""}
                    {props.gender.toLowerCase() !== 'male' && props.gender.toLowerCase() !== 'female' && <span></span>}
                    {props.gender}
                </p>
                <p className='about-desc'>Gender</p>
        
                <p className='contact-symbol'>
                    <span className="material-symbols-rounded about-button-icon">cake</span>
                    {new Date(props.birthday).toDateString()}
                </p>
                <p className='about-desc'>Birthday</p>
        
                <p className='contact-symbol'>
                    <span className="material-symbols-rounded about-button-icon">today</span>
                    {new Date(props.accountCreationDate).toDateString()}
                </p>
                <p className='about-desc'>Account Creation Date</p>
        
                <p className='contact-symbol'>
                    <span className='material-symbols-rounded about-button-icon'>format_list_numbered</span>
                    {`${props.numPosts} Posts`}
                </p>
                <p className='about-desc'>Total Number of Posts</p>
            </div>
        }

    </div>
    )
}