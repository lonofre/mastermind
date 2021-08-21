import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import PegList from "../peg/PegList";
import './Codemaker.css';

/**
 * Creates the code and provide feedback
 * to the other player
 */
function Codemaker({ websocket }) {

    /**
     * The code is an array of colors:
     * ['blue', 'green', ...]
     */
    const [code, setCode] = useState([]);
    // Whether the code created by the codemaker was sent,
    // so the content can change
    const [alreadySent, setAlreadySent] = useState(false);
    // Indicates if the codebreaker has joined the game
    const [playerConnected, setPlayerConnected] = useState(false);
    const numAttempts = 10;


    useEffect(() => {
        websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if(message.messageType === 'connection'){
                setPlayerConnected(true);
            }
        });
    });

    // Mock data
    const attemps = [
        ['blue', 'red', 'blue', 'red'],
        ['orange', 'red', 'blue', 'red'],
        ['blue', 'red', 'green', 'red']
    ]

    function createCode() {
        if (code && playerConnected) {
            setAlreadySent(true);
            websocket.send(messageGameReady());
        } else if(!playerConnected){
            console.log('Wait for the other player 😠 ');
        }
    }


    let buttonClass = 'code-button';
    if (code.length === 0) buttonClass += ' deactivate';

    if (!alreadySent) {
        return (
            <div>
                <h2>You're the <span className='codemaker'>Codemaker</span></h2>
                <p>Create a code</p>
                <PegSelector numOfPegs={4} updatePegs={(pegs) => setCode(pegs)} />
                <button onClick={createCode} className={buttonClass} >Create code</button>
            </div>
        );
    }

    const pegLists = attemps.map((attemp, index) =>
        <PegList colors={attemp} isSmall={true} key={index} />
    );

    function attempsToWin(){
        return numAttempts - attemps.length;
    }

    return (
        <>
            <h2>You're the <span className='codemaker'>Codemaker</span></h2>
            <div>
                <p>Your CODE (don't share it)</p>
                <PegList colors={code} isSmall={false} />
            </div>
            <div className='attemps'>
                <p><b>Codebreker's</b> attempts ( <b className='to-win'>{attempsToWin()}</b> less to win )</p>
                {pegLists}
            </div>
        </>
    );
}

function messageGameReady(){
    const message = {
        action: 'startGame',
        data: {}
    }
    return JSON.stringify(message);
}

export default Codemaker;