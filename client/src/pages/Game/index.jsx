import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
    // const [moveUserCard, setMoveUserCard] = useState();

    //showing the points for the cards in user's deck at current index in carousel
    const [selectedAttackPoints, setSelectedAttackPoints] = useState();
    const [selectedDefensePoints, setSelectedDefensePoints] = useState();

    const [opponentLifePoints, setOpponentLifePoints] = useState(10000);
    const [opponentAttack, setOpponentAttack] = useState();
    const [opponentDefend, setOpponentDefend] = useState();
    const [randomOpponentCard, setRandomOpponentCard] = useState(null);
    const [opponentCard, setOpponentCard] = useState();
    const [showOpponentCard, setShowOpponentCard] = useState(false);
    
    const userCardRef = useRef(null);
    // const selectedCardRef = useRef(null);
    const selectedCardRef = useRef([]);
    const opponentCardRef = useRef();

        //userCardIndex = the order of cards in the carousel
    let [userCardIndex, setUserCardIndex] = useState(0);

    const carouselIndex = (selectedIndex, e) => {
        setUserCardIndex(selectedIndex)
        const userCardEl = selectedCards[selectedIndex];
        console.log("index:", selectedIndex, userCardEl, "userCardIndex:", userCardIndex);
        console.log("setUserCardIndex", setUserCardIndex)
        if (userCardEl) {
            setSelectedAttackPoints(userCardEl.attack_points || 0)
            setSelectedDefensePoints(userCardEl.defense_points || 0)
            setUserAttack(userCardEl.attack_points || 0)
            setUserDefend(userCardEl.defense_points || 0)
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
            // const randomOpponentCard = characters[randomIndex];
            const randomCard = characters[randomIndex];
            setOpponentCard(randomCard);
            console.log("computer choices:", characters)
            console.log("computer card", randomCard)
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
    
    // const tl = useRef();
    // gsap.config({ debug: true })

    // useGSAP(() => {
    //     console.log("useGSAP hook triggering")
    //     const moveUserCard = () => {
    //         console.log("moveCard function called")
    //         const selectedCardEl = selectedCardRef.current[carouselRef.current ? carouselRef.current.state?.selectedIndex: 0];
    //         console.log("selectedCardEl:", selectedCardEl)
    //    if(selectedCardEl && userCardRef.current) {
    //         const userCardInitPosition = selectedCardEl.getBoundingClientRect();
    //         const userCardPlayPosition = userCardRef.current.getBoundingClientRect();

    //         const moveX = userCardPlayPosition.left - userCardInitPosition.left;
    //         const moveY = userCardPlayPosition.top - userCardInitPosition.top;

    //         tl.current = gsap.timeline({ paused: true })
    //         .to(selectedCardEl, {
    //             x: moveX,
    //             y: moveY,
    //             duration: 1,
    //         });
    //         console.log("timeline", tl.current);
    //         tl.current.play()
    //     }
    //     };
    // }, { scope: selectedCardRef });

    // const moveUserCard = () => {
    //     if (tl.current) {
    //         tl.current.reversed(!tl.current.reversed()).play();
    //     }
    //     console.log("see me? did i move?")
    // }

   {/* runs when user clicks attack button */} 
    const attack = async() => {
        console.log("attack button clicked")
        
        //move card to the center
        const userCard = selectedCards[userCardIndex]
        console.log("userCardIndex", userCardIndex)
        setUserCard(userCard)
        console.log("user's card:", userCard)

        const updateDeck = selectedCards.map((card, index) => 
            index === userCardIndex ? { ...card, hidden: true } : card
        );
        setSelectedCards(updateDeck);
        
        //reveal the computer's card 
        setShowOpponentCard(true);

        setUserAttack(userCard.attack_points || 0)
        setUserDefend(userCard.defense_points || 0)

        //run game logic
        playUserCard('attack');

    } 

    //runs when user clicks defend button
    const defend = async() => {
        console.log("defend button clicked")

        //move card to the center
        const userCard = selectedCards[userCardIndex]
        setUserCard(userCard)
        console.log("user's card:", userCard)

        const updateDeck = selectedCards.map((card, index) => 
            index === userCardIndex ? { ...card, hidden: true } : card
        );
        setSelectedCards(updateDeck);
        
        //reveal the computer's card 
        setShowOpponentCard(true);

        setUserAttack(userCard.attack_points || 0)
        setUserDefend(userCard.defense_points || 0)

        //run game logic
        playUserCard('defend');
    } 

    //game logic
    const playUserCard = (userSelection) => {
        console.log("game logic running", "userSelection:", userSelection);

        const randomCard = opponentCard;
        console.log("opponent card", randomCard);

        const opponentAttack = randomCard.attack_points || 0;
        const opponentDefend = randomCard.defense_points || 0;
            
        const opponentSelection = Math.random() > 0.5 ? 'opAttack' : 'opDefend'
        console.log("opponentSelection:", opponentSelection)

             //user attacks 
        if (userSelection === 'attack') {
            console.log("user attack points:", userAttack);
                //opponent attacks
                //card with the highest number of attack points wins and absorbs loser’s attack points into their life points
            if (opponentSelection === 'opAttack') {
                console.log("opp attack points", opponentAttack)
                if (userAttack > opponentAttack) {
                    setWins((prev) => prev + 1);
                    setOpponentLifePoints ((prev) => prev - (userAttack || 0)); //decrease opponent's life points by user's attack points
                    setUserLifePoints ((prev) => prev + (opponentAttack || 0)); //increase user's life points by opponent's attack points
                    console.log("you win!!")
                } else if (userAttack === opponentAttack) {
                    setTies((prev) => prev + 1);
                    console.log("it's a tie")
                    //do nothing
                } else {
                    setLosses((prev) => prev + 1);
                    setOpponentLifePoints ((prev) => prev + (userAttack || 0));
                    setUserLifePoints((prev) => prev - (opponentAttack || 0));
                    console.log("you lose :(")
                }
                console.log("user life points:", setUserLifePoints, "opponent life points:", setOpponentLifePoints)

                    //opponent defends
                    //if attacker loses, half of the attack points from that card are taken from their total life points; if defender loses, the card’s defense points are subtracted from their total life points
            } else if (opponentSelection === 'opDefend') {
                if (userAttack > opponentDefend) {
                    setWins((prev) => prev + 1);
                    setOpponentLifePoints((prev) => prev - (userAttack || 0));
                    console.log("you win!!")
                } else if (userAttack === opponentDefend) {
                    setTies((prev) => prev + 1);
                    console.log("it's a tie")
                } else {
                    setLosses((prev) => prev + 1);
                    setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                    console.log("you lose :(")
                }
            }
            //userDefends
        } else if (userSelection === 'defend') {
                //opponent attacks
            if (opponentSelection === 'opAttack') {
                if (userDefend > opponentAttack) {
                    setWins((prev) => prev + 1);
                    setUserLifePoints ((prev) => prev + (opponentAttack || 0));
                    console.log("you win!!")
                } else if (userDefend === opponentAttack) {
                    setTies((prev) => prev + 1);
                    console.log("it's a tie")
                } else {
                    setLosses((prev) => prev + 1);
                    setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                    console.log("you lose :(")
                }
                    //opponent defends
            } else if (opponentSelection === 'opDefend') {
                setTies((prev) => prev + 1);
            }
            console.log("user life points:", setUserLifePoints, "opponent life points:", setOpponentLifePoints)
        }
        //clear cards from arena to start again
    }

    return (
        <section className="game-page">
            <div className="game-page-container">
                <div className="decks">
                    <div className="opponent-deck">
                        <p>Life points: {opponentLifePoints}</p>
                        <img src={cardBack} style={{ width: "200px", height: "280px"}}/>
                    </div>
                        {/* deck animation, still working on fixing */}
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
                        <p>Life points: {userLifePoints}</p>
                        <Carousel ref={carouselRef} onSelect={carouselIndex} className="user-deck-carousel">
                            {selectedCards.map((card, index) => (
                            <Carousel.Item key={index}>
                                <div className={`card ${card.category}`} style={{ backgroundImage: gameCardStyle(card.category).backgroundImage }} ref={selectedCardRef}>
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
                                <Col><Button variant="primary" style={{margin: "2% 17%"}} onClick={defend}>Defend</Button></Col>
                            </Row>
                        </Container>
                        {/* <div className="user-card-info">
                            <p>Attack Points: {selectedAttackPoints} </p>
                            <p>Defense Points: {selectedDefensePoints}</p>
                        </div> */}
                    </div>

                    
                </div>
                <div className="arena">
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
                        <div className="user-card">
                            {userCard && (
                                <div className={`card ${userCard.category}`} style={gameCardStyle(userCard.category)}>
                                    <div className="card-content">
                                        <div className="name-category">
                                            <h3>{userCard.name}</h3>
                                        </div>
                                        <div className="card-img">
                                            <img src={`/images/${userCard.image}`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Game;
