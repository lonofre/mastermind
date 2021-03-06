import './Home.css';
import Codemaker from '../game/Codemaker';
import Codebreaker from '../game/Codebreaker';
import { codeMessage } from './message';
import { useEffect, useState } from 'react';

const PORT = 4000;
const url = `ws:localhost:${PORT}`;
const websocket = new WebSocket(url);

/**
 * This component is a start start point
 * to the players, so they can start playing
 * with someone
 */
function Home() {   

    // The code used to join to a game
    const [roomCode, setRoomCode] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    // Used to asign the component after the code was sent
    const [role, setRole] = useState('');

    useEffect(()=> {
        websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if(message.messageType === 'role')
                setRole(message.data.role);
        });
    });
    
    
    // This is shown after a room code 
    // was introduced successfully
    if(gameStarted && role){
        return (
            <div>
                <p>Room <b>{roomCode}</b></p>
                { role === 'codemaker' ?
                  <Codemaker websocket={websocket} /> :
                  <Codebreaker websocket={websocket} />
                }
            </div>
        );
    }

    function startGame(){
        if(roomCode && !gameStarted){
            setGameStarted(true);
            websocket.send(codeMessage(roomCode));
        }
    }

    function changeRoomCode(event){
        const value = event.target.value;
        setRoomCode(value);
    }

    let buttonClass = 'code-button';
    if (roomCode.length === 0) buttonClass += ' deactivate';

    return (
        <div className='room'>
            <div>
                <input type="text" className='room' 
                       onChange={changeRoomCode} 
                       placeholder='ENTER A CODE TO JOIN' />
            </div>
            <div>
                <button className={buttonClass} 
                        onClick={startGame}>Start to play</button>
            </div>  
        </div>
    );
}

export default Home;