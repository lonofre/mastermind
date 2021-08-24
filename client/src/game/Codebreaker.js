import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import Feedback from "../peg/Feedback";
import AttemptsList from "./AttemptsList";
import WaitingContent from "./WaitingContent";
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
            const {messageType, data} = JSON.parse(event.data);
            switch (messageType) {
                case 'ready':
                    setStartDecipher(true);
                    break;
                case 'feedback':
                    const { feedback } = data;
                    setCorrectBoth(feedback.correctBoth);
                    setCorrectColors(feedback.correctColors);
                    break;
                default:
                    break;
            }
        });
    }, []);

    function getCode(pegs){
        setCode(pegs);
    }

    function sendCode(){
        if(code.length > 0){
            websocket.send(messageRequestFeedback(code));
            setAttempts(codes => [...codes, code]);
        }
    }

    let buttonClass = 'code-button';
    if(code.length === 0) buttonClass += ' deactivate';

    useEffect(() => {
        if(correctBoth === 4) {
            window.alert('YOU WIN!!!!!');
            window.location.reload();
        }
        if(attempts.length > numAttempts){
            window.alert('YOU LOST!!!!!');
            window.location.reload();
        }
    }, [attempts, correctBoth]);


    let attemptsDiv;
    if(attempts.length > 0){
        attemptsDiv = (
            <div className='attempts'>
                <p>Your attempts</p>
                <AttemptsList attempts={attempts} />
            </div>
        );
    }

    if(!startDecipher) return ( <WaitingContent /> );

    const attemptsToLose = () => numAttempts - attempts.length; 
   

    // Where the game is developed
    return (
        <div>
            <h2>You're the <span className='codebreaker'>Codebreaker</span></h2>
            <PegSelector numOfPegs={4} updatePegs={getCode}/>
            { code.length === 0 ? <p>Click a peg to change its color!</p> : null }
            <button className={buttonClass} onClick={sendCode} >Try code</button>
            <div className='feed'>
                <p>From the codemaker:</p>
                <Feedback correctBoth={correctBoth} correctColors={correctColors} />
            </div>
            <div>
                <p>You need <b className='to-lose'>{attemptsToLose()}</b> attempts less to lose</p>
            </div>
            { attemptsDiv }
        </div>
    );

}

export default Codebreaker;