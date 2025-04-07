const resolvers = {
  Query: {
    // Example query to get all patterns
    patterns: async () => {
      return await prisma.pattern.findMany();
    },
    // Example query to get a specific project by ID
    project: async (_, { id }) => {
      return await prisma.project.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    // Example mutation to create a new pattern
    createPattern: async (_, { input }) => {
      return await prisma.pattern.create({
        data: input,
      });
    },
    // Example mutation to create a new project
    createProject: async (_, { input }) => {
      return await prisma.project.create({
        data: input,
      });
    },
  },
};

export { resolvers };
