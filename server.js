import { Engine } from 'apollo-engine';
const engine = new Engine({ engineConfig: { apiKey: "insert_key_here" } });
engine.start();

import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
  type Query {
    posts: [Post],
    author(id: Int!): Author
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => find(authors, { id: id }),
  }
};

export const myGraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];
const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
];

const app = express();

app.use(engine.expressMiddleware());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema, tracing: true }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql', tracing: true })); // if you want GraphiQL enabled

app.listen(process.env.PORT);

