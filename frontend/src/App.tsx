import { useState } from 'react'
import './App.css'
import { useQuery, gql } from '@apollo/client';
import { Pattern } from '../../core/Pattern';

const GET_PATTERNS= gql`
    query GetPatterns {
        allPatterns {
            id
            name
            description
            text   
        }
    }
`

function App() {
    const [pattern, setPattern] = useState<string>('')
    const { loading, error, data } = useQuery(GET_PATTERNS);

    const handleText= (text: string) => {
        const pattern = new Pattern(text);
        console.log(pattern.rowsToString());
    }

    return (<>
        <h1>Imagurumi</h1>
        <textarea
            placeholder="Paste Pattern Here"
            rows={4}
            cols={50}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
        />

        <table>
            <thead>
            <tr>
                <th>Pattern ID</th>
                <th>Pattern Name</th>
                <th>Description</th>
                <th>Button</th>
            </tr>
            </thead>
            <tbody>
            {loading && <tr><td colSpan={3}>Loading...</td></tr>}
            {error && <tr><td colSpan={3}>Error: {error.message}</td></tr>}
            {data && data.allPatterns.map((pattern: {id: string, name: string, description: string, text: string}) => (
                <tr key={pattern.id}>
                <td>{pattern.id}</td>
                <td>{pattern.name}</td>
                <td>{pattern.description}</td>
                <td>
                    <button onClick={() => handleText(pattern.text)}>do the thing</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        
    </>)
}

export default App
