import { useNavigate } from 'react-router-dom';

/**
 * ErrorPage Component
 * 
 * @param {Object} props - The component props.
 * @returns {JSX.Element} A React JSX element representing the ErrorPage component, pops up when the API call encounters an error
 */
export default function ErrorPage(props: {isApiErr: boolean}): JSX.Element{
     // Used to navigate routes
     const history = useNavigate();

     // Function to go back to the previous page
     function goBack(){
        history(-1);
     }

    return (
        <div className='error-page'>
            <h2><span className="material-symbols-rounded error-icon">build</span>Sorry, something went wrong.</h2>
            {props.isApiErr ? <div className='error-msg'><span className="material-symbols-rounded error-icon">Warning</span><p>Error with the API</p></div> : <div className='error-msg'><span className="material-symbols-rounded error-icon">Error</span><h1>404 error </h1></div>}
            {!props.isApiErr && <h3>This page doesn't exist.</h3>}
            <div className='error-back-button' onClick={goBack}>Go Back</div>
        </div>
    )
}