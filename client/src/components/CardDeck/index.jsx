import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import ReactCardFlip from 'react-card-flip';
import Button from 'react-bootstrap/Button';
import '../CardDeck/styles.css';

gsap.registerPlugin(Draggable);

const backgroundStyles = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
};

const CardDeck = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const cardOptions = [
        "hi",
        "how",
        "are",
        "you",
        "doing"
    ];

    const nextCard = () => {
        console.log("next clicked");
        setCurrentIndex((prevIndex) =>
            prevIndex === cardOptions.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevCard = () => {
        console.log("prev clicked");
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? cardOptions.length - 1 : prevIndex - 1
        );
    };

    return (
        <section id="carddeck-container">
            <div className="deck-container">
                <DeckProperities
                    currentIndex={currentIndex}
                    selectedCards={cardOptions}
                    nextCard={nextCard}
                    prevCard={prevCard}
                />
            </div>
        </section>
    );
};

const getBackgroundImage = (category) => {
    switch (category) {
        case 'God':
            return "url(../../../public/god.png)";
        case 'Beast':
            return "url(../../../public/beast.png)";
        default:
            return "";
    }
};

const DeckProperities = ({ currentIndex, selectedCards, exceedLimit }) => {
    const [deck, setDeck] = useState(selectedCards.map(() => ({ isFlipped: false })));
    const cardRefs = useRef([]);

    useEffect(() => {
        if (cardRefs.current.length > 0 && currentIndex >= 0 && currentIndex < cardRefs.current.length) {
            gsap.to(cardRefs.current[currentIndex], { x: 0, y: 0 });
        }
    }, [currentIndex]);

    useEffect(() => {
        setDeck(selectedCards);
    }, [selectedCards]);

    useEffect(() => {
        cardRefs.current.forEach((card, index) => {
            // Drag handler logic
        });
    }, [deck]);

    return (
        <div className="card-deck-container">
            {/* Card rendering logic */}
            {deck.map((card, index) => (
                <ReactCardFlip 
                    isFlipped={card.isFlipped} 
                    flipDirection="horizontal" 
                    key={index} 
                    ref={(el) => (cardRefs.current[index] = el)} 
                >
                    {/* Card front */}
                    <div className="selected-card" style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
                        {/* Card content */}
                    </div>
                    
                    {/* Card back */}
                    <div className="selected-card" style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
                        {/* Card content */}
                    </div>
                </ReactCardFlip>
            ))}
            {exceedLimit && <p>You can only choose 10 cards.</p>}
        </div> 
    );
};

export default CardDeck;




// import React, { useState } from "react";
// import CardDeck from "./CardDeck";
// import Button from 'react-bootstrap/Button';
// import '../CardDeck/styles.css';

// function Deck() {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const cardOptions = [
//         "hi",
//         "how",
//         "are",
//         "you",
//         "doing"
//     ];

//     const nextCard = () => {
//         console.log("next clicked")
//         setCurrentIndex((prevIndex) =>
//         prevIndex === cardOptions.length - 1 ? 0 : prevIndex + 1);
//     };

//     const prevCard = () => {
//         console.log("prev clicked")
//         setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? cardOptions.length - 1 : prevIndex - 1);
//     };

//     return (
//         <section id="carddeck-container">
//             <div className="deck-container">
//                 <CardDeck
//                 currentIndex={currentIndex}
//                 cards={cardOptions}
//                 nextCard={nextCard}
//                 prevCard={prevCard}
//                 />
//             </div>
//         </section>
//     );
// }

// export default Deck;