import React, { useEffect, useState, useRef } from "react";
import { useLocation,  } from "react-router-dom";
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../../utils/queries";
import Auth from '../../utils/auth';

import cardBack from '../../../public/card-back.png';
import blood from '../../../public/blood.png'
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//sound effects
import cardSound from '/sound-effects/card-sound.mp3';
import chimeSound from '/sound-effects/chime.mp3';
import bloodSplatSound from '/sound-effects/splat.mp3';
import winSound from '/sound-effects/win-voice.mp3';
import loseSound from '/sound-effects/defeat-voice.mp3' ;

import 'animate.css';
import useSound from 'use-sound';
import '../Game/styles.css';


function Game() {

    //checks if user is logged in
    const isLoggedIn = () => {
        return Auth.loggedIn();
    }

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

    const [playCardSound] = useSound(cardSound);
    const [playChimeSound] = useSound(chimeSound);
    const [playSplatSound] = useSound(bloodSplatSound);
    const [playWinSound] = useSound(winSound);
    const [playLoseSound] = useSound(loseSound);

    function rain() {
        let amount = 40;
        let body = document.querySelector('body');
        let i = 0;
        while(i < amount) {
            let drop = document.createElement('i');

            let size = Math.random() * 5;
            let posX = Math.floor(Math.random() * window.innerWidth);
            let delay = Math.random() * -90;
            let duration = Math.random() * 50;

            drop.style.width = 0.2 + size + 'px';
            drop.style.top = 0;
            drop.style.left = posX + 'px';
            drop.style.animationDelay = delay + 's';
            drop.style.animationDuration = duration + 's';

            body.appendChild(drop);
            i++;
        }
    }

    function removeRain() { //removes rain animation when leaving the page
        let body = document.querySelector('body');
        let drops = body.querySelectorAll('i');
        drops.forEach(drop => body.removeChild(drop));
    }

    useEffect(() => {
        rain();
        return () => {
            removeRain(); //calls remove function
        };
    }, []);

    const gameCardStyle = (category) => {
        return {
            backgroundImage: category === "God" ? "url(god.png)" : "url(beast.png)",
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

    const [losingCard, setLosingCard] = useState(null);
    const [showLosingAnimation, setShowLosingAnimation] = useState(false);
    const [pulseEffect, setPulseEffect] = useState(false)

    const selectedCardRef = useRef([]);
    const opponentCardRef = useRef();

    //keep track of user and computer selection
    const [userSelectionEl, setUserSelectionEl] = useState(null);
    const [opponentSelectionEl, setOpponentSelectionEl] = useState(null);

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
    //computer chooses to attack or defend
    const opponentSelection = Math.random() < 0.5 ? 'Attack' : 'Defend';

   {/* runs when user clicks attack button */} 
    const attack = async() => {
        console.log("attack button clicked")
        
        //move card to the center
        const userCard = selectedCards[userCardIndex]
        setUserCard(userCard)
        console.log("user's card:", userCard)
        playCardSound();

        setUserCardIndex(0)

      //update user deck
        updateDeck(userCardIndex);
        console.log("remaining user cards", userDeck)
        console.log("deck count", deckCount)
        
        //reveal the computer's card 
        setTimeout(() => {
            setShowOpponentCard(true);
            playCardSound();
            console.log("opp selection", opponentSelection);
        }, 3000);

        setTimeout(() => {
            setUserSelectionEl('Attack')
            setOpponentSelectionEl(opponentSelection)
        }, 5000);

        setUserAttack(userCard.attack_points || 0)
        setUserDefend(userCard.defense_points || 0)

        //run game logic
        await new Promise(resolve => setTimeout(resolve, 100));
        runGame('attack');
    } 

    //runs when user clicks defend button
    const defend = async() => {
        console.log("defend button clicked")

        //move card to the center
        const userCard = selectedCards[userCardIndex]
        setUserCard(userCard)
        console.log("user's card:", userCard)
        playCardSound();

        setUserCardIndex(0)

      //update user deck
      updateDeck(userCardIndex);
      console.log("remaining user cards", userDeck)
      console.log("deck count", deckCount)
        
        //reveal the computer's card 
        setTimeout(() => {
            setShowOpponentCard(true);
            playCardSound();
            console.log("opp selection", opponentSelection);
        }, 3000);

        setTimeout(() => {
            setUserSelectionEl('Defend')
            setOpponentSelectionEl(opponentSelection)
        }, 5000);

        setUserAttack(userCard.attack_points || 0)
        setUserDefend(userCard.defense_points || 0)

        //run game logic
        await new Promise(resolve => setTimeout(resolve, 100));
        runGame('defend');
    } 

    //clear the arena and get new fetch for opponent card
    const clearArena = () => {
        setTimeout(() => {
            setShowOpponentCard(false);
            setUserCard(null);
            setShowLosingAnimation(false);
            setLosingCard(null);
            setUserSelectionEl(null);
            setOpponentSelectionEl(null);
            if (data && !error) {
                const characters = data.getCharacters || [];
                fetchOpponentCard(characters);
            }
        }, 10000)
    }

    //game logic

    //end the game
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
            }, 10000)
        }
    }

    const runGame = (userSelection) => {
        console.log("userSelection:", userSelection);

        const randomCard = opponentCard;
        console.log("opponent card", randomCard);

        const userCard = selectedCards[userCardIndex];

        const opponentAttack = randomCard.attack_points || 0;
        const opponentDefend = randomCard.defense_points || 0;

        let losingCard = null; 

             //user attacks 
        if (userSelection === 'attack') {
            console.log("user attack points:", userAttack);
                //opponent attacks
            if (opponentSelection === 'Attack') {
                console.log("opp attack points", opponentAttack)
                if (userAttack > opponentAttack) {
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setOpponentLifePoints ((prev) => prev - (userAttack || 0));
                        setUserLifePoints ((prev) => prev + (opponentAttack || 0)); 
                        //not sure why this one doesn't work the way the others do
                        losingCard = randomCard;
                        setLosingCard(losingCard);
                        setTimeout(() => {
                            setShowLosingAnimation(true);
                            playSplatSound();  
                        }, 1000);
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
                    }, 4000);
                    losingCard = userCard;
                }

                    //opponent defends
            } else if (opponentSelection === 'Defend') {
                if (userAttack > opponentDefend) {
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setOpponentLifePoints((prev) => prev - (userAttack || 0));
                    }, 4000);
                    losingCard = randomCard;
                    setLosingCard(losingCard);
                } else if (userAttack === opponentDefend) {
                    setTimeout(() => {
                        setTies((prev) => prev + 1);
                    }, 4000);
                } else {
                    setTimeout(() => {
                        setUserLosses((prev) => prev + 1);
                        setOpponentWins((prev) => prev + 1);
                        setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                        console.log("you lose :(")
                    }, 4000);
                    losingCard = userCard;
                }
            }
            //userDefends
        } else if (userSelection === 'defend') {
                //opponent attacks
            if (opponentSelection === 'Attack') {
                if (userDefend > opponentAttack) {
                    setTimeout(() => {
                        setUserWins((prev) => prev + 1);
                        setOpponentLosses((prev) => prev + 1);
                        setUserLifePoints ((prev) => prev + (opponentAttack || 0));
                    }, 4000);

                    losingCard = randomCard;
                    setLosingCard(losingCard);
                    console.log("losing card?", losingCard)
                } else if (userDefend === opponentAttack) {
                    setTimeout(() => {
                        setTies((prev) => prev + 1);
                    }, 4000);
                } else {
                    setTimeout(() => {
                        setUserLosses((prev) => prev + 1);
                        setOpponentWins((prev) => prev + 1);
                        setUserLifePoints((prev) => prev - Math.floor((opponentAttack || 0) / 2));
                    }, 4000);
                    losingCard = userCard;
                }
                    //opponent defends
            } else if (opponentSelection === 'Defend') {
                setTies((prev) => prev + 1);
            }
        }
        if (losingCard) {
            setTimeout(() => {
                setLosingCard(losingCard);
                setShowLosingAnimation(true);
                playSplatSound();  
            }, 6000);
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
                                        {/* {isLoggedIn() && <Button>Save Score</Button>} */}
                                    </div>
                                </div>
                            }
                            {gameResult === 'tie' &&
                                <div className="animate__animated animate__fadeInDown animate__delay-2s" id="tie-screen">
                                    <h1>It's a tie</h1>
                                    <div className="end-buttons">
                                        <Button><NavLink to={{ pathname: "/createdeck" }}>Play Again</NavLink></Button>
                                        <Button><NavLink to={{ pathname: "/" }}>Home</NavLink></Button>
                                        {/* {isLoggedIn() && <Button>Save Score</Button>} */}
                                    </div>
                                </div>
                            }
                            {gameResult === 'lose' && 
                                <div id="lose-screen">
                                    <h1>You lose</h1>
                                    <div className="end-buttons">
                                        <Button><NavLink to={{ pathname: "/createdeck" }}>Play Again</NavLink></Button>
                                        <Button><NavLink to={{ pathname: "/" }}>Home</NavLink></Button>
                                        {/* {isLoggedIn() && <Button>Save Score</Button>} */}
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
                                    <Carousel ref={carouselRef} onSelect={carouselIndex} interval={null}className="user-deck-carousel">
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
                                    </Carousel>
                                    <div className="deck-buttons-container">
                                            <Button variant="primary" onClick={handlePrevClick}>&#10094;</Button>
                                            <Button variant="primary" onClick={handleNextClick}>&#10095;</Button>
                                        </div>
                                    <Container className="user-card-info">
                                        <Row>
                                            <Col><p style={{fontSize: "17px"}}>Attack Points<br /> {selectedAttackPoints} </p></Col>
                                            <Col><p style={{fontSize: "17px"}}>Defense Points<br /> {selectedDefensePoints}</p> </Col>
                                        </Row>
                                        <Row className="play-buttons">
                                            <Col><Button variant="primary" onClick={attack}>Attack</Button></Col>
                                            <Col><Button variant="primary"onClick={defend}>Defend</Button></Col>
                                        </Row>
                                    </Container>
                                
                                </Col>
                                <Col className="arena" xs={5}>
                                    <div className="battleground">
                                        <div className="card-box">
                                            <div className="selection">
                                                <p>{userSelectionEl}</p>
                                                {userSelectionEl === 'Attack' ? (
                                                <p>{userAttack}</p>
                                                ) : userSelectionEl === 'Defend' ? (
                                                <p>{userDefend}</p>
                                                ) : null}
                                            </div>
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
                                                        {showLosingAnimation && losingCard === userCard && (
                                                            <div className="blood-animation">
                                                                <img src={blood} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                        )}
                                        </div>
                                        </div>
                                        <div className="card-box">
                                            <div className="selection">
                                               <p>{opponentSelectionEl}</p>
                                               {opponentSelectionEl === 'Attack' ? (
                                                <p>{opponentCard?.attack_points}</p>
                                                ) : opponentSelectionEl === 'Defend' ? (
                                                <p>{opponentCard?.defense_points}</p>
                                                ) : null}
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
                                                            {showLosingAnimation && losingCard === opponentCard && (
                                                            <div className="blood-animation">
                                                                <img src={blood} />
                                                            </div>
                                                        )}
                                                        </div>
                                                    </div>
                                                    )
                                                ) : (
                                                <div></div>
                                                )}
                                                </div>
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
