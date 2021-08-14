import './Peg.css';


function Peg({color, clickeable, onClick, small}){

    let className = `peg ${color}`;
    className += (clickeable) ? ' clickeable' : '';
    className += (small) ? ' small' : '';

    return (
        <div className={className} onClick={onClick}>
        </div>
    );
}

export default Peg;