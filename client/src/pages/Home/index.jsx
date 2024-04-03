import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import 'animate.css';
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

    function rain() {
        let amount = 90;
        let body = document.querySelector('body');
        let i = 0;
        while(i < amount) {
            let drop = document.createElement('i');

            let size = Math.random() * 5;
            let posX = Math.floor(Math.random() * window.innerWidth);
            let delay = Math.random() * -20;
            let duration = Math.random() * 20;

            drop.style.width = 0.2 + size + 'px';
            drop.style.top = 0;
            drop.style.left = posX + 'px';
            drop.style.animationDelay = delay + 's';
            drop.style.animationDuration = duration + 's';

            body.appendChild(drop);
            i++
        }
    }

    rain();

    return (
        <section className="home">
            <div className="container">
                <h1>Gods and Beasts</h1>
                <div className="logo-container animate__animated animate__fadeIn animate__delay-2s animate__slower">
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