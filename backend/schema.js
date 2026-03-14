export const typeDefs = `#graphql
    type Query {
        users: [User!]!
        allNewPatterns: [NewPattern]
        allNewProjects: [NewProject]
        newProject(id: Int!): NewProject
    }

    input NewProjectPatternInput {
        newPatternId: Int!
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
        createNewProject(
            name: String!,
            description: String,
            userId: Int!,
            newProjectPatterns: [NewProjectPatternInput!]!
        ): NewProject

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

    type NewProject {
        id: Int!
        name: String!
        description: String
        userId: Int!
        newProjectPatterns: [NewProjectPattern!]!
    }

    type NewProjectPattern {
        id: Int!
        newProjectId: Int!
        newPatternId: Int!
        newProject: NewProject!
        newPattern: NewPattern!
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
        newProjects: [NewProject!]!
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
