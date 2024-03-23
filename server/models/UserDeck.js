const { Schema, model } = require('mongoose');

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
    character_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Character',
    }],
});

const UserDeck = model('UserDeck', userDeckSchema);

module.exports = UserDeck;