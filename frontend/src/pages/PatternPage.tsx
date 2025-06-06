import { useState } from 'react'
import { useQuery } from '@apollo/client';
import { GET_PATTERNS } from '../utilities/gql';
import { PatternRecord, PatternPoints } from '../utilities/types';
import { Pattern } from '../utilities/Pattern';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { CreatePatternForm } from '../components/CreatePatternForm';
import Layout from './Layout';

const PatternPage = () => {
    const [text, setText] = useState<string>('')
    const [patternPoints, setPatternPoints] = useState<PatternPoints>([])
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { loading, error, data, refetch } = useQuery(GET_PATTERNS);

    const handleText = () => {
        try {
            const pattern = new Pattern(text);
            setPatternPoints(pattern.toPatternPoints());
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        }
    }

    return <Layout>
        <h1>Pattern Page</h1>
        <p>Create a pattern. Numbers represent number of stitches in a circle for that row. Colors represent changing yarn color. Add a name and description below, then save your pattern. </p>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div style={{display: 'flex'}}>
            <textarea
                placeholder="Paste Pattern Here"
                rows={4}
                cols={30}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
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
                    {data && data.allPatterns.map((pattern: PatternRecord) => (
                        <tr key={pattern.id}>
                            <td>{pattern.id}</td>
                            <td>{pattern.name}</td>
                            <td>{pattern.description}</td>
                            <td>
                                <button onClick={() => setText(pattern.text)}>load pattern</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleText}>imagine</button>

        </div>
        <ThreeCanvas project={[{patternPoints}]} />
        <CreatePatternForm text={text} refetch={refetch}/>
    </Layout>
}

export default PatternPage;
