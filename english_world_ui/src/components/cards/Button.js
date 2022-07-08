import React from 'react';
import './cards.css';

function Button(props){

    return(
        <div>
            <button className='button'>{props.text}</button>
        </div>
    )
}

export default Button