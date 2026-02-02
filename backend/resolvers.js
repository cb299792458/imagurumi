import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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
        allNewPatterns: async (_parent, _args, context) => {
            return await context.prisma.newPattern.findMany({
                include: {
                    points: true,
                },
            });
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
        signup: async (_parent, { email, password, username }, context) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await context.prisma.user.create({
                data: { email, username, password: hashedPassword },
            });

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            return { token, user };
        },
        createNewPattern: async (_parent, { name, description, text, userId, points }, context) => {
            return await context.prisma.newPattern.create({
                data: {
                    name,
                    description,
                    text,
                    user: {
                        connect: { id: userId },
                    },
                    points: {
                        create: points.map(p => ({
                            x: p.x,
                            y: p.y,
                            z: p.z,
                            color: p.color,
                        })),
                    },
                },
                include: {
                    points: true,
                },
            });
        },
        login: async (_parent, { email, password }, context) => {
            const user = await context.prisma.user.findUnique({ where: { email } });
            if (!user) throw new Error("User not found");

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error("Incorrect password");

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            return { token, user };
        },
    },
    Project: {
        projectPatterns: async (parent, _args, context) => {
            return await context.prisma.projectPattern.findMany({
                where: { projectId: parent.id },
                include: { pattern: true },
            });
        }
    },

    NewPattern: {
        createdAt: (parent) => {
            // Convert Prisma DateTime to ISO string
            if (parent.createdAt instanceof Date) {
                return parent.createdAt.toISOString();
            }
            // Handle if it's a number (timestamp)
            if (typeof parent.createdAt === 'number') {
                return new Date(parent.createdAt).toISOString();
            }
            // If it's already a string, return as is
            return parent.createdAt;
        }
    },
};

export { resolvers };
