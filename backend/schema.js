export const typeDefs = `#graphql
  type Query {
    allPatterns: [Pattern]
    allProjects: [Project]
  }

  type Mutation {
    createPattern(name: String!, userId: Int!): Pattern
  }

  type Pattern {
    id: Int
    name: String
    description: String
    text: String
    userId: Int
  }

  type Project {
    id: Int
    name: String
    description: String
    userId: Int
  }
`;
