import express from "express";
import expressGraphQl from "express-graphql";
import graphqlSchema from './schema/schema.js';
import mongoose from 'mongoose';
import cors from 'cors';
import resolvers from './resolver/resolver.js';
import typeDefs from './queries/queries.js';


import apollo from 'apollo-server';

const { ApolloServer, gql } =apollo;

// const app = express();
const { graphqlHTTP } = expressGraphQl;

//add mongoose
// mongoose.connect("mongodb+srv://dbUser:dbUserPassword@cluster0.dkfv8.mongodb.net/db-BookLovers?retryWrites=true&w=majority")
mongoose.connect("mongodb://localhost:27017/book-lovers")
mongoose.connection.once('open',()=>{
  console.log("connected to Database ")
});

// app.use(cors); 
// bind express with graphql


// app.use(
//   "/graphql",
//   graphqlHTTP({
//     // pass in a schema property
//     schema:graphqlSchema,
//     graphiql:true
//   })
// );

// app.listen(4000, () => {
//   console.log(" listening for requests on port 4000");
// });

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers,playground: {
  settings: {
    'editor.theme': 'light',
  }
} });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});



