const { Schema, model } = require('mongoose');

const characterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['God', 'Beast'],
    },
    attack_points: {
        type: Number,
        required: true,
    },
    defense_points: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const userDeckSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Unnamed Deck',
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    characters: [characterSchema] // array of embedded character documents
});

const UserDeck = model('UserDeck', userDeckSchema);

module.exports = UserDeck;





// const { Schema, model } = require('mongoose');

// const userDeckSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         default: 'Unnamed Deck',
//     },
//     user_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     character_ids: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Character',
//     }],
// });

// const UserDeck = model('UserDeck', userDeckSchema);

// module.exports = UserDeck;