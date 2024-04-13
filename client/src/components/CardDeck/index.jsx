import React, { useState } from "react";
import CardDeck from "./CardDeck";
import Button from 'react-bootstrap/Button';
import '../CardDeck/styles.css';

function Deck() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const cardOptions = [
        "hi",
        "how",
        "are",
        "you",
        "doing"
    ];

    const nextCard = () => {
        console.log("next clicked")
        setCurrentIndex((prevIndex) =>
        prevIndex === cardOptions.length - 1 ? 0 : prevIndex + 1);
    };

    const prevCard = () => {
        console.log("prev clicked")
        setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? cardOptions.length - 1 : prevIndex - 1);
    };

    return (
        <section id="carddeck-container">
            <div className="deck-container">
                <CardDeck
                currentIndex={currentIndex}
                cards={cardOptions}
                nextCard={nextCard}
                prevCard={prevCard}
                />
            </div>
        </section>
    );
}

export default Deck;