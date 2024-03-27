const { Character, User, UserDeck } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        getCharacters: async () => { //gets all characters from database
            try {
                const characters = await Character.find();
                return characters;
            } catch (error) {
                throw new Error('Failed to fetch characters');
            }
        },
        getUserDecks: async (_, { user_id }) => { //gets decks based on user id
            try {
                const userDecks = await UserDeck.find({ user_id });
                return userDecks;
            } catch (error) {
                throw new Error('Failed it fetch user decks');
            }
        },
        getWinsAndLosses: async (_, { user_id }) => { //gets wins and losses based on user id
            try {
                const user = await User.findById(user_id);
                return user;
            } catch (error) {
                throw new Error('Failed to fetch');
            }
        }
    },
    Mutation: {
        addUser: async (_, { username, email, password }) => { //adds user
            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user }
            } catch (error) {
                throw new Error('Failed to add user');
            }
        },
        login: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    throw new AuthenticationError('User not found');
                }
                const correctPassword = await user.isCorrectPAssword(password);
                if(!correctPassword) {
                    throw new AuthenticationError('Incorrect password');
                }
                const token = signToken(user);
                return { token, user };
            } catch (error) {
                throw new AuthenticationError('Login failed');
            }
        },
        addCard: async (_, { characterId, userDeckId }) => { //adds card to deck
            try {
                const userDeck = await UserDeck.findById(userDeckId);
                userDeck.characters.push(characterId);
                await userDeck.save();
                return userDeck;
            } catch (error) {
                throw new Error('Failed to add card to deck');
            }
        },
        addDeck: async (_, { user_id, deck_name }) => { //adds deck to user account
            try {
                const userDeck = await UserDeck.create({ user_id, deck_name });
                return userDeck;
            } catch (error) {
                throw new Error('Failed to add deck');
            }
        }, 
        addWin: async (_, { userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, { $inc: { losses: 1 } }, { new: true });
                return user;
            } catch (error) {
                throw new Error('Failed to add win');
            }
        },
        addLoss: async (_, { userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, { $inc: { losses: 1 } }, { new: true});
                return user;
            } catch (error) {
                throw new Error('Failed to add');
            }
        },
        removeCard: async (_, {characterId, userDeckId }) => {
            try {
                const userDeck = await UserDeck.findById(userDeckId);
                userDeck.characters = userDeck.characters.filter(charId => charId.toString() !== characterId);
                await userDeck.save();
                return userDeck;
            } catch (error) {
                throw new Error('Failed to remove card');
            }
        },
        removeDeck: async (_, { userDeckId }) => {
            try {
                await UserDeck.findByIdAndDelete(userDeckID);
                return { message: 'Deck deleted' };
            } catch (error) {
                throw new Error('Faled to remove deck');
            }
        }
    }
};

module.exports = resolvers; 