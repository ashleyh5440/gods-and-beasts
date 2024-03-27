import React from "react";
import { useQuery } from "@apollo/client";
import Card from "../../components/Card";

import Carousel from "react-bootstrap/Carousel";
//pull cards from Card component and display in carousel
const CreateDeck = () => {
    return (  
        <section>
            <div className="carousel-container">
                <Carousel>
                    {/* Map through characters and render Card component */}
                    {characters.map((character, index) => (
                        <Carousel.Item key={index}>
                            <Card 
                                category={character.category}
                                name={character.name}
                                image={character.image}
                                description={character.description}
                                attack_points={character.attack_points}
                                defense_points={character.defense_points}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </section>
    );
};

export default CreateDeck;
