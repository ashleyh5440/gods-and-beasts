const db = require('../config/connection');
const { Character, User, UserDeck } = require('../models');
const characterSeeds = require('./characterSeeds.json');

const cleanDB = require('./cleanDB');

db.once('open', async () => { //listens for 'open' event to execute function
    try {
        try { //resets the collections
            await cleanDB('Character', 'characters');
            await cleanDB('User', 'users');
            await cleanDB('UserDeck', 'userdecks');
        } catch (error) {
            console.error('Error in cleaning database', error);
        }

        await Character.create(characterSeeds); //creates documents in Character collection
        console.log('characters seeded');

        //example user for testing
        const user = await User.create({ //creates new user
            username: 'exampleUser',
            email: 'user@example.com',
            password: 'password123'
        });

        //example deck for testing
        const userDeck = await UserDeck.create({ //creates new user deck
            user_id: user._id,
            deck_name: 'Example Deck',
            characters: characterSeeds.map(character => character._id)
        });
        console.log('user and userdeck seeded');
        console.log('all done!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database', error);
    }
})