export const typeDefs = `#graphql
    type Query {
        users: [User!]!
        allPatterns: [Pattern]
        allProjects: [Project]
        project(id: Int!): Project
    }

    input ProjectPatternInput {
        patternId: Int!
        x: Float!
        y: Float!
        z: Float!
        rotX: Float!
        rotY: Float!
        rotZ: Float!
    }

    input PointInput {
        x: Float!
        y: Float!
        z: Float!
        color: String!
    }

    type Mutation {
        createProject(
            name: String!,
            description: String,
            userId: Int!,
            projectPatterns: [ProjectPatternInput!]!
        ): Project

        signup(
            email: String!
            password: String!
            username: String!
        ): AuthPayload!

        login(
            email: String!
            password: String!
        ): AuthPayload!

        createPattern(
            name: String!,
            description: String,
            text: String!,
            userId: Int!,
            points: [PointInput!]!
        ): Pattern
    }

    type Project {
        id: Int!
        name: String!
        description: String
        userId: Int!
        projectPatterns: [ProjectPattern!]!
    }

    type ProjectPattern {
        id: Int!
        projectId: Int!
        patternId: Int!
        project: Project!
        pattern: Pattern!
        x: Float!
        y: Float!
        z: Float!
        rotX: Float!
        rotY: Float!
        rotZ: Float!
    }

    type User {
        id: Int!
        email: String!
        username: String!
        projects: [Project!]!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Pattern {
        id: Int!
        name: String!
        description: String
        text: String!
        userId: Int!
        user: User!
        points: [Point!]!
        createdAt: String!
    }

    type Point {
        id: Int!
        x: Float!
        y: Float!
        z: Float!
        color: String!
        patternId: Int!
        pattern: Pattern!
    }
`;
