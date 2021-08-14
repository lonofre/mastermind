import './Home.css';
import Codebreaker from '../game/Codebreaker';
/**
 * This component is a start start point
 * to the players, so they can start playing
 * with someone
 */
function Home() {

    return (
        <div>
            <Codebreaker />
        </div>
    );
}

export default Home;