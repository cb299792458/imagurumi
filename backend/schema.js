export const typeDefs = `#graphql
  type Query {
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
    description: String!
    text: String!
    userId: Int!
  }

  type Project {
    id: Int!
    name: String!
    description: String
    userId: Int!
  }
`;
