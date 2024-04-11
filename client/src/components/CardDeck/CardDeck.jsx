import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import '../CardDeck/styles.css';
import Button from 'react-bootstrap/Button';

gsap.registerPlugin(Draggable);

const CardDeck = ({ cards, currentIndex, nextCard, prevCard }) => {
  const [deck, setDeck] = useState(cards);
  const cardRefs = useRef([]);
  const lastActionRef = useRef(null);

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

  return (
    <div className="card-container">
      {deck.map((card, index) => (
        <div
          className="card"
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          style={{ position: "absolute" }}
        >
          {card}
        </div>
      ))}
        <div className="nav-buttons">
                    <Button variant="primary" onClick={prevCard}>Previous</Button>
                    <Button variant="primary" onClick={nextCard}>Next</Button>
        </div>
    </div>
  );
};

export default CardDeck;