import { useState } from 'react'
import './App.css'
import { useQuery, gql } from '@apollo/client';

const GET_PATTERNS= gql`
  query GetPatterns {
    allPatterns {
      id
      name
      description
    }
  }
`

function App() {
  const [pattern, setPattern] = useState<string>('')
  const { loading, error, data } = useQuery(GET_PATTERNS);

  return (
    <>
      <h1>Imagurumi</h1>
      <textarea
        placeholder="Paste Pattern Here"
        rows={4}
        cols={50}
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
      ></textarea>

      <table>
        <thead>
          <tr>
            <th>Pattern ID</th>
            <th>Pattern Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={3}>Loading...</td></tr>}
          {error && <tr><td colSpan={3}>Error: {error.message}</td></tr>}
          {data && data.allPatterns.map((pattern: {id: string, name: string, description: string}) => (
            <tr key={pattern.id}>
              <td>{pattern.id}</td>
              <td>{pattern.name}</td>
              <td>{pattern.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
