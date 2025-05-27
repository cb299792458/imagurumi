export const typeDefs = `#graphql
  type Query {
    users: [User!]!
    allPatterns: [Pattern]
    allProjects: [Project]
    project(id: Int!): Project
    pattern(id: Int!): Pattern
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

`;
