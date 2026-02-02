export const typeDefs = `#graphql
    type Query {
        users: [User!]!
        allPatterns: [Pattern]
        allNewPatterns: [NewPattern]
        allProjects: [Project]
        project(id: Int!): Project
        pattern(id: Int!): Pattern
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
        createPattern(
            name: String!, 
            description: String,
            text: String!,
            userId: Int!
        ): Pattern

        updatePattern(
            id: Int!,
            name: String,
            description: String,
            text: String
        ): Pattern

        deletePattern(id: Int!): Pattern

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

        createNewPattern(
            name: String!,
            description: String,
            text: String!,
            userId: Int!,
            points: [PointInput!]!
        ): NewPattern
    }

    type Pattern {
        id: Int!
        name: String!
        description: String
        text: String!
        userId: Int!
        user: User!
        projectPatterns: [ProjectPattern!]!
        createdAt: String!
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
        project: Project!
        patternId: Int!
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
        patterns: [Pattern!]!
        projects: [Project!]!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type NewPattern {
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
        newPatternId: Int!
        newPattern: NewPattern!
    }
`;
