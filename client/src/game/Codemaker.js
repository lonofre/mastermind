import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import PegList from "../peg/PegList";
import AttemptsList from "./AttemptsList";
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
            const { messageType } = JSON.parse(event.data);
            if (messageType === 'connection') {
                setPlayerConnected(true);
            }
        });
    }, []);

    useEffect(() => {
        if (alreadySent) {
            websocket.addEventListener('message', (event) => {
                const { messageType, data } = JSON.parse(event.data);
                if (messageType === 'requestFeedback') {
                    const attempt = data.pegs;
                    websocket.send(messagaeFeedback(attempt, code));
                    setAttempts(previous => [...previous, attempt]);
                }
            });
        }
    }, [alreadySent]);

    useEffect(() => {
        if (attempts.length >= 1) {
            const [lastAttempt] = attempts.slice(-1);
            if (lastAttempt.every((peg, i) => peg === code[i])) {
                window.alert('YOU LOST!!!!!');
                window.location.reload();
            }
        }
        if (attempts.length > numAttempts) {
            window.alert('YOU WIN!!!!!');
            window.location.reload();
        }
    }, [attempts]);

    function createCode() {
        if (code && playerConnected) {
            setAlreadySent(true);
            websocket.send(messageGameReady());
        } else if (!playerConnected) {
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


    function attemptsToWin() {
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
                <AttemptsList attempts={attempts} />
            </div>
        </>
    );
}

export default Codemaker;