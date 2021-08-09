import './Feedback.css';

/**
 * Provides feedback to the player
 * with 4 key pegs, so the player can
 * guess whether her key is correct
 */
function Feedback(props){

    const feedback = props.feedback;
    const correctBoth = feedback.both;
    const correctColors = feedback.color;
    
    const total = correctColors + correctBoth;
    
    function peg(color = 'black', key){
        const className = `key-peg ${color}`;
        return <div key={key} className={className}></div>;
    }

    let pegs = [];
    
    for(let i = 0; i < correctBoth; i++){
        if(i < correctBoth) pegs.push(peg('black', i))
    }

    // i starts at correctBoth just for the key property
    for(let i = correctBoth; i < total; i++){
        if(i < total) pegs.push(peg('white', i))
    }

    return (
        <div className='feedback'>
            {pegs}
        </div>
    );
}





export default Feedback;