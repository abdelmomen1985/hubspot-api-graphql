import { GraphQLServer } from "graphql-yoga";
import UnparsedObject from "graphql-type-json";
import Query from "./resolvers/query-resolvers";
import Mutation from "./resolvers/mutation-resolvers";
import context from "./context";

require("dotenv").config();

const typeDefs = require("./schemas/hubspot.graphql").typeDefs;
const resolvers = { Query, Mutation, UnparsedObject };
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context,
});

const { PORT: port, NODE_ENV } = process.env;

server.start(
  {
    cors: {
      credentials: true,
      origin: "*"
    },
    port: 7080,
    endpoint: `/api/v1`,
    tracing: NODE_ENV === "development",
    cacheControl: true,
  },
  ({ port }) =>
    console.log(
      `Server started, listening on port http://localhost:${port} for incoming requests.`
    )
);
