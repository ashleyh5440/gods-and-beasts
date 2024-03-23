import React from 'react';
import '../Card/style.css';

const Card = ({ category, name, image, description, attack_points, defense_points }) => {
    return (
        <div className="card-container">
            <div className={`card ${category}`}>
                <div className="card-content">
                    <div className="name-category">
                        <h3>{name}</h3>
                    </div>
                    <div className="card-img"></div>
                    <div className="character-info">
                        <p>Class: {category} <br />
                        {description}</p>
                    </div>
                    <div className="points">
                        <p>Attack: {attack_points}<br />
                        Defense: {defense_points}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;