import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const prisma = new PrismaClient();

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    let user = null;

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        console.log("Invalid token");
      }
    }

    return {
      prisma,
      user,
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀 GraphQL server ready at ${url}`);
