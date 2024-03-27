import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const ADD_CARD = gql`
    mutation addCard($characterId: ID!, $userDeckId: ID!) {
        addCard(characterId: $characterId, userDeckId: $userDeckId) {
            _id
            deck_name
            characters {
                _id
                name
                description
                category
                attack_points
                defense_points
                image
            }
        }
    }
`;

export const ADD_DECK = gql`
    mutation addDeck($userId: ID!, $deckName:String!) {
        addDeck(userId: $userId, deck_name: $deckName) {
            _id
            user_id
            deck_name
            characters {
                _id
                name
                description
                category
                attack_points
                defense_points
                image
            }
        }
    }
`;

export const ADD_WIN = gql`
    mutation addWin($userId: ID!) {
        addWin(userId: $userId){
            _id
            username
            email
            highScore
            wins
            losses
        }
    }
`;

export const ADD_LOSS = gql`
mutation addLoss($userId: ID!) {
    addLoss(userId: $userId){
        _id
        username
        email
        highScore
        wins
        losses
    }
}
`;

export const REMOVE_CARD = gql`
mutation removeCard($characterId: ID!, $userDeckId: ID!) {
    removeCard(characterId: $characterId, userDeckId: $userDeckId) {
        _id
        deck_name
        characters {
            _id
            name
            description
            category
            attack_points
            defense_points
            image
        }
    }
}
`;

export const REMOVE_DECK = gql`
mutation removeDeck($userId: ID!, $deckName: String!) {
    removeDeck(userId: $userId, deck_name: $deckName) {
        _id
        user_id
        deck_name
        characters {
            _id
            name
            description
            category
            attack_points
            defense_points
            image
        }
    }
}
`;