const {Schema, model} = require('mongoose');

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
        enum: ['God', 'Beast'], //for specific values
    },
    attack_points: {
        type: Number,
        required: true,
    },
    defense_points: {
        type: Number,
        required: true,
    },
    image: { //every card has single image name
        type: String,
        required: true,
    },
    // deck_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'UserDeck',
    //     default: null,
    // },
});

const Character = model('Character', characterSchema);

module.exports = Character;