import Peg from "./Peg";

/**
 * Shows a ordered list of pegs horizontally
 * @param {{object, boolean}} props where
 * 
 *         colors: it's an array containing the names of the colors
 *                 of the pegs
 * 
 *         isSmall: add a css class to change the size of the pegs 
 */
function PegList({colors, isSmall}){
    const pegs = colors.map((color, index) => 
        <Peg key={index} small={isSmall} color={color} />
    );

    const style = {
        display: 'flex',
        justifyContent: 'center'
    }

    return (
        <div style={style}>
            { pegs }
        </div>
    )
}

export default PegList;