import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    allPatterns: async () => {
      return await prisma.pattern.findMany();
    },
    allProjects: async () => {
      return await prisma.project.findMany();
    },
    pattern: async (_, { id }) => {
      return await prisma.pattern.findUnique({
        where: { id },
      });
    },
    project: async (_, { id }) => {
      return await prisma.project.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createPattern: async (_, { name, description, text, userId }) => {
      return await prisma.pattern.create({
        data: {
          name,
          description,
          text,
          userId,
        }
      });
    },
    updatePattern: async (_, { id, name, description, text }) => {
      return await prisma.pattern.update({
        where: { id },
        data: {
          name,
          description,
          text,
        }
      });
    },
    deletePattern: async (_, { id }) => {
      return await prisma.pattern.delete({
        where: { id },
      });
    },
  },
};

export { resolvers };
