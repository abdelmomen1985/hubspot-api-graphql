import {GraphQLServer} from 'graphql-yoga'
import UnparsedObject from 'graphql-type-json';
import Query from './query-resolvers';
import context from './context';

require('dotenv').config();

const typeDefs = require('./schemas/hubspot.graphql').typeDefs;
const resolvers = { Query, UnparsedObject };
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context
});

const { PORT: port, NODE_ENV } = process.env;

server.start(
  {
    port,
    endpoint: `/api/v1`,
    tracing: NODE_ENV === 'development',
    cacheControl: true
  },
  ({ port }) =>
    console.log(`Server started, listening on port ${port} for incoming requests.`)
);
