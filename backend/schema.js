export const typeDefs = `#graphql
    type Query {
        users: [User!]!
        allPatterns: [Pattern]
        allNewPatterns: [NewPattern]
        allProjects: [Project]
        allNewProjects: [NewProject]
        project(id: Int!): Project
        newProject(id: Int!): NewProject
        pattern(id: Int!): Pattern
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
