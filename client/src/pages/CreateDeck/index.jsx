import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../../utils/queries";

import ReactCardFlip from 'react-card-flip';
import { Carousel } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import '../CreateDeck/styles.css';

const Card = ({ category, name, image, description, attack_points, defense_points }) => {
    const godCard = "url(../../../public/god.png)";
    const beastCard = "url(../../../public/beast.png)";

    //changes background image based on category
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

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        setIsFlipped(!isFlipped);
    };

    //card flips when clicked on
    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div className="card-front" onClick={handleClick}>
                <div className={`card ${category}`} style={cardStyle}>
                    <div className="card-content">
                        <div className="name-category">
                            <h3>{name}</h3>
                        </div>
                        <div className="card-img">
                            <img src={`/images/${image}`} alt={name} />
                        </div>
                    </div>
                </div>
                <Button variant="secondary" className="add-button">Add to deck</Button>
            </div>
            <div className="card-back" onClick={handleClick}>
                <div className={`card ${category}`} style={cardStyle}>
                    <div className="card-content">
                        <div className="character-info">
                            <p>{description}</p>
                        </div>
                        <div className="points">
                            <p>Attack: {attack_points}<br/>
                            Defense: {defense_points}</p>
                        </div>
                    </div>
                </div>
                <Button variant="secondary" className="add-button">Add to deck</Button>
            </div>
        </ReactCardFlip>
    );
};

function CreateDeck() {
    const [cardsPerSlide, setCardsPerSlide] = useState(4);
    const [activeIndex, setActiveIndex] = useState(0);
    // const carouselRef = useRef(null);
    const godsCarouselRef = useRef(null);
    const beastsCarouselRef = useRef(null);

        //shows number of cards based on screen size
    useEffect(() => {
        const updateCardsPerSlide = () => {
            if (window.innerWidth <= 500) {
                setCardsPerSlide(1);
            } else if (window.innerWidth <= 600) {
                setCardsPerSlide(2);
            } else if (window.innerWidth <= 980) {
                setCardsPerSlide(3);
            } else {
                setCardsPerSlide(4);
            }
        };
    
        updateCardsPerSlide();
    
        window.addEventListener("resize", updateCardsPerSlide);

        return () => {
            window.removeEventListener("resize", updateCardsPerSlide);
        };
    }, []);

    //fetches characters from database
    const { loading, error, data } = useQuery(QUERY_CHARACTERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const characters = data.getCharacters || [];

    //seperates characters based on category
    const godCharacters = characters.filter(character => character.category === 'God');
    const beastCharacters = characters.filter(character => character.category === 'Beast');
    
    const chunkArray = (array, size) => {
        return array.reduce((acc, _, i) => {
            if (i % size === 0) {
                acc.push(array.slice(i, i + size));
            }
            return acc;
        }, []);
    };

    const chunkedGodCharacters = chunkArray(godCharacters, cardsPerSlide);
    const chunkedBeastCharacters = chunkArray(beastCharacters, cardsPerSlide);

    const handleGodsPrevClick = () => {
        godsCarouselRef.current.prev();
    };

    const handleGodsNextClick = () => {
        godsCarouselRef.current.next();
    };

    const handleBeastsPrevClick = () => {
        beastsCarouselRef.current.prev();
    };

    const handleBeastsNextClick = () => {
        beastsCarouselRef.current.next();
    };

    return (
        <section>
            <div className="gods-container">
                <h2>Gods</h2>
                <div className="carousel-container">
                    <Carousel ref={godsCarouselRef}>
                        {chunkedGodCharacters.map((chunk, index) => (
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
                <div className="buttons-container" id="gods">
                    <Button variant="primary" onClick={handleGodsPrevClick}>&#10094;</Button>
                    <Button variant="primary" onClick={handleGodsNextClick}>&#10095;</Button>
                </div>
            </div>
            <div className="beasts-container">
                <h2>Beasts</h2>
                <div className="carousel-container">
                    <Carousel ref={beastsCarouselRef}>
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
                <div className="buttons-container" id="beasts">
                    <Button variant="primary" onClick={handleBeastsPrevClick}>&#10094;</Button>
                    <Button variant="primary" onClick={handleBeastsNextClick}>&#10095;</Button>
                </div>
            </div>
        </section>
    );
}

export default CreateDeck;