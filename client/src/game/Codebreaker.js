import { useEffect, useState } from "react";
import PegSelector from "../peg/PegSelector";
import Feedback from "../peg/Feedback";
import PegList from "../peg/PegList";
import './Codebreaker.css';

/**
 * Codebreaker offers the ability to
 * select pegs to create a code
 * and compare it to the codemaker's
 */
function Codebreaker(){
    
    const [code, setCode] = useState([]);
    
    // Used to show the attemps to the user
    // and end the game if she pass the limit of attempts
    const [attempts, setAttempts] = useState([]);
    const numAttempts = 10;

    function getCode(pegs){
        setCode(pegs);
    }

    function sendCode(){
        if(code.length > 0){
            console.log(code);
            let codes = [...attempts];
            codes.push(code);
            setAttempts(codes);
        }
    }

    let buttonClass = 'code-button';
    if(code.length === 0) buttonClass += ' deactivate';

    useEffect(() => {
        if(attempts.length > numAttempts){
            console.log('THE GAME END 🍌')
        }
    }, [attempts]);

    // The attempts helps to the player to guess the code
    const previousCodes = attempts.map((attempt, index) => 
        <PegList key={index} colors={attempt} isSmall={true} />
    );

    let attempsDiv;
    if(attempts.length > 0){
        attempsDiv = (
            <div className='attempts'>
                <p>Your attempts</p>
                { previousCodes }
            </div>
        );
    }

    return (
        <div>
            <h2>You're the <span className='codebreaker'>Codebreaker</span></h2>
            <PegSelector numOfPegs={4} updatePegs={getCode}/>
            { code.length === 0 ? <p>Click a peg to change its color!</p> : null }
            <button className={buttonClass} onClick={sendCode} >Try code</button>
            <div className='feed'>
                <p>From the codemaker:</p>
                <Feedback correctBoth={2} correctColors={1} />
            </div>
            { attempsDiv }
        </div>
    );

}

export default Codebreaker;