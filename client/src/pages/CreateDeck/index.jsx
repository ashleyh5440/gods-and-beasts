import React from "react";
import Card from '../../components/Card';

import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

const CreateDeck = ({ cards }) => {
    return (
        <section>
            <div className="carousel-container">
                <Carousel>
                    <Carousel.Item>
                        {/* map of cards */}
                        {cards.map((card, index) => {
                            <Card 
                                key={index}
                                category={card.category}
                                name={card.name}
                                image={card.image}
                                description={card.description}
                                attack_points={card.attack_points}
                                defense_points={card.defense_points}
                            />
                        })}
                            {/* <ExampleCarouselImage text="First slide" />
                            <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption> */}
                    </Carousel.Item>
                </Carousel>
            </div>
        </section>
    );
};

export default CreateDeck;