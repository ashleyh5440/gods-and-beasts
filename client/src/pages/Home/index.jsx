import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import logo from '../../assets/logo.gif';

import { NavLink } from 'react-router-dom';
import Auth from '../../utils/auth';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = Auth.loggedIn();
        setLoggedIn(isAuthenticated);
    }, []);

    const handleGameClick = () => {
        if (!loggedIn) {
            navigate('/login');
        } else {
            navigate('/options');
        }
    };

    return (
        <section className="home">
            <div className="container">
                <h1>Gods and Beasts</h1>
                <div className="logo-container">
                    <img id="logo" src={logo} />
                </div>
            {/* <div className="button-container">
                <Button variant="primary"><NavLink to="/game">Game</NavLink></Button>
                <Button variant="primary"><NavLink to="/lore">Lore</NavLink></Button>
                <Button variant="primary"><NavLink to="/store">Store</NavLink></Button>
            </div> */}
                <div className="button-container">
                    <Button variant="primary" onClick={handleGameClick}>Start</Button>
                </div>
            </div>
        </section>
    )
}

export default Home;