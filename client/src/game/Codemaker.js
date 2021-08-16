import { useState } from "react";
import PegSelector from "../peg/PegSelector";
import PegList from "../peg/PegList";
import './Codemaker.css';

/**
 * Creates the code and provide feedback
 * to the other player
 * @param {{function}} {params} where:
 * 
 *        isConnected: informs about if the codebreaker
 *        has joined the game.
 */
function Codemaker({ isConnected }) {

    /**
     * The code is an array of colors:
     * ['blue', 'green', ...]
     */
    const [code, setCode] = useState([]);
    const [alreadySent, setAlreadySent] = useState(false);
    const numAttempts = 10;

    // Mock data
    const attemps = [
        ['blue', 'red', 'blue', 'red'],
        ['orange', 'red', 'blue', 'red'],
        ['blue', 'red', 'green', 'red']
    ]

    function createCode() {
        if (code.length > 0) {
            console.log(code);
            setAlreadySent(true);
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

    return (
        <>
            <h2>You're the <span className='codemaker'>Codemaker</span></h2>
            <div>
                <p>Your CODE (don't share it)</p>
                <PegList colors={code} isSmall={false} />
            </div>
            <div className='attemps'>
                <p><b>Codebreker's</b> attemps ( <b className='to-win'>{numAttempts - attemps.length}</b> less to win )</p>
                {pegLists}
            </div>
        </>
    );
}

export default Codemaker;