import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import Feedback from "../peg/Feedback";
import PegList from "../peg/PegList";
import { messageRequestFeedback } from "./messages";
import './Codebreaker.css';

/**
 * Codebreaker offers the ability to
 * select pegs to create a code
 * and compare it to the codemaker's
 */
function Codebreaker({ websocket }){
    
    const [code, setCode] = useState([]);
    
    // Used to show the attempts to the user
    // and end the game if she pass the limit of attempts
    const [attempts, setAttempts] = useState([]);
    const [startDecipher, setStartDecipher] = useState(false);
    const [correctBoth, setCorrectBoth] = useState(0);
    const [correctColors, setCorrectColors] = useState(0);
    const numAttempts = 10;

    useEffect(()=> {
        websocket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            const data = message.data;
            switch (message.messageType) {
                case 'ready':
                    setStartDecipher(true);
                    break;
                case 'feedback':
                    setCorrectBoth(data.feedback.correctBoth);
                    setCorrectColors(data.feedback.correctColors);
                    break;
                default:
                    break;
            }
        });
    });

    function getCode(pegs){
        setCode(pegs);
    }

    function sendCode(){
        if(code.length > 0){
            console.log(code);
            let codes = [...attempts];
            codes.push(code);
            setAttempts(codes);
            websocket.send(messageRequestFeedback(code));
        }
    }

    let buttonClass = 'code-button';
    if(code.length === 0) buttonClass += ' deactivate';

    useEffect(() => {
        if(attempts.length > numAttempts){
            window.alert('YOU LOST!!!!!');
            window.location.reload();
        }
    }, [attempts]);

    // The attempts helps to the player to guess the code
    const previousCodes = attempts.map((attempt, index) => 
        <PegList key={index} colors={attempt} isSmall={true} />
    );

    let attemptsDiv;
    if(attempts.length > 0){
        attemptsDiv = (
            <div className='attempts'>
                <p>Your attempts</p>
                { previousCodes }
            </div>
        );
    }

    // Wait content 
    if(!startDecipher){
        return (
            <div>
                <h2>You're the <span className='codebreaker'>Codebreaker</span></h2>
                <p>Wait to the codemaker to begin the game 🎮 </p>
            </div>
        )
    }

    // Where the game is developed
    return (
        <div>
            <h2>You're the <span className='codebreaker'>Codebreaker</span></h2>
            <PegSelector numOfPegs={4} updatePegs={getCode}/>
            { code.length === 0 ? <p>Click a peg to change its color!</p> : null }
            <button className={buttonClass} onClick={sendCode} >Try code</button>
            <div className='feed'>
                <p>From the codemaker:</p>
                <p>Both {correctBoth}</p>
                <p>Colors {correctColors}</p>
                <Feedback correctBoth={correctBoth} correctColors={correctColors} />
            </div>
            { attemptsDiv }
        </div>
    );

}

export default Codebreaker;