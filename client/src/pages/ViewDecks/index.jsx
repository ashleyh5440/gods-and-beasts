//if user has no decks, show message telling them so and button to create deck
//if user has deck(s), display them
import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { QUERY_USERDECK } from '../../utils/queries';

function ViewDecks({ userId}) {
    const { loading, error, data } = useQuery(QUERY_USERDECK, {variables: { userId },
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const decks = data.getUserDecks;

    return (
        <section>
            {decks.length === 0 ? (
                <div>
                    <p>You have no decks.</p>
                </div>
            ) : (
                <div>
                    {decks.map(deck => (
                        <div key={deck._id}>
                            <p>Deck name: {deck.deck_name}</p>
                        </div>
                    ))};
                </div>
            )}
        </section>
    )
};

export default ViewDecks;