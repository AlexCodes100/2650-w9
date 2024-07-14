import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import DataLoader from "dataloader";
import linkedList from "./linked_list.js";

// Data
const tweets = [
  { id: 1, body: "Lorem Ipsum", date: new Date(), author_id: 10 },
  { id: 2, body: "Sic dolor amet", date: new Date(), author_id: 11 },
];
const authors = [
  {
    id: 10,
    username: "johndoe",
    first_name: "John",
    last_name: "Doe",
    avatar_url: "acme.com/avatars/10",
  },
  {
    id: 11,
    username: "janedoe",
    first_name: "Jane",
    last_name: "Doe",
    avatar_url: "acme.com/avatars/11",
  },
];

// Schema definition
const typeDefs = `#graphql
  type Tweet {
    id: ID!
    body: String
    date: Date
    Author: User
  }

  type User {
    id: ID!
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url
  }

  type Node {
    value: Int
    next: Node
  }

  type LinkedList {
    head: Node
    length: Int
  }

  scalar Url
  scalar Date

  type Query {
    Tweet(id: ID!): Tweet
    Tweets(limit: Int, sortField: String, sortOrder: String): [Tweet]
    User: User
    linkedList: LinkedList
  }

  type Mutation {
    createTweet(body: String, author_id: ID!): Tweet
    deleteTweet(id: ID!): Tweet
    markTweetRead(id: ID!): Boolean
    addNode(value: Int!): Node
  }
`;

const resolvers = {
  Query: {
    Tweets: () => tweets,
    Tweet: (_, { id }) => tweets.find((tweet) => tweet.id == id),
    linkedList: () => ({
      head: linkedList.getHead(),
      length: linkedList.getLength(),
    }),
  },
  Tweet: {
    Author: (tweet, _, context) => {
      return context.authorLoader.load(tweet.author_id);
    },
  },
  User: {
    full_name: (author) => `${author.first_name} ${author.last_name}`,
  },
  Mutation: {
    createTweet: (_, { body, author_id }) => {
      const nextTweetId =
        tweets.reduce((id, tweet) => {
          return Math.max(id, tweet.id);
        }, -1) + 1;
      const newTweet = {
        id: nextTweetId,
        date: new Date(),
        author_id,
        body,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    addNode: (_, { value }) => linkedList.addNode(value),
  },
  LinkedList: {
    head: (list) => list.head,
    length: (list) => list.length,
  },
  Node: {
    next: (node) => node.next,
  },
};

// Create DataLoader instance
const createAuthorLoader = () => {
  return new DataLoader((authorIds) => {
    console.log(`Loading authors for IDs: ${authorIds}`);
    const filteredAuthors = authors.filter((author) =>
      authorIds.includes(author.id)
    );
    return Promise.resolve(
      authorIds.map((id) => filteredAuthors.find((author) => author.id === id))
    );
  });
};

const app = express();

// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    authorLoader: createAuthorLoader(),
  }),
});

await server.start();

// Launch the server
app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async () => ({
      authorLoader: createAuthorLoader(),
    }),
  })
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
