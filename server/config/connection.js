const mongoose = require('mongoose'); //importing Mongoose library

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gods-and-beasts');

module.exports = mongoose.connection;