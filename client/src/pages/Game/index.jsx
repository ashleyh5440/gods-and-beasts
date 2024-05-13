import React, { useEffect, useState, useRef } from "react";
import { useLocation,  } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../../utils/queries";

import CardDeck from '../../components/CardDeck';
// import CardDeck from '../../components/CardDeck/CardDeck.jsx';

import cardBack from '../../../public/card-back.png';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../Game/styles.css';

function Game() {

    //getting cards from CreateDeck
    const location = useLocation();
    const initialSelectedCards = location.state ? location.state.selectedCards : [];
    const [selectedCards, setSelectedCards] = useState(initialSelectedCards); // set selectedCards to state
    const cardRefs = useRef([]);
    const carouselRef = useRef();

    const gameCardStyle = (category) => {
        return {
            backgroundImage: category === "God" ? "url(../../../public/god.png)" : "url(../../../public/beast.png)",
            backgroundRepeat: "no repeat",
            backgroundPosition: "center",
        };
    };

    const handlePrevClick = () => {
        carouselRef.current.prev();
        console.log("click?")
    };

    const handleNextClick = () => {
        carouselRef.current.next();
        console.log("click?")
    };


    const [numCards, setNumCards] = useState(10);
    const [wins, setWins] = useState();
    const [losses, setLosses] = useState();
    const [ties, setTies] = useState();

    const [userLifePoints, setUserLifePoints] = useState(10000);
    const [userAttack, setUserAttack] = useState(0);
    const [userDefend, setUserDefend] = useState(0);
    const [userCard, setUserCard] = useState();
    const [moveUserCard, setMoveUserCard] = useState();
    const [selectedAttackPoints, setSelectedAttackPoints] = useState();
    const [selectedDefensePoints, setSelectedDefensePoints] = useState();

    const [opponentLifePoints, setOpponentLifePoints] = useState(10000);
    const [opponentAttack, setOpponentAttack] = useState();
    const [opponentDefend, setOpponentDefend] = useState();
    const [opponentCard, setOpponentCard] = useState();
    const [showOpponentCard, setShowOpponentCard] = useState(false);
    
    const userCardRef = useRef();
    const opponentCardRef = useRef();

    const carouselIndex = (selectedIndex, e) => {
        const selectedCard = selectedCards[selectedIndex]
        console.log("index:", selectedIndex, selectedCard);

        if (selectedCard) {
            setSelectedAttackPoints(selectedCard.attack_points || 0)
            setSelectedDefensePoints(selectedCard.defense_points || 0)
        }
    }
    
    //computer pulls cards from the database to use to play
    const { loading, error, data } = useQuery(QUERY_CHARACTERS, {
        variables: { limit: 10 }
    });

    useEffect(() => {
        if (data) {
            const characters = data.getCharacters || [];
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomOpponentCard = characters[randomIndex];
            setOpponentCard(randomOpponentCard);
            console.log("computer cards:", characters)
        }
        if (error) {
            console.error("error getting opponent card:", error);
        }
    }, [data, error]);

    //show the points for the card currently showing in the user deck
    useEffect(() => {
        if (selectedCards.length > 0) {
            const firstCard = selectedCards[0];
            setSelectedAttackPoints(firstCard.attack_points || 0);
            setSelectedDefensePoints(firstCard.defense_points || 0);
        } else {
            setSelectedAttackPoints(0);
            setSelectedDefensePoints(0);
        }
    }, [selectedCards]);

    //define attack and defend
    //user has to choose before the computer
    const attack = async() => {
        //move card to the center
        setMoveUserCard(userCardRef.current);

        //reveal the computer's card 
        setShowOpponentCard(true);
        //computer chooses attack or defend
        // const opponentSelection = Math.random() < 0.5 ? 'opAttack' : 'opDefend';

        //compare points
        // playUserCard("attack")

    } 
    
    const defend = async() => {
        playUserCard("attack")
    } 

    //remove/disable user's selected card
        //cards are in a deck, clicking on one makes attack/defend options appear
    function userSelection() {
        //when user chooses a card, something happens(color change, noise, disappears?) to indicate that it has been selected, attack/defend buttons appear add back button to un-select it?
    }

    const playUserCard = (userSelection) => {
            //user attacks
        if (userSelection === 'attack') {
            console.log("attack points:", userAttack);
                //opponent attacks
                //card with the highest number of attack points wins and absorbs loser’s attack points into their life points
            if (opponentSelection === 'opAttack') {
                if (userAttack > opponentAttack) {
                    setWins((prev) => prev + 1);
                    setOpponentLifePoints ((prev) => prev - userAttack); //decrease opponent's life points by user's attack points
                    setUserLifePoints ((prev) => prev + opponentAttack); //increase user's life points by opponent's attack points
                } else if (userAttack === opponentAttack) {
                    setTies((prev) => prev + 1);
                    //do nothing
                } else {
                    setLosses((prev) => prev + 1);
                    setOpponentLifePoints ((prev) => prev + userAttack);
                    setUserLifePoints((prev) => prev - opponentAttack);
                }
                    //opponent defends
                    //if attacker loses, half of the attack points from that card are taken from their total life points; if defender loses, the card’s defense points are subtracted from their total life points
            } else if (opponentSelection === 'opDefend') {
                if (userAttack > opponentDefend) {
                    setWins((prev) => prev + 1);
                    setOpponentLifePoints((prev) => prev - userAttack);
                } else if (userAttack === opponentDefend) {
                    setTies((prev) => prev + 1);
                } else {
                    setLosses((prev) => prev + 1);
                    setUserLifePoints((prev) => prev - Math.floor(opponentAttack / 2));
                }
            }
            //userDefends
        } else if (userSelection === 'defend') {
                //opponent attacks
            if (opponentSelection === 'opAttack') {
                if (userDefend > opponentAttack) {
                    setWins((prev) => prev + 1);
                    setUserLifePoints ((prev) => prev + opponentAttack);
                } else if (userDefend === opponentAttack) {
                    setTies((prev) => prev + 1);
                } else {
                    setLosses((prev) => prev + 1);
                    setUserLifePoints((prev) => prev - Math.floor(opponentAttack / 2));
                }
                    //opponent defends
            } else if (opponentSelection === 'opDefend') {
                setTies((prev) => prev + 1);
            }
        }

    }


    return (
        <section className="game-page">
            <div className="game-page-container">
                <div className="decks">
                    <div className="opponent-deck">
                        <img src={cardBack} style={{ width: "200px", height: "280px"}}/>
                    </div>
                        {/* deck anuimation, still working on fixing */}
                    {/* <div className="user-deck">
                        <h3>Your Deck</h3>
                        <CardDeck ref={cardRefs} selectedCards={selectedCards} />
                        <div className="user-card-info">
                            <p>Attack Points: {userAttack} </p>
                            <p>Defense Points: {userDefend}</p>
                        </div>
                        <Button variant="primary" style={{margin: "2% 17%"}} onClick={attack}>Attack</Button>
                        <Button variant="primary" style={{margin: "2% 17%"}}>Defend</Button>
                    </div> */}

                    <div className="user-deck">
                        <Carousel ref={carouselRef} onSelect={carouselIndex}>
                            {selectedCards.map((card, index) => (
                            <Carousel.Item key={index}>
                                <div className={`card ${card.category}`} style={{ backgroundImage: gameCardStyle(card.category).backgroundImage }}>
                                    <div className="card-content">
                                        <div className="name-category">
                                            <h3>{card.name}</h3>
                                        </div>
                                        <div className="card-img">
                                            <img src={`/images/${card.image}`} alt={`Slide ${index}`} />
                                        </div>
                                    </div>
                                </div>
                            </Carousel.Item>
                            ))}
                            <div className="carousel-buttons-container">
                                <Button variant="primary" onClick={handlePrevClick}>&#10094;</Button>
                                <Button variant="primary" onClick={handleNextClick}>&#10095;</Button>
                            </div>
                        </Carousel>
                        <Container className="user-card-info">
                            <Row>
                                <Col><p>Attack Points: {selectedAttackPoints} </p></Col>
                                <Col><p>Defense Points: {selectedDefensePoints}</p> </Col>
                            </Row>
                            <Row>
                                <Col><Button variant="primary" style={{margin: "2% 17%"}} onClick={attack}>Attack</Button></Col>
                                <Col><Button variant="primary" style={{margin: "2% 17%"}}>Defend</Button></Col>
                            </Row>
                        </Container>
                        {/* <div className="user-card-info">
                            <p>Attack Points: {selectedAttackPoints} </p>
                            <p>Defense Points: {selectedDefensePoints}</p>
                        </div> */}
                    </div>

                    
                </div>
                <div className="arena">
                    {moveUserCard && (
                        <div className="user-card">{moveUserCard}</div>
                    )}
                    <div className="battleground">
                        <div className="opponent-card">
                            {showOpponentCard ? (
                                opponentCard && (
                                        <div className={`card ${opponentCard.category}`} style={gameCardStyle (opponentCard.category)}>
                                            <div className="card-content">
                                                <div className="name-category">
                                                    <h3>{opponentCard.name}</h3>
                                                </div>
                                                <div className="card-img">
                                                    <img src={`/images/${opponentCard.image}`} />
                                                </div>
                                            </div>
                                        </div>
                                )
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <div className="user-card"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Game;
