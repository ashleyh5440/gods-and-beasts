//this is linked to the 'game' button on home page
//if not logged in: goes to login/signup page
//if logged in: view decks, create new deck, start new game, wins/losses
//view decks: also have option to create new one
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

import '../Options/styles.css';

function Options() {
    return (
        <section className="options-page">
            <div className="options-page-container">
                <div className="options-left">
                some pic here
                </div>
                <div className="options-right">
                    <Button variant="primary" className="button"><NavLink to="/viewscores">View scores</NavLink></Button>
                    <Button variant="primary" className="button"><NavLink to="/createdeck">New game</NavLink></Button>
                </div>
            </div>
        </section>
    )
};

export default Options;