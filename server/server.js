const express = require('express');   //importing Express.js
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const db = require('./config/connection');   //importing database connection module
const { typeDefs, resolvers } = require('./schemas');

const models = require('./models')   //importing models

const PORT = process.env.PORT || 3001;   //setting port number for server, defaulting to 3001 if not provided
const app = express();   //creating Express application instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => { //starts the apollo server
    await server.start();
    
    app.use(express.urlencoded({ extended: false }));   //middleware to parse urlencoded request bodies
    app.use(express.json()); //middleware to parse JSON request bodies
    
      
    if (process.env.NODE_ENV === 'production') { //graphQL middleware
      app.use(express.static(path.join(__dirname, '../client/dist')));
  
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    } 
      app.use('/graphql', expressMiddleware(server));
      
      app.get("/", (req, res) => { //test route to make sure everything's working
      res.send("Working");
    });
  }

db.once('open', () => {   //event listener on db (line 3), listens for the 'open' event/database connection is successful
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });


startApolloServer();

