import { gql, useQuery } from "@apollo/client";
import { PatternFrontend } from "../../../core/Pattern";
import { useState } from "react";

const GET_PATTERNS = gql`
    query GetPatterns {
        allPatterns {
            id
            name
            description
            text   
        }
    }
`

const ProjectPage = () => {
    const { loading, error, data } = useQuery(GET_PATTERNS);
    const [newPattern, setNewPattern] = useState<PatternFrontend[]>([]);

    return <>
        <h1>Project Page</h1>

        <table>
            <thead>
                <tr>
                    <th>Pattern ID</th>
                    <th>Pattern Name</th>
                    <th>Description</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {loading && <tr><td colSpan={4}>Loading...</td></tr>}
                {error && <tr><td colSpan={4}>Error: {error.message}</td></tr>}
                {data?.allPatterns.map((pattern: PatternFrontend) => (
                    <tr key={pattern.id}>
                        <td>{pattern.id}</td>
                        <td>{pattern.name}</td>
                        <td>{pattern.description}</td>
                        <td><button onClick={() => setNewPattern([...newPattern, pattern])}>Add Pattern to Project</button></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <table>
            <thead>
                <tr>
                    <th>Pattern ID</th>
                    <th>Pattern Name</th>
                </tr>
            </thead>
            <tbody>
                {newPattern.map((pattern: PatternFrontend) => (
                    <tr key={pattern.id}>
                        <td>{pattern.id}</td>
                        <td>{pattern.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}

export default ProjectPage;
