import { useState } from 'react';
import Peg from './Peg';
import './PegSelector.css';


/**
 * It's a component that allows to click on a peg
 * and change its color
 * @param {{number, function}} {props} where: 
 * 
 *        updatePegs: is a function used to fetch data
 *        from the child (this component) to the parent       
 */
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

        // Only if a function is provided
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


/**
 * Creates the Objects where the data of the pegs
 * are stored.
 * @param {number} numOfPegs 
 * @returns {Object[]} where each Object
 *          contains position of the peg and its color
 */
function initPages(numOfPegs){
    let pegs = [];
    for (let i = 0; i < numOfPegs; i++) {
        const peg = {
            position: i,
            // Color index is stored instead of
            // a string because it's more useful
            // to iterate through a color array
            colorIndex: 0
        };
        pegs.push(peg);
    }
    return pegs;
}

export default PegSelector;