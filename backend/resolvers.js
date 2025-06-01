const resolvers = {
    Query: {
        users: async (_parent, _args, context) => {
            return await context.prisma.user.findMany();
        },
        allPatterns: async (_parent, _args, context) => {
            return await context.prisma.pattern.findMany();
        },
        allProjects: async (_parent, _args, context) => {
            return await context.prisma.project.findMany();
        },
        pattern: async (_parent, { id }, context) => {
            return await context.prisma.pattern.findUnique({
                where: { id },
            });
        },
        project: async (_parent, { id }, context) => {
            return await context.prisma.project.findUnique({
                where: { id },
            });
        },
    },

    Mutation: {
        createPattern: async (_parent, { name, description, text, userId }, context) => {
            return await context.prisma.pattern.create({
                data: {
                    name,
                    description,
                    text,
                    userId,
                },
            });
        },
        updatePattern: async (_parent, { id, name, description, text }, context) => {
            return await context.prisma.pattern.update({
                where: { id },
                data: {
                    name,
                    description,
                    text,
                },
            });
        },
        deletePattern: async (_parent, { id }, context) => {
            return await context.prisma.pattern.delete({
                where: { id },
            });
        },
        createProject: async (_parent, { name, description, userId, projectPatterns }, context) => {
            return await context.prisma.project.create({
                data: {
                    name,
                    description,
                    user: {
                        connect: { id: userId },
                    },
                    projectPatterns: {
                        create: projectPatterns.map(pp => ({
                            pattern: { connect: { id: pp.patternId } },
                            x: pp.x,
                            y: pp.y,
                            z: pp.z,
                            rotX: pp.rotX,
                            rotY: pp.rotY,
                            rotZ: pp.rotZ,
                        })),
                    },
                },
            });
        },
    },

    Project: {
        projectPatterns: async (parent, _args, context) => {
            return await context.prisma.projectPattern.findMany({
                where: { projectId: parent.id },
                include: { pattern: true },
            }) || [];
        }
    },

    };

export { resolvers };
