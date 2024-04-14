import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import '../Game/styles.css';

function Game() {
    const location = useLocation();

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

    return (
        <section id="game-page">
            <div className="decks">
                <div className="opponent-deck">Opponent's Deck</div>
                
                {/* User's deck */}
                <div className="user-deck">
                    <h3>Your Deck</h3>
                    <div className="card-row">
                        {location.state && location.state.selectedCards && location.state.selectedCards.map((card, index) => (
                            <div className={`col-md-${12 / location.state.selectedCards.length}`} key={index}>
                                <div className={`card ${card.category}`}>
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
                    </div>
                </div>
            </div>
            <div className="arena">Arena</div>
        </section>
    )
}

export default Game;



// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// import '../Game/styles.css';

// function Game() {
//     const location = useLocation();
//     const [selectedCards, setSelectedCards] = useState([]);

//     useEffect(() => {
//         if (location.state && location.state.selectedCards) {
//             setSelectedCards(location.state.selectedCards);
//             console.log("Selected cards updated in Game component:", location.state.selectedCards);
//         } else {
//             console.log("there's a problem", location.state);
//         }
//     }, [location.state]);

//     useEffect(() => {
//         console.log("selected cards:", selectedCards);
//     }, [selectedCards]);

//     return (
//         <section id="game-page">
//             <div className="decks">
//                 <div className="opponent-deck">h</div>
                
//                 {/* user's deck */}
//                 <div className="user-deck">
//                     <h3>Your Deck</h3>
//                     <div className="card-row">
//                         {selectedCards.map((card, index) => (
//                             <div className={`col-md-${12 / selectedCards.length}`} key={index}>
//                                 <div className={`card ${card.category}`}>
//                                     <div className="card-content">
//                                         <div className="name-category">
//                                             <h4>{card.name}</h4>
//                                         </div>
//                                         <div className="card-img">
//                                             <img src={`/images/${card.image}`} />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             <div className="arena">and me?</div>
//         </section>
//     )
// };

// export default Game;