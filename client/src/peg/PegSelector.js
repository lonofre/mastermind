import { useState } from 'react';
import Peg from './Peg';
import './PegSelector.css';


function PegSelector({ numOfPegs, updatePegs }){

    const [pegs, setPegs] = useState(initPages(numOfPegs));
    const colors = ['orange', 'blue', 'red', 'green'];

    function changeColor(position){
        let peg = pegs[position];
        let { colorIndex } = peg;

        // Similar to what a circular linked list would do
        colorIndex = ( colorIndex < colors.length - 1)
                     ? colorIndex + 1
                     : 0;
        
        peg.colorIndex = colorIndex;

        let pegsArr = [...pegs];
        pegsArr[position] = peg;
        setPegs(pegsArr);
        if(updatePegs !== undefined){
            updatePegs( pegsArr.map( (peg) => colors[peg.colorIndex] ) );
        }
    }

    let tags = pegs.map( ({position, colorIndex}) => 
        <Peg clickeable={ true } 
             color={ colors[colorIndex] } 
             onClick={ () =>  changeColor(position)}
             key={ position.toString() }/>
    );

    return (
        <div className='pegs'>
            { tags }
        </div>
    )   

}


function initPages(numOfPegs){
    let pegs = [];
    for (let i = 0; i < numOfPegs; i++) {
        const peg = {
            position: i,
            colorIndex: 0
        };
        pegs.push(peg);
    }
    return pegs;
}

export default PegSelector;