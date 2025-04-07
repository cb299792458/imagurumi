import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const prisma = new PrismaClient();

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    ...resolvers,
    Query: {
      allPatterns: async () => await prisma.pattern.findMany(),
      allProjects: async () => await prisma.project.findMany(),
    },
    Mutation: {
      createPattern: async (_, { name, userId }) => {
        return await prisma.pattern.create({
          data: { name, userId },
        });
      },
    },
  },
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 GraphQL server ready at ${url}`);
