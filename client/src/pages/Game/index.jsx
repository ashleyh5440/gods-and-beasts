import React, { useEffect, useState, useRef } from "react";
import { useLocation,  } from "react-router-dom";
import { QUERY_CHARACTERS } from "../../utils/queries";

import CardDeck from '../../components/CardDeck';
// import CardDeck from '../../components/CardDeck/CardDeck.jsx';
import '../Game/styles.css';

function Game() {

    //getting cards from CreateDeck
    const location = useLocation();
    const initialSelectedCards = location.state ? location.state.selectedCards : [];
    const [selectedCards, setSelectedCards] = useState(initialSelectedCards); // set selectedCards to state
    const cardRefs = useRef([]);

    const gameCardStyle = (category) => {
        return {
            backgroundImage: category === "God" ? "url(../../../public/god.png)" : "url(../../../public/beast.png)",
            backgroundRepeat: "no repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
        };
    };

    useEffect(() => {
        if (location.state && location.state.selectedCards) {
            console.log("Selected cards updated in Game component:", location.state.selectedCards);
        } else {
            console.log("There's a problem with location state:", location.state);
        }
    }, [location.state]);

    useEffect(() => {
        console.log("location state:", location.state);
    }, [location.state]);


    //game logic

    const [numCards, setNumCards] = useState(10);
    const [wins, setWins] = useState();
    const [losses, setLosses] = useState();
    const [ties, setTies] = useState();
    const [userLifePoints, setUserLifePoints] = useState(10000);
    const [opponentLifePoints, setOpponentLifePoints] = useState(10000);
    const [userAttack, setUserAttack] = useState();
    const [userDefend, setUserDefend] = useState();
    const [opponentAttack, setOpponentAttack] = useState();
    const [opponentDefend, setOpponentDefend] = useState();
    const [opponentCard, setOpponentCard] = useState();
    
    const userCardRef = useRef();
    const opponentCardRef = useRef();

    //define attack and defend
    //user has to choose before the computer
    const attack = async() => {
        await getNewOpponentCard()
        playUserCard("attack")
    } 
    const defend = async() => {
        await getNewOpponentCard()
        playUserCard("attack")
    } 


    //remove/disable user's selected card
        //cards are in a carousel, clicking on one makes attack/defend options appear
    function userSelection() {
        //when user chooses a card, something happens(color change, noise, disappears?) to indicate that it has been selected, attack/defend buttons appear. add back button to un-select it?
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

    //duplicate user's selected card to arena div
    function moveUserCard() {
        
    }

    //get opponent card, randomly pulled from database
    const getNewOpponentCard = async () => {
        const { loading, error, data } = useQuery(QUERY_CHARACTERS);

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error.message}</p>;

        const characters = data.getCharacters || [];
    }

    //choice handlers

    //compare points


    return (
        <section className="game-page">
            <div className="game-page-container">
                <div className="decks">
                    <div className="opponent-deck">
                        Opponent's Deck
                    </div>
                        
                    <div className="user-deck">
                        <h3>Your Deck</h3>
                        {/* <div className="card-row">
                            {selectedCards.map((card, index) => (
                            <div className={`col-md-${12 / location.state.selectedCards.length}`} key={index}>
                                <div className={`card ${card.category}`} style={gameCardStyle(card.category)}>
                                    <div className="card-content">
                                        <div className="name-category">
                                            <h4>{card.name}</h4>
                                        </div>
                                        <div className="card-img">
                                            <img src={`/images/${card.image}`} alt={card.name} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div> */}
                        <CardDeck ref={cardRefs} selectedCards={selectedCards} />
                    </div>
                </div>
                <div className="arena">
                    <div className="battleground">
                        <div className="opponent-card"></div>
                        <div className="user-card"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Game;
