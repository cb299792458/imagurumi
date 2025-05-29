import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client';
import { ModelRows, Pattern, PatternFrontend } from '../../../core/Pattern';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three'

const GET_PATTERNS = gql`
    query GetPatterns {
        allPatterns {
            id
            name
            description
            text   
        }
    }
`;

const CREATE_PATTERN = gql`
    mutation CreatePattern($name: String!, $description: String, $text: String!, $userId: Int!) {
        createPattern(name: $name, description: $description, text: $text, userId: $userId) {
            id
            name
        }
    }
`;

type Transform = {
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
}

export const ThreeModel = ( { modelRows, transform={x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0} }: { modelRows: ModelRows, transform?: Transform }) => {
    return (
        <>
            {modelRows.map(({color, points}, index) => (
                <group 
                    key={index}
                    position={[transform.x, transform.y, transform.z]}
                    rotation={
                        ([transform.rotX, transform.rotY, transform.rotZ].map(r => r * Math.PI / 180) as [number, number, number])
                      }
                >
                    {points.map((point, i) => (
                        <mesh key={i} position={new THREE.Vector3(...point)}>
                            <sphereGeometry args={[0.5, 32, 32]} />
                            <meshStandardMaterial color={color}/>
                        </mesh>
                    ))}
                </group>
            ))}
        </>
    )
}

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
    const [modelRows, setModelRows] = useState<ModelRows>([])
    const { loading, error, data, refetch } = useQuery(GET_PATTERNS);

    const handleText= () => {
        const pattern = new Pattern(text);
        setModelRows(pattern.rowsToPoints());
    }

    return <>
        <h1>Pattern Page</h1>
        <a href="/project">Go to Project Page</a>
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
                    {data && data.allPatterns.map((pattern: PatternFrontend) => (
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
        <div style={{ border: "1px solid red", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <axesHelper />
                <ambientLight />
                <ThreeModel modelRows={modelRows}/>
                <OrbitControls />
            </Canvas>
        </div>
        <CreatePatternForm text={text} refetch={refetch}/>
    </>
}

export default PatternPage;
