import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";

const typeDefs = `#graphql
    type Query {
        hello: String
    }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

// Launch the server
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {})
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
