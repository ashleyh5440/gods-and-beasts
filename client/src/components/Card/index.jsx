import React from 'react';
import '../Card/style.css';
import { QUERY_CHARACTERS } from "../../utils/queries";
import { ADD_CARD, REMOVE_CARD} from "../../utils/mutations";

// retrieve data from the database and format it as the card

const Card = ({ category, name, image, description, attack_points, defense_points }) => {
    const { loading, data } = useQuery(QUERY_CHARACTERS);

    if (loading) return <p>Loading...</p>;

    const characters = data.getCharacters; 

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