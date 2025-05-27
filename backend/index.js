import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const { url } = await startStandaloneServer(server, {
  context: async () => ({
    prisma
  }),
  listen: { port: 4000 },
});

console.log(`🚀 GraphQL server ready at ${url}`);
