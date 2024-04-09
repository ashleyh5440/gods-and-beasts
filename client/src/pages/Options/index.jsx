//this is linked to the 'game' button on home page
//if not logged in: goes to login/signup page
//if logged in: view decks, create new deck, start new game, wins/losses
//view decks: also have option to create new one
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

import './style.css';

function Options() {
    return (
        <section>
            <div className="left">
                some pic here
            </div>
            <div className="right">
                <Button variant="primary" className="button"><NavLink to="/viewscores">View scores</NavLink></Button>
                <Button variant="primary" className="button"><NavLink to="/createdeck">New game</NavLink></Button>
            </div>
        </section>
    )
};

export default Options;
