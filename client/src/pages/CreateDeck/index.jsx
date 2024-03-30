import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../../utils/queries";

import { Carousel } from "react-bootstrap";
import '../CreateDeck/style.css';

function CreateDeck() {
    const [cardsPerSlide, setCardsPerSlide] = useState(3); 

    useEffect(() => {
        const updateCardsPerSlide = () => {
            if (window.innerWidth <= 767) {
                setCardsPerSlide(1);
            } else if (window.innerWidth <= 980) {
                setCardsPerSlide(2);
            } else {
                setCardsPerSlide(3);
            }
        };
    
        updateCardsPerSlide();
    
        window.addEventListener("resize", updateCardsPerSlide);

        return () => {
            window.removeEventListener("resize", updateCardsPerSlide);
        };
    }, []);
    

    const { loading, error, data } = useQuery(QUERY_CHARACTERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const characters = data.getCharacters || [];

    // separate characters into god and beast
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

    // chunk god characters array into groups of cardsPerSlide
    const chunkedGodCharacters = chunkArray(godCharacters, cardsPerSlide);

    // chunk beast characters array into groups of cardsPerSlide
    const chunkedBeastCharacters = chunkArray(beastCharacters, cardsPerSlide);

    const Card = ({ category, name, image, description, attack_points, defense_points }) => {
        const godCard = "url(../../../public/god.png)";
        const beastCard = "url(../../../public/beast.png)";

        let backgroundImage;
        if (category === "God") {
            backgroundImage = godCard;
        } else if (category === "Beast") {
            backgroundImage = beastCard;
        }

        const cardStyle = {
            backgroundImage: backgroundImage,
            backgroundRepeat: "no repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
        }
        
        return (
            <div className={`card ${category}`} style={cardStyle}>
                <div className="card-content">
                    <div className="name-category">
                        <h3>{name}</h3>
                    </div>
                    <div className="card-img">
                        <img src={`/images/${image}`}/>
                    </div>
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

    return (
        <section>
            <div className="gods-container">
                <h2>Gods</h2>
                <div className="carousel-container">
                    <Carousel>
                        {chunkedGodCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
                                            <Card className="god-card"
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
                <h2>Beasts</h2>
                <div className="carousel-container">
                    <Carousel>
                        {chunkedBeastCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
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