import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import PegList from "../peg/PegList";
import { messageGameReady, messagaeFeedback } from "./messages";
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
    const [attempts, setAttempts] = useState([]);
    const numAttempts = 10;


    useEffect(() => {
        websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            const data = message.data;
            switch (message.messageType) {
                case 'connection':
                    setPlayerConnected(true);
                    break;
                case 'requestFeedback':
                    const attempt = data.pegs;
                    const copy = [...attempts];
                    copy.push(attempt);
                    setAttempts(copy);
                    websocket.send(messagaeFeedback(attempt, code));
                    break;
                default:
                    break;
            }
        });
    });

    useEffect(()=> {
        if(attempts.length > numAttempts){
            window.alert('YOU WIN!!!!!');
            window.location.reload();
        }
    });

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

    const pegLists = attempts.map((attemp, index) =>
        <PegList colors={attemp} isSmall={true} key={index} />
    );

    function attemptsToWin(){
        return numAttempts - attempts.length;
    }

    return (
        <>
            <h2>You're the <span className='codemaker'>Codemaker</span></h2>
            <div>
                <p>Your CODE (don't share it)</p>
                <PegList colors={code} isSmall={false} />
            </div>
            <div className='attempts'>
                <p><b>Codebreker's</b> attempts ( <b className='to-win'>{attemptsToWin()}</b> less to win )</p>
                {pegLists}
            </div>
        </>
    );
}



export default Codemaker;