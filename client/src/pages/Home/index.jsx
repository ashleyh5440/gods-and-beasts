import { useState } from 'react';
import '../Home/style.css';
import 'bootstrap/dist/css/bootstrap.css';

import logo from '../../assets/logo.gif';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

function Home() {
    return (
        <section className="home">
            <h1>Gods and Beasts</h1>
            <div className="logo-container">
                <img id="logo" src={logo} />
            </div>
            <div className="button-container">
                <Button variant="primary"><NavLink to="/game">Game</NavLink></Button>
                <Button variant="primary"><NavLink to="/lore">Lore</NavLink></Button>
                <Button variant="primary"><NavLink to="/store">Store</NavLink></Button>
            </div>
    </section>
    )
}

export default Home;