import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CHARACTERS } from "../../utils/queries";
import { Carousel } from 'react-bootstrap';
import '../CreateDeck/style.css';

function CreateDeck() {
    const Card = ({ category, name, image, description, attack_points, defense_points }) => {
        return (
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
        );
    };

    const { loading, error, data } = useQuery(QUERY_CHARACTERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const characters = data.getCharacters || [];
    console.log("Characters data:", data);

    // Sseparate characters into god and beast
    const godCharacters = characters.filter(character => character.category === 'God');
    const beastCharacters = characters.filter(character => character.category === 'Beast');

    // chunk array into smaller arrays
    const chunkArray = (array, size) => {
        return array.reduce((acc, _, i) => {
            if (i % size === 0) {
                acc.push(array.slice(i, i + size));
            }
            return acc;
        }, []);
    };

    // chunk god characters array into groups of 3
    const chunkedGodCharacters = chunkArray(godCharacters, 3);

    // chunk beast characters array into groups of 3
    const chunkedBeastCharacters = chunkArray(beastCharacters, 3);
    console.log("God Characters:", godCharacters);
    console.log("Beast Characters:", beastCharacters);

    return (
        <section>
            <div className="gods-container">
                <h2>God Category</h2>
                <div className="carousel-container">
                    <Carousel>
                        {chunkedGodCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className="col-md-4" key={idx}>
                                            <Card 
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
            <div className="beasts-container">
                <h2>Beast Category</h2>
                <div className="carousel-container">
                    <Carousel>
                        {chunkedBeastCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className="col-md-4" key={idx}>
                                            <Card 
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default CreateDeck;

