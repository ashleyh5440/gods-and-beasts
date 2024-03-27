import React from 'react';
import { useQuery } from '@apollo/client';
import { Carousel } from 'react-bootstrap';

import { QUERY_CHARACTERS } from "../../utils/queries";

function CreateDeck() {
    const Card = ({ category, name, image, description, attack_points, defense_points }) => {
        const { loading, error, data } = useQuery(QUERY_CHARACTERS);

        if (loading) return <p>Loading...</p>;
        
        console.log("Characters data:", data);

        const characters = data.getCharacters; 

        return (
            <div className="card-container">
                <div>can you see me?</div>
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

    const Deck = ({ characters }) => {
        return (  
            <section>
                <div className="carousel-container">
                    <Carousel>
                        {characters.map((character, index) => (
                            <Carousel.Item key={index}>
                                <Card 
                                    category={character.category}
                                    name={character.name}
                                    image={character.image}
                                    description={character.description}
                                    attack_points={character.attack_points}
                                    defense_points={character.defense_points}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </section>
        );
    };

    const { loading, error, data } = useQuery(QUERY_CHARACTERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const characters = data.getCharacters || [];
    console.log("Characters data:", data);

    return (
        <div>
            <Deck characters={characters} />
        </div>
    );
}

export default CreateDeck;

