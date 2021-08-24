/**
 * Indicates the codebreaker can start to guess
 * the code
 * @returns a string json message
 */
export function messageGameReady(){
    const message = {
        action: 'startGame',
        data: {}
    }
    return JSON.stringify(message);
}

/**
 * Provides a message with feedback to the codebreaker,
 * where for one correct both position and color, it's added
 * a black peg to the feedback, while if the color is correct,
 * a white peg is added
 * @param {string[]} given 
 * @param {string[]} correct 
 * @returns a string json message 
 */
export function messagaeFeedback(given, correct){
    const message = {
        action: 'play',
        data: {
            feedback: feedback(given, correct)
        }
    }
    return JSON.stringify(message);
}

/**
 * Calculates the num of white and black pegs,
 * that are used to provide feedback
 */
function feedback(given, correct){
    // Copies to not modify the given arrays
    let givenCopy = [...given];
    let correctCopy = [...correct];
    let blackPegs = 0;
    let whitePegs = 0;

    for (let i = 0; i < correctCopy.length; i++) {
        if(correctCopy[i] === givenCopy[i]){
            blackPegs++;
            correctCopy.splice(i, 1);
            givenCopy.splice(i, 1);
            // The elements at the current index are deleted
            // so the next item gonna get this index,
            // therefore is necessary to go back
            i--;
        }
    }

    for (let i = 0; i < givenCopy.length; i++) {
        const peg = givenCopy[i];
        const index = correctCopy.indexOf(peg);
        if(index >= 0){
            correctCopy.splice(index, 1);
            whitePegs++;
        }
    }

    return {
        correctBoth: blackPegs,
        correctColors: whitePegs
    }

}

/**
 * Prepares a messsage to ask for feedback
 * @param {string[]} pegs  color of the pegs
 * @returns a json string with the message
 */
export function messageRequestFeedback(pegs){
    const message = {
        action: 'play',
        data: {
            pegs: pegs
        }
    }
    return JSON.stringify(message);
}