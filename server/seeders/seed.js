const db = require('../config/connection');
const { Character, User, UserDeck } = require('../models');
const characterSeeds = require('./characterSeeds.json');

const cleanDB = require('./cleanDB');

db.once('open', async () => {
    try {
        await cleanDB('Character', 'characters');
        await cleanDB('User', 'users');
        await cleanDB('UserDeck', 'userdecks');
    } catch (error) {
        console.error('Error in cleaning database', error);
    }
});