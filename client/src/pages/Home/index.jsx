import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import 'animate.css';
import logo from '../../assets/logo.gif';
import { NavLink } from 'react-router-dom';
import Auth from '../../utils/auth';

import '../Home/style.css';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = Auth.loggedIn();
        setLoggedIn(isAuthenticated);

        rain();

        return () => {
            removeRain(); //calls remove function
        };
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
            i++;
        }
    }

    function removeRain() { //removes rain animation when leaving the page
        let body = document.querySelector('body');
        let drops = body.querySelectorAll('i');
        drops.forEach(drop => body.removeChild(drop));
    }

    return (
        <section className="home-page">
            <div className="home-page-container">
                <h1>Gods and Beasts</h1>
                <div className="logo-container animate__animated animate__fadeIn animate__delay-2s animate__slower">
                    <img id="logo" src={logo} alt="Logo" />
                    <div className="home-button-container">
                    <Button variant="primary" onClick={handleGameClick}>Start</Button>
                </div>
                </div>
            </div>
        </section>
    );
}

export default Home;