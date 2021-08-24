import PegList from "../peg/PegList";

/**
 * Show each attempt in a different row
 */
function AttemptsList({ attempts }){
    const list = attempts.map((attempt, index) => 
        <PegList key={index} colors={attempt} isSmall={true} /> 
    );

    return (
        <>
            { list }
        </>
    )
}

export default AttemptsList;