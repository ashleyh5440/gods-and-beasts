const typeDefs = `
    type Character {
        _id: ID!
        name: String!
        description: String!
        category: String!
        attack_points: Int!
        defense_points: Int!
        image: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        highScore: Int
        wins: Int
        losses: Int
    } 

    type UserDeck {
        _id: ID!
        userId: ID!
        deck_name: String!
        characters: [Character]!
    }

    type Auth {
        token: ID!
        user: User
      }

    type Query {
        getCharacters: [Character]
        getUserDecks(userId: ID!): [UserDeck]
        getWinsAndLosses(userId: ID!): User
    }
    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addCard(characterId: ID!, userDeckId: ID!): UserDeck
        addDeck(userId: ID!, deck_name: String!): UserDeck
        addWin(userId: ID!): User
        addLoss(userId: ID!): User
        removeCard(characterId: ID!, userDeckId: ID!): UserDeck
        removeDeck(userId: ID): User
    }
`;

module.exports = typeDefs; 