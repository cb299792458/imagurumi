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

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user { id email username }
        }
    }
`;

export const CREATE_NEW_PATTERN = gql`
    mutation CreateNewPattern($name: String!, $description: String, $text: String!, $userId: Int!, $points: [PointInput!]!) {
        createNewPattern(name: $name, description: $description, text: $text, userId: $userId, points: $points) {
            id
            name
            points {
                id
                x
                y
                z
                color
            }
        }
    }
`;

export const SIGNUP = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            token
            user { id username email }
        }
    }
`;

export const GET_NEW_PATTERNS = gql`
    query GetNewPatterns {
        allNewPatterns {
            id
            name
            description
            text
            userId
            createdAt
            points {
                id
                x
                y
                z
                color
            }
        }
    }
`;

export const GET_NEW_PROJECTS = gql`
    query GetNewProjects {
        allNewProjects {
            id
            name
            description
        }
    }
`;

export const GET_NEW_PROJECT = gql`
    query GetNewProject($id: Int!) {
        newProject(id: $id) {
            id
            name
            description
            newProjectPatterns {
                id
                x
                y
                z
                rotX
                rotY
                rotZ
                newPattern {
                    id
                    name
                    points {
                        id
                        x
                        y
                        z
                        color
                    }
                }
            }
        }
    }
`;

export const CREATE_NEW_PROJECT = gql`
    mutation CreateNewProject($name: String!, $description: String, $userId: Int!, $newProjectPatterns: [NewProjectPatternInput!]!) {
        createNewProject(name: $name, description: $description, userId: $userId, newProjectPatterns: $newProjectPatterns) {
            id
            name
        }
    }
`;
