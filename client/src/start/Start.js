import { useState } from 'react';
import './Start.css';
import Peg from '../peg/Peg';
import Feedback from '../peg/Feedback';

/**
 * This component is a start start point
 * to the players, so they can start playing
 * with someone
 */
function Start() {

    const [code, setCode] = useState('yeah');
    const [message, setMessage] = useState('');

    function onChange(event) {
        setCode(event.target.value);
    }

    /**
     * Starts the game with the code,
     * that is used to connect with other player
     * with websockets
     */
    function startGame() {
        if (code.length === 0) {
            setMessage('The code cannot be empty');
        } else {
            setMessage('');
        }
    }

    return (
        <>
            <p>Enter a code to play with someone</p>
            <input type='text' name="code" value={code} onChange={onChange} className="code-input"></input>
            <button className="code-button" onClick={startGame}>click me</button>
            <p className='message'>{message}</p>
        </>
    )
}

export default Start;