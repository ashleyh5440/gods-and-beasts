import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocation,  } from "react-router-dom";
import { NavLink, useNavigate } from 'react-router-dom';
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
import 'animate.css'
import '../Game/styles.css';

function Game() {

    //getting cards from CreateDeck
    const location = useLocation();
    const initialSelectedCards = location.state ? location.state.selectedCards : [];
    const [selectedCards, setSelectedCards] = useState(initialSelectedCards); // set selectedCards to state
    const [userDeck, setUserDeck] = useState(initialSelectedCards);
    const [deckCount, setDeckCount] = useState(initialSelectedCards.length); //keep track of the number of cards in user's deck
    const cardRefs = useRef([]);
    const carouselRef = useRef();

    //conditional rendering for game screen
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(null);

    const gameCardStyle = (category) => {
        return {
            backgroundImage: category === "God" ? "url(../../../public/god.png)" : "url(../../../public/beast.png)",
            backgroundRepeat: "no repeat",
            backgroundPosition: "center",
        };
    };

    const handlePrevClick = () => {
        carouselRef.current.prev();
    };

    const handleNextClick = () => {
        carouselRef.current.next();
    };

    const [ties, setTies] = useState(0);

    const [userLifePoints, setUserLifePoints] = useState(5000);
    const [userWins, setUserWins] = useState(0);
    const [userLossess, setUserLosses] = useState(0)
    const [userAttack, setUserAttack] = useState(0);
    const [userDefend, setUserDefend] = useState(0);
    const [userCard, setUserCard] = useState();

    //showing the points for the cards in user's deck at current index in carousel
    const [selectedAttackPoints, setSelectedAttackPoints] = useState();
    const [selectedDefensePoints, setSelectedDefensePoints] = useState();

    const [opponentLifePoints, setOpponentLifePoints] = useState(5000);
    const [opponentWins, setOpponentWins] = useState(0);
    const [opponentLossess, setOpponentLosses] = useState(0)
    const [opponentCard, setOpponentCard] = useState();
    const [showOpponentCard, setShowOpponentCard] = useState(false);
    
    const userCardRef = useRef(null);
    // const selectedCardRef = useRef(null);
    const selectedCardRef = useRef([]);
    const opponentCardRef = useRef();

        //userCardIndex = the order of cards in the carousel
    let [userCardIndex, setUserCardIndex] = useState(0);

    //keep track of the cards in the user's deck
    useEffect(() => {
        console.log("remaining user cards", userDeck);
        console.log("deck count", deckCount);
    }, [userDeck, deckCount]);

    const carouselIndex = (selectedIndex, e) => {
        setUserCardIndex(selectedIndex)
        const userCardEl = selectedCards[selectedIndex];
        if (userCardEl) {
            setSelectedAttackPoints(userCardEl.attack_points || 0)
            setSelectedDefensePoints(userCardEl.defense_points || 0)
            setUserAttack(userCardEl.attack_points || 0)
            setUserDefend(userCardEl.defense_points || 0)
        }
    }

    // remove card from the user deck once played
    const updateDeck = (index) => {
        const newDeck = selectedCards.filter((_, i) => i !== index);
        setSelectedCards(newDeck);
        setDeckCount(newDeck.length);
        setUserDeck(newDeck);

        if (newDeck.length > 0) {
            setUserCardIndex(0)
            const firstCard = newDeck[0]
            setSelectedAttackPoints(firstCard.attack_points || 0);
            setSelectedDefensePoints(firstCard.defense_points || 0)
        }
    }; 
    
    //computer pulls cards from the database to use to play
    const { loading, error, data } = useQuery(QUERY_CHARACTERS, {
        variables: { limit: 10 }
    });

    const fetchOpponentCard = (characters) => {
        if (characters && characters.length > 0) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomCard = characters[randomIndex];
            setOpponentCard(randomCard);
            // setShowOpponentCard(true);
             console.log("computer card", randomCard)
        }
    };

    useEffect(() => {
        if (data) {
            const characters = data.getCharacters || [];
            fetchOpponentCard(characters);
        }
        if (error) {
            console.error("error getting opponent card:", error)
        }
    }, [data, error]);

    // useEffect(() => {
    //     if (data) {
    //         const characters = data.getCharacters || [];
    //         const randomIndex = Math.floor(Math.random() * characters.length);
    //         // const randomOpponentCard  = characters[randomIndex];
    //         const randomCard = characters[randomIndex];
    //         setOpponentCard(randomCard);
    //         console.log("computer choices:", characters)
    //         console.log("computer card", randomCard)
    //     }
    //     if (error) {
    //         console.error("error getting opponent card:", error);
    //     }
    // }, [data, error]);

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
        setUserCard(userCard)
        console.log("user's card:", userCard)

        setUserCardIndex(0)

      //update user deck
        updateDeck(userCardIndex);
        console.log("remaining user cards", userDeck)
        console.log("deck count", deckCount)
        
        //reveal the computer's card 
        setTimeout(() => {
            setShowOpponentCard(true);
        }, 3000);

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

        setUserCardIndex(0)

      //update user deck
      updateDeck(userCardIndex);
      console.log("remaining user cards", userDeck)
      console.log("deck count", deckCount)
        
        //reveal the computer's card 
        setTimeout(() => {
            setShowOpponentCard(true);
        }, 3000);

        setUserAttack(userCard.attack_points || 0)
        setUserDefend(userCard.defense_points || 0)

        //run game logic
        playUserCard('defend');
    } 

    //clear the arena and get new fetch for opponent card
    const clearArena = () => {
        setTimeout(() => {
            setShowOpponentCard(false);
            // setShowUserCard(false);
            setUserCard(null);
            if (data && !error) {
                const characters = data.getCharacters || [];
                fetchOpponentCard(characters);
            }
        }, 5000)
    }

    //game logic
    function endGame() {
        if ((deckCount === 0) || (userLifePoints === 0) || (opponentLifePoints === 0)){
            setTimeout(() => {
                setGameOver(true);
                // setGameStarted(false);
                if (userWins > opponentWins || userLifePoints > opponentLifePoints){
                    setGameResult('win');
                } else if (userWins === opponentWins || userLifePoints === opponentLifePoints) {
                    setGameResult('tie');
                } else {
                    setGameResult('lose');
                }
            }, 5000)
        }
    }

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
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setOpponentLifePoints ((prev) => prev - (userAttack || 0)); //decrease opponent's life points by user's attack points
                        setUserLifePoints ((prev) => prev + (opponentAttack || 0)); //increase user's life points by opponent's attack points
                        console.log("you win!!")
                    }, 4000);
                } else if (userAttack === opponentAttack) {
                    setTimeout(() => {
                        setTies((prev) => prev + 1);
                        console.log("it's a tie")
                    }, 4000);
                } else {
                    setTimeout(() => {
                        setUserLosses((prev) => prev + 1);
                        setOpponentWins((prev) => prev + 1);
                        setOpponentLifePoints ((prev) => prev + (userAttack || 0));
                        setUserLifePoints((prev) => prev - (opponentAttack || 0));
                        console.log("you lose :(")
                    }, 4000);
                }

                    //opponent defends
                    //if attacker loses, half of the attack points from that card are taken from their total life points; if defender loses, the card’s defense points are subtracted from their total life points
            } else if (opponentSelection === 'opDefend') {
                if (userAttack > opponentDefend) {
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setOpponentLifePoints((prev) => prev - (userAttack || 0));
                        console.log("you win!!")
                    }, 4000);
                } else if (userAttack === opponentDefend) {
                    setTimeout(() => {
                        setTies((prev) => prev + 1);
                        console.log("it's a tie")
                    }, 4000);
                } else {
                    setTimeout(() => {
                        setUserLosses((prev) => prev + 1);
                        setOpponentWins((prev) => prev + 1);
                        setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                        console.log("you lose :(")
                    }, 4000);
                }
            }
            //userDefends
        } else if (userSelection === 'defend') {
                //opponent attacks
            if (opponentSelection === 'opAttack') {
                if (userDefend > opponentAttack) {
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setUserLifePoints ((prev) => prev + (opponentAttack || 0));
                    console.log("you win!!")
                    }, 4000);
                } else if (userDefend === opponentAttack) {
                    setTimeout(() => {
                        setTies((prev) => prev + 1);
                        console.log("it's a tie")
                    }, 4000);
                } else {
                    setTimeout(() => {
                        setUserLosses((prev) => prev + 1);
                        setOpponentWins((prev) => prev + 1);
                        setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                        console.log("you lose :(")
                    }, 4000);
                }
                    //opponent defends
            } else if (opponentSelection === 'opDefend') {
                setTies((prev) => prev + 1);
            }
        }
        //clear cards from arena to start again
        clearArena();
    }
    endGame();

    return (
        <section className="game-page">
            {/* rules screen */}
            {!gameStarted ? (
                <div className="rules-screen">
                    <h1 style={{ marginTop: "5%" }}>Rules</h1>
                    <p>Each player starts with 5,000 life points and with 10 cards</p>
                    <ol>
                        <li><strong>If both attack: </strong>The card with the highest number of attack points wins and absorbs the loser's attack points into their life points.</li>
                        <br />
                        <li><strong>If one attacks and one defends: </strong>If the attacker loses, half of the attack points from that card are taken from their total life points. If the defender loses, the card's defense points are subtracted from their total life points.</li>
                        <br />
                        <li><strong>If both attack or defend points are the same: </strong>Both players retreat, and no one wins or loses.</li>
                    </ol>
                    <p>The game ends when one or both players deplete their cards or life points.</p>
                    <Button onClick={() => setGameStarted(true)} id="begin-game-button">Begin</Button>
                </div>
            ) : (
                <div>
                    {/* end screen */}
                    {gameOver && (
                        <div className="end-screen">
                            {gameResult === 'win' &&
                                <div className="animate__animated animate__fadeInDown animate__delay-2s" id="win-screen">
                                    <h1>You Won</h1>
                                    <div className="end-buttons">
                                        <Button><NavLink to={{ pathname: "/createdeck" }}>Play Again</NavLink></Button>
                                        <Button><NavLink to={{ pathname: "/" }}>Home</NavLink></Button>
                                    </div>
                                </div>
                            }
                            {gameResult === 'tie' &&
                                <div className="animate__animated animate__fadeInDown animate__delay-2s" id="tie-screen">
                                    <h1>It's a tie</h1>
                                    <div className="end-buttons">
                                        <Button><NavLink to={{ pathname: "/createdeck" }}>Play Again</NavLink></Button>
                                        <Button><NavLink to={{ pathname: "/" }}>Home</NavLink></Button>
                                    </div>
                                </div>
                            }
                            {gameResult === 'lose' &&
                                <div id="lose-screen">
                                    <h1>You lose</h1>
                                    <div className="end-buttons">
                                        <Button><NavLink to={{ pathname: "/createdeck" }}>Play Again</NavLink></Button>
                                        <Button><NavLink to={{ pathname: "/" }}>Home</NavLink></Button>
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                    {/* game screen */}
                    {!gameOver && (
                        <div className="game-screen">
                            <Row>
                                <Col className="user-deck">
                                    <p>Life points: {userLifePoints}</p>
                                    <div className="points-box">
                                        <p>Wins: {userWins}</p>
                                        <p>Losses: {userLossess}</p>
                                        <p>Ties: {ties}</p>
                                    </div>
                                    <Carousel ref={carouselRef} onSelect={carouselIndex} className="user-deck-carousel">
                                        {userDeck.map((card, index) => (
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
                                            <Col><p style={{fontSize: "17px"}}>Attack Points: {selectedAttackPoints} </p></Col>
                                            <Col><p style={{fontSize: "17px"}}>Defense Points: {selectedDefensePoints}</p> </Col>
                                        </Row>
                                        <Row className="play-buttons">
                                            <Col><Button variant="primary" onClick={attack}>Attack</Button></Col>
                                            <Col><Button variant="primary"onClick={defend}>Defend</Button></Col>
                                        </Row>
                                    </Container>
                                
                                </Col>
                                <Col className="arena" xs={6}>
                                    <div className="battleground">
                                        <div className="user-card">
                                            {userCard && (
                                                <div className={`card ${userCard.category} animate__animated animate__slideInLeft`} style={gameCardStyle(userCard.category)}>
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
                                        <div className="opponent-card">
                                            {showOpponentCard ? (
                                                opponentCard && (
                                                    <div className={`card ${opponentCard.category} animate__animated animate__slideInRight`} style={gameCardStyle(opponentCard.category)}>
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
                                    </div>
                                </Col>
                                <Col className="opponent-deck">
                                    <p>Life points: {opponentLifePoints}</p>
                                    <div className="points-box">
                                        <p>Wins: {opponentWins}</p>
                                        <p>Losses: {opponentLossess}</p>
                                        <p>Ties: {ties}</p>
                                    </div>
                                    <img src={cardBack} style={{ width: "200px", height: "280px" }} />
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
    
}

export default Game;