import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import NavBar from '../components/NavBar';
import { CREATE_PATTERN, GET_PATTERNS } from '../utilities/gql';
import { PatternRecord, PatternPoints } from '../utilities/types';
import { Pattern } from '../utilities/Pattern';
import { ThreeCanvas } from '../components/ThreeCanvas';

const CreatePatternForm = ({ text, refetch }: { text: string, refetch: () => void }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userId = 1; // TODO: get userId from context or props
  
    const [createPattern, { data, loading, error }] = useMutation(CREATE_PATTERN);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await createPattern({ variables: { name, description, text, userId } });
        refetch();
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button type="submit">Create Pattern With Current Text</button>
    
            {loading && <p>Submitting...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Created pattern: {data.createPattern.name}</p>}
        </form>
    );
}

const PatternPage = () => {
    const [text, setText] = useState<string>('')
    const [patternPoints, setPatternPoints] = useState<PatternPoints>([])
    const { loading, error, data, refetch } = useQuery(GET_PATTERNS);

    const handleText= () => {
        const pattern = new Pattern(text);
        setPatternPoints(pattern.toPatternPoints());
    }

    return <>
        <NavBar />
        <h1>Pattern Page</h1>
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
    </>
}

export default PatternPage;
