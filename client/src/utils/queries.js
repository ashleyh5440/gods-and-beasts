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

export const QUERY_CHARACTERS = gql`
    query getCharacters {
        getCharacters {
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

export const QUERY_USERDECK = gql`
    query getUserDecks(user_id: $user_id) {
        getUserDecks(user_id: $user_id) {
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

export const QUERY_WINSANDLOSSES = gql`
    query getWinsAndLosses(user_id: $user_id) {
        _id
        username
        email
        highScore
        wins
        losses
    }
`;