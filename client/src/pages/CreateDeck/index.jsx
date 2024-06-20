import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../../utils/queries";
import { NavLink, useNavigate } from 'react-router-dom';
import Draggable from 'gsap/Draggable'; 

import Cards from '../../components/CardDeck';
import CardDeck from '../../components/CardDeck/CardDeck.jsx';

import ReactCardFlip from 'react-card-flip';
import { Carousel, Container, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

import '../CreateDeck/styles.css';

const Card = ({ id, category, name, image, description, attack_points, defense_points, selectedCards, setSelectedCards, exceedLimit, setExceedLimit }) => {
    const cardRef = useRef(null);
    const godCard = "url(god.png)";
    const beastCard = "url(beast.png)";

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

    //event handler for flipping cards
    const handleClick = (e) => {
        e.preventDefault();
        setIsFlipped(!isFlipped);
    };

    const handleDrag = (event) => {
        console.log("Drag event triggered");
        const { offsetX, offsetY } = event;
        console.log("offsetX:", offsetX, "offsetY:", offsetY);
    
        if (Math.abs(offsetX) >= 50 || Math.abs(offsetY) >= 50) {
          addToDeck({ id, category, name, image, description, attack_points, defense_points });
        }
    };
    
    const addToDeck = (card) => {
        if (selectedCards.length < 10) {
            setSelectedCards(prevSelectedCards => [...prevSelectedCards, card]);
            setExceedLimit(false);
        } else {
            setExceedLimit(true);
            console.log("can only choose 10");
        }
    };   
    
    useEffect(() => {
        if (cardRef.current) {
            console.log("reference:", cardRef.current);
            Draggable.create(cardRef.current, {
                type: "x",
                bounds: { minX: -200, maxX: 200 },
                edgeResistance: 0.75,
                onDragEnd: handleDrag
            });
        }
    }, [id, handleDrag]);

    //card flips when clicked on
    return (
        <div className="card-box" id={`card-${id}`}>
            <div ref={cardRef} draggable="true" 
            onDrag={handleDrag}>
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
                </div>
            </ReactCardFlip>
            </div>
            <Button variant="secondary" className="add-button" onClick={() => addToDeck({ id, category, name, image, description, attack_points, defense_points })}>Add to deck</Button>
        </div>
    );
    
};

function CreateDeck() {
    const [cardsPerSlide, setCardsPerSlide] = useState(4);
    const [selectedCards, setSelectedCards] = useState([]);
    const [exceedLimit, setExceedLimit] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const godsCarouselRef = useRef(null);
    const beastsCarouselRef = useRef(null);

      const addToDeck = (card) => {
        if (selectedCards.length < 10) {
            setSelectedCards(prevSelectedCards => [...prevSelectedCards, card]);
            setExceedLimit(false);
        } else {
            setExceedLimit(true);
            console.log("can only choose 10");
        }
    };   

    useEffect (() => {
        console.log("selected cards:", selectedCards, selectedCards.length);
        if (selectedCards.length === 10) {
            console.log("at ten?");
        }
    }, [selectedCards]);
        //shows number of cards based on screen size
    useEffect(() => {
        const updateCardsPerSlide = () => {
            if (window.innerWidth <= 500) {
                setCardsPerSlide(1);
            } else if (window.innerWidth <= 1000) {
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

    const navigate = useNavigate();

    const handleBeginClick = () => {
        console.log(selectedCards);
       navigate("/game", { state: { selectedCards: selectedCards } });
    };

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
        <section id="create-container">
            <div className="intro">
                <h2>Build Your Army</h2>
                <p>Choose ten cards to take into battle.<br />
                Click on the card to flip it over.</p>
            </div>
            <Container>
                <Row>
                    <Col style={{padding: "0% !important"}}>
                        <div className="gods-container">
                            <h3>Gods</h3>
                            <div className="carousel-container">
                                <Carousel ref={godsCarouselRef}>
                        {chunkedGodCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
                                            <Card
                                                id={character._id}
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                                exceedLimit={exceedLimit}
                                                setExceedLimit={setExceedLimit}
                                                addToDeck={addToDeck}
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
                            <h3>Beasts</h3>
                            <div className="carousel-container">
                                <Carousel ref={beastsCarouselRef}>
                                    {chunkedBeastCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
                                            <Card
                                                id={character._id}
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                                exceedLimit={exceedLimit}
                                                setExceedLimit={setExceedLimit}
                                                addToDeck={addToDeck}
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
                    </Col>
                    <Col md="auto" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div id="user-deck">
                            <p>Your deck</p>
                             <CardDeck
                            selectedCards={selectedCards}
                            />
                        </div>
                        {selectedCards.length === 10 && (
                            <div className="begin-button">
                                <Button variant="primary" onClick={() => handleBeginClick()}><NavLink to={{ pathname: "/game", state: { selectedCards: selectedCards } }}>Begin</NavLink></Button>

                            </div>)}
                        <div className="exceeded">
                            {exceedLimit && <p>You can only choose 10 cards.</p>}
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <div className="gods-container">
                <h3>Gods</h3>
                <div className="carousel-container">
                    <Carousel ref={godsCarouselRef}>
                        {chunkedGodCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
                                            <Card
                                                id={character._id}
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                                exceedLimit={exceedLimit}
                                                setExceedLimit={setExceedLimit}
                                                addToDeck={addToDeck}
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
                <h3>Beasts</h3>
                <div className="carousel-container">
                    <Carousel ref={beastsCarouselRef}>
                        {chunkedBeastCharacters.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="card-row">
                                    {chunk.map((character, idx) => (
                                        <div className={`col-md-${12 / cardsPerSlide}`} key={idx}>
                                            <Card
                                                id={character._id}
                                                category={character.category}
                                                name={character.name}
                                                image={character.image}
                                                description={character.description}
                                                attack_points={character.attack_points}
                                                defense_points={character.defense_points}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                                exceedLimit={exceedLimit}
                                                setExceedLimit={setExceedLimit}
                                                addToDeck={addToDeck}
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
            <br />
   
            <div id="user-deck">
                <CardDeck
                    selectedCards={selectedCards}
                    exceedLimit={exceedLimit}
                />
            </div>
            <div className="exceeded">
                {exceedLimit && <p>You can only choose 10 cards.</p>}
            </div>
            {selectedCards.length === 10 && (
                <div className="begin-button">
                    <Button variant="primary" onClick={() => handleBeginClick()}><NavLink to={{ pathname: "/game", state: { selectedCards: selectedCards } }}>Begin</NavLink></Button>

                </div>
            )} */}
        </section>
    );
}

export default CreateDeck;