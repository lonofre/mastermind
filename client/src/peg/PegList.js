import Peg from "./Peg";

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