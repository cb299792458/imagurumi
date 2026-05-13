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
    mutation CreatePattern($name: String!, $description: String, $text: String!) {
        createPattern(name: $name, description: $description, text: $text) {
            id
            name
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation CreateProject($name: String!, $description: String, $projectPatterns: [ProjectPatternInput!]!) {
        createProject(name: $name, description: $description, projectPatterns: $projectPatterns) {
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

export const CREATE_PATTERN_WITH_POINTS = gql`
    mutation CreatePattern($name: String!, $description: String, $text: String!, $points: [PointInput!]!) {
        createPattern(name: $name, description: $description, text: $text, points: $points) {
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

export const CLAIM_GUEST_DATA = gql`
    mutation ClaimGuestData($guestId: String!) {
        claimGuestData(guestId: $guestId) {
            projectsClaimed
            patternsClaimed
        }
    }
`;

export const GET_PATTERNS_WITH_POINTS = gql`
    query GetPatternsWithPoints {
        allPatterns {
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

export const GET_PROJECTS_LIST = gql`
    query GetProjectsList {
        allProjects {
            id
            name
            description
        }
    }
`;

export const GET_PROJECT_WITH_PATTERNS = gql`
    query GetProjectWithPatterns($id: Int!) {
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

export const CREATE_PROJECT_WITH_PATTERNS = gql`
    mutation CreateProject($name: String!, $description: String, $projectPatterns: [ProjectPatternInput!]!) {
        createProject(name: $name, description: $description, projectPatterns: $projectPatterns) {
            id
            name
        }
    }
`;
