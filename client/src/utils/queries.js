import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
        }
    }
`;

export const QUERY_USERDECK = gql`
    query getUserDecks($userId: ID!) {
        getUserDecks(user_id: $userId) {
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

export const QUERY_CHARACTERS = gql`
    query getCharacter($characterId: ID!) {
        getCharacter(characterId: $characterId) {
            _id
            name
            description
            category
            attack_points
            defense_points
            image
        }
    }
`;


export const QUERY_WINSANDLOSSES = gql`
    query getWinsAndLosses($userId: ID!) {
        getWinsAndLosses(user_id: $userId) {
            _id
            username
            email
            highScore
            wins
            losses
        }
    }
`;
