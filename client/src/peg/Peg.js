import './Peg.css';

function Peg(props){

    const color = props.color;

    // Indicates a css efect
    const clickeable = props.clickeable;

    let className = `peg ${color}`;
    className += (clickeable) ? ' clickeable' : '';

    return (
        <div className={className}>
        </div>
    );
}

export default Peg;