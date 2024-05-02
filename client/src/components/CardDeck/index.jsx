import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import '../CardDeck/styles.css';
import Button from 'react-bootstrap/Button';

gsap.registerPlugin(Draggable);

const CardDeck = forwardRef(({ currentIndex, selectedCards, exceedLimit, category }, ref) => {
  const [deck, setDeck] = useState(selectedCards.map(() => ({ isFlipped: false })));
  const cardRefs = useRef([]);

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
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
  };

  const lastActionRef = useRef(null);
  
  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      gsap.set(card, { zIndex: deck.length - index });
      let prevPosition = `${(index + 1) * 5}`;
      if (lastActionRef.current === "right") {
        gsap.to(
          card,

          { rotation: `${index * 1}deg`, duration: 0.25 }
        );
      } else {
        gsap.fromTo(
          card,
          { rotation: prevPosition },
          { rotation: `${index * 1}deg`, duration: 0.25 }
        );
      }

      Draggable.create(card, {
        type: "x",
        bounds: { minX: -50, maxX: 50 },
        edgeResistance: 0.75,
        onDragEnd: function () {
          lastActionRef.current = "left";
          if (Math.abs(this.x) >= 50) {
            gsap.set(this.target, { zIndex: 0 });
            animateToBackOfDeck(this.target, card, index);
          } else {
            gsap.to(this.target, { x: 0 });
          }
        }
      });
    });
  }, [deck]);

  const animateToBackOfDeck = (target, card, index) => {
    gsap.to(target, {
        x: 0,
        y: 0,
        scale: 0.9,
        zIndex: 0,
        rotation: (cardRefs.current.length - 1) * 2,
        duration: 0.35,
        onComplete: function () {
            console.log("see me?")
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

  const animateToFrontOfDeck = (target, card, index) => {
    gsap.set(target, { zIndex: cardRefs.current.length + 1 });

    gsap.fromTo(
      target,
      { x: 250, y: 0 },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
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

  const handleDeckClick = (index) => {
    setDeck((prevDeck) => {
       const newDeck = [...prevDeck];
    });
  };

  return (
    <div className="card-deck-container">
      {deck.map((card, index) => (
        <div 
          className="selected-card" 
          onClick={() => handleDeckClick(index)} 
          style={{ backgroundImage: getBackgroundImage(selectedCards[index].category), ...backgroundStyles, position:"absolute"}}
          key={index}
          ref={(el) => (cardRefs.current[index] = el)} 
        >
          <div className="card-content">
            <div className="name-category">
              <h3>{selectedCards[index].name}</h3>
            </div>
            <div className="card-img">
              <img src={`/images/${selectedCards[index].image}`} alt={selectedCards[index].name} />
            </div>
            {/* Render additional content if needed */}
          </div>
        </div>
      ))}
      {exceedLimit && <p>You can only choose 10 cards.</p>}
    </div> 
  );
});

export default CardDeck;



// import React, { useState, useEffect, useRef, forwardRef } from 'react';
// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import '../CardDeck/styles.css';
// import Button from 'react-bootstrap/Button';

// import ReactCardFlip from 'react-card-flip';

// gsap.registerPlugin(Draggable);

// const CardDeck = forwardRef(({ currentIndex, selectedCards, exceedLimit, category }, ref) => {
//   const [deck, setDeck] = useState(selectedCards.map(() => ({ isFlipped: false })));
//   const cardRefs = useRef([]);

//   const getBackgroundImage = (category) => {
//     switch (category) {
//       case 'God':
//         return "url(../../../public/god.png)";
//       case 'Beast':
//         return "url(../../../public/beast.png)";
//       default:
//         return "";
//     }
//   };

//   const backgroundStyles = {
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "100% 100%",
//     backgroundPosition: "center",
//   };

//   useEffect(() => {
//     setDeck(selectedCards.map(() => ({ isFlipped: false }))); // Reset deck when selectedCards change
//   }, [selectedCards]);

//   useEffect(() => {
//     if (cardRefs.current.length > 0) {
//       // Initialize Draggable for each card
//       cardRefs.current.forEach((card, index) => {
//         Draggable.create(card, {
//           type: "x,y",
//           bounds: { minX: -200, maxX: 200, maxY: 200, minY: -200 },
//           edgeResistance: 0.75,
//           onDragEnd: function () {
//             if (Math.abs(this.x) >= 50 || Math.abs(this.y) >= 50) {
//               animateBackOfDeck(this.target, card, index);
//             } else {
//               gsap.to(this.target, { x: 0, y: 0 });
//             }
//           }
//         });
//       });
//     }
//   }, [cardRefs.current]); // Run effect when cardRefs change

//   const animateBackOfDeck = (target, card, index) => {
//     gsap.to(target, {
//       x: 0,
//       y: 0,
//       scale: 0.9,
//       zIndex: 0,
//       rotation: index * 5,
//       duration: 0.35,
//       onComplete: function () {
//         gsap.set(card, { scale: 1 });
//         const newDeck = [...deck];
//         newDeck.push(newDeck.splice(index, 1)[0]); // Move card to the end of the deck
//         setDeck(newDeck);
//       }
//     });
//   };

//   const handleDeckClick = (index) => {
//     setDeck((prevDeck) => {
//       const newDeck = [...prevDeck];
//       newDeck[index].isFlipped = !newDeck[index].isFlipped;
//       return newDeck;
//     });
//   };

//   return (
//     <div className="card-deck-container">
//       {deck.map((card, index) => (
//         <ReactCardFlip 
//           isFlipped={card.isFlipped} 
//           flipDirection="horizontal" 
//           key={index} 
//           ref={(el) => (cardRefs.current[index] = el)} 
//         >
//           <div 
//             className="selected-card" 
//             onClick={() => handleDeckClick(index)} 
//             style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}
//           >
//             <div className="card-content">
//               <div className="name-category">
//                 <h3>{card.name}</h3>
//               </div>
//               <div className="card-img">
//                 <img src={`/images/${card.image}`} alt={card.name} />
//               </div>
//             </div>
//           </div>
        
//           <div 
//             className="selected-card" 
//             onClick={() => handleDeckClick(index)} 
//             style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}
//           >
//             <div className="card-content">
//               <div className="character-info">
//                 <p>{card.description}</p>
//               </div>
//               <div className="points">
//                 <p>Attack: {card.attack_points}<br/>
//                 Defense: {card.defense_points}</p>
//               </div>
//             </div>
//           </div>
//         </ReactCardFlip>
//       ))}
//       {exceedLimit && <p>You can only choose 10 cards.</p>}
//     </div> 
//   );
// });

// export default CardDeck;







// import React, { useState, useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import ReactCardFlip from 'react-card-flip';
// import Button from 'react-bootstrap/Button';
// import '../CardDeck/styles.css';

// gsap.registerPlugin(Draggable);

// const backgroundStyles = {
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "100% 100%",
//     backgroundPosition: "center",
// };

// const CardDeck = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const cardOptions = [
//         "hi",
//         "how",
//         "are",
//         "you",
//         "doing"
//     ];

//     const nextCard = () => {
//         console.log("next clicked");
//         setCurrentIndex((prevIndex) =>
//             prevIndex === cardOptions.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const prevCard = () => {
//         console.log("prev clicked");
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? cardOptions.length - 1 : prevIndex - 1
//         );
//     };

//     return (
//         <section id="carddeck-container">
//             <div className="deck-container">
//                 <DeckProperities
//                     currentIndex={currentIndex}
//                     selectedCards={cardOptions}
//                     nextCard={nextCard}
//                     prevCard={prevCard}
//                 />
//             </div>
//         </section>
//     );
// };

// const getBackgroundImage = (category) => {
//     switch (category) {
//         case 'God':
//             return "url(../../../public/god.png)";
//         case 'Beast':
//             return "url(../../../public/beast.png)";
//         default:
//             return "";
//     }
// };

// const DeckProperities = ({ currentIndex, selectedCards, exceedLimit }) => {
//     const [deck, setDeck] = useState(selectedCards.map(() => ({ isFlipped: false })));
//     const cardRefs = useRef([]);

//     useEffect(() => {
//         if (cardRefs.current.length > 0 && currentIndex >= 0 && currentIndex < cardRefs.current.length) {
//             gsap.to(cardRefs.current[currentIndex], { x: 0, y: 0 });
//         }
//     }, [currentIndex]);

//     useEffect(() => {
//         setDeck(selectedCards);
//     }, [selectedCards]);

//     useEffect(() => {
//         cardRefs.current.forEach((card, index) => {
//             // Drag handler logic
//         });
//     }, [deck]);

//     return (
//         <div className="card-deck-container">
//             {/* Card rendering logic */}
//             {deck.map((card, index) => (
//                 <ReactCardFlip 
//                     isFlipped={card.isFlipped} 
//                     flipDirection="horizontal" 
//                     key={index} 
//                     ref={(el) => (cardRefs.current[index] = el)} 
//                 >
//                     {/* Card front */}
//                     <div className="selected-card" style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
//                         {/* Card content */}
//                     </div>
                    
//                     {/* Card back */}
//                     <div className="selected-card" style={{ backgroundImage: getBackgroundImage(card.category), ...backgroundStyles, position:"absolute"}}>
//                         {/* Card content */}
//                     </div>
//                 </ReactCardFlip>
//             ))}
//             {exceedLimit && <p>You can only choose 10 cards.</p>}
//         </div> 
//     );
// };

// export default CardDeck;

