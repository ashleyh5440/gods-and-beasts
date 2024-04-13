import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import '../CardDeck/styles.css';
import Button from 'react-bootstrap/Button';

import ReactCardFlip from 'react-card-flip';

gsap.registerPlugin(Draggable);

  const CardDeck = ({ currentIndex, selectedCards, exceedLimit, category }) => {
  // const [deck, setDeck] = useState(selectedCards);
  const [deck, setDeck] = useState(selectedCards.map(() => ({ isFlipped: false })));
  const cardRefs = useRef([]);
  const lastActionRef = useRef(null);

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

  const backgroundStyles = {
    backgroundRepeat: "no repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
  };

  useEffect(() => {
    if (cardRefs.current.length > 0 && currentIndex >= 0 && currentIndex < cardRefs.current.length) {
      gsap.to(cardRefs.current[currentIndex], { x: 0, y: 0 });
    }
  }, [currentIndex]);

  const animateBackOfDeck = (target, card, index) => {
    gsap.to(target, {
      x: 0,
      y: 0,
      scale: 0.9,
      zIndex: 0,
      rotation: index * 5,
      duration: 0.35,
      onComplete: function () {
        gsap.set(card, { scale: 1 });
        const newDeck = [...deck];
        const newDeckRef = [...cardRefs.current];
        const [removed] = newDeck.splice(index, 1);
        const [removedRef] = newDeckRef.splice(index, 1);
        newDeck.push(removed);
        newDeckRef.push(removedRef);
        cardRefs.current = newDeckRef;
        setDeck(newDeck);
      }
    });
  };
  
  const animateFrontOfDeck = (target, card, index) => {
    gsap.set(target, { zIndex: cardRefs.current.length + 1 });
  
    gsap.to(
      target,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.35,
        onComplete: function () {
          gsap.set(card, { scale: 1 });
          const newDeck = [...deck];
          const newDeckRef = [...cardRefs.current];
          const [removed] = newDeck.splice(index, 1);
          const [removedRef] = newDeckRef.splice(index, 1);
          newDeck.unshift(removed);
          newDeckRef.unshift(removedRef);
          cardRefs.current = newDeckRef;
          setDeck(newDeck);
        }
      }
    );
  };
  
  useEffect(() => {
    setDeck(selectedCards);
  }, [selectedCards]);

  // Drag handler
  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      gsap.set(card, { zIndex: deck.length - index });
  
      Draggable.create(card, {
        type: "x,y",
        bounds: { minX: -200, maxX: 200, maxY: 200, minY: -200 },
        edgeResistance: 0.75,
        onDragEnd: function () {
          if (Math.abs(this.x) >= 50 || Math.abs(this.y) >= 50) {
            gsap.set(this.target, { zIndex: 0 });
            animateBackOfDeck(this.target, card, index);
          } else {
            gsap.to(this.target, { x: 0, y: 0 });
          }
        }
      });
    });
  }, [deck]);

  const [isFlipped, setIsFlipped] = useState(false);

    const handleDeckClick = (index) => {
        setDeck((prevDeck) => {
          const newDeck = [...prevDeck];
          newDeck[index].isFlipped = !newDeck[index].isFlipped;
          return newDeck;
        })
        console.log(handleDeckClick)
    };


  return (
    <div className="card-deck-container">
      {deck.map((card, index) => (
        <ReactCardFlip 
          isFlipped={card.isFlipped} 
          flipDirection="horizontal" 
          key={index} 
          ref={(el) => (cardRefs.current[index] = el)} 
        >
        {/* card front */}
        <div className="selected-card" onClick={() => handleDeckClick(index, card)} style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
          <div className="card-content">
            <div className="name-category">
              <h3>{card.name}</h3>
            </div>
            <div className="card-img">
              <img src={`/images/${card.image}`} alt={card.name} />
            </div>
          </div>
        </div>
        
        {/* card back */}
          <div className="selected-card" onClick={() => handleDeckClick(index, card)} style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
            <div className="card-content">
              <div className="character-info">
                <p>{card.description}</p>
              </div>
              <div className="points">
                <p>Attack: {card.attack_points}<br/>
                Defense: {card.defense_points}</p>
              </div>
            </div>
          </div>
        </ReactCardFlip>
    ))}
    {exceedLimit && <p>You can only choose 10 cards.</p>}
    </div> 
  );
};

export default CardDeck;