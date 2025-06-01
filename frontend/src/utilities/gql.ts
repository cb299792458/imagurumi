import { gql } from "@apollo/client";

export const GET_PATTERNS = gql`
    query GetPatterns {
        allPatterns {
            id
            name
            description
            text   
        }
    }
`;

export const GET_PROJECTS = gql`
    query GetProjects {
        allProjects {
            id
            name
            description
        }
    }
`;

export const GET_PROJECT = gql`
    query GetProject($id: Int!) {
        project(id: $id) {
            id
            name
            description
            projectPatterns {
                id
                x
                y
                z
                rotX
                rotY
                rotZ
                pattern {
                    id
                    name
                    description
                    text
                }
            }
        }
    }
`;

export const CREATE_PATTERN = gql`
    mutation CreatePattern($name: String!, $description: String, $text: String!, $userId: Int!) {
        createPattern(name: $name, description: $description, text: $text, userId: $userId) {
            id
            name
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation CreateProject($name: String!, $description: String, $userId: Int!, $projectPatterns: [ProjectPatternInput!]!) {
        createProject(name: $name, description: $description, userId: $userId, projectPatterns: $projectPatterns) {
            id
            name
        }
    }
`;
