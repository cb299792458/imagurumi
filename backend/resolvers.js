import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const resolvers = {
    Query: {
        users: async (_parent, _args, context) => {
            return await context.prisma.user.findMany();
        },
        allPatterns: async (_parent, _args, context) => {
            if (context.userId) {
                return context.prisma.pattern.findMany({
                    where: { userId: context.userId },
                    include: { points: true },
                });
            }

            if (context.guestId) {
                return context.prisma.pattern.findMany({
                    where: { guestId: context.guestId },
                    include: { points: true },
                });
            }

            return [];
            },

        allProjects: async (_parent, _args, context) => {
            if (context.userId) {
                return context.prisma.project.findMany({
                    where: { userId: context.userId },
                });
            }

            if (context.guestId) {
                return context.prisma.project.findMany({
                    where: { guestId: context.guestId },
                });
            }

            return [];
        },
        project: async (_parent, { id }, context) => {
            return await context.prisma.project.findUnique({
                where: { id },
                include: { projectPatterns: { include: { pattern: { include: { points: true } } } } },
            });
        },
    },

    Mutation: {
        createProject: async (_parent, { name, description, projectPatterns }, context) => {
            const data = {
                name,
                description,
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
            };

            if (context.userId) {
                data.user = { connect: { id: context.userId } };
            } else if (context.guestId) {
                data.guestId = context.guestId;
            } else {
                throw new Error("User must be logged in or provide guestId");
            }

            return context.prisma.project.create({ data });
        },
        signup: async (_parent, { email, password, username }, context) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await context.prisma.user.create({
                data: { email, username, password: hashedPassword },
            });

            const token = jwt.sign({ id: user.id }, JWT_SECRET);
            return { token, user };
        },
        createPattern: async (_parent, { name, description, text, points }, context) => {
            const data = {
                name,
                description,
                text,
                points: {
                    create: points.map(p => ({
                        x: p.x,
                        y: p.y,
                        z: p.z,
                        color: p.color,
                    })),
                },
            };

            if (context.userId) {
                data.user = { connect: { id: context.userId } };
            } else if (context.guestId) {
                data.guestId = context.guestId;
            } else {
                throw new Error("Missing user or guestId");
            }

            return await context.prisma.pattern.create({
                data,
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

            const token = jwt.sign({ id: user.id }, JWT_SECRET);
            return { token, user };
        },
        // This links guestId to userId after login/signup
        claimGuestData: async (_parent, { guestId }, context) => {
            if (!context.userId) throw new Error("Not authenticated");

            const [projects, patterns] = await Promise.all([
                context.prisma.project.updateMany({
                    where: { guestId },
                    data: { userId: context.userId, guestId: null },
                }),
                context.prisma.pattern.updateMany({
                    where: { guestId },
                    data: { userId: context.userId, guestId: null },
                }),
            ]);

            return {
                projectsClaimed: projects.count,
                patternsClaimed: patterns.count,
            };
        },
    },
    Project: {
        projectPatterns: async (parent, _args, context) => {
            return await context.prisma.projectPattern.findMany({
                where: { projectId: parent.id },
                include: { pattern: { include: { points: true } } },
            });
        }
    },

    Pattern: {
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
