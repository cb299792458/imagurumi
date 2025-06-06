import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three'
import NavBar from '../components/NavBar';
import { CREATE_PATTERN, GET_PATTERNS } from '../utilities/gql';
import { PatternRecord, PatternThreeDPoints, TransformedPattern } from '../utilities/types';
import { Pattern } from '../utilities/Pattern';

export const ThreeModel = ( {transformedPattern}: {transformedPattern: TransformedPattern}) => {
    const { modelRows, transform } = transformedPattern;
    const { x, y, z, rotX, rotY, rotZ } = transform || { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };
    return (
        <>
            {modelRows.map(({color, points}, index) => (
                <group 
                    key={index}
                    position={[x, y, z]}
                    rotation={
                        ([rotX, rotY, rotZ].map(r => r * Math.PI / 180) as [number, number, number])
                      }
                >
                    {points.map((point, i) => (
                        <mesh key={i} position={new THREE.Vector3(...point)}>
                            <sphereGeometry args={[0.75, 32, 32]} />
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
    const [modelRows, setModelRows] = useState<PatternThreeDPoints>([])
    const { loading, error, data, refetch } = useQuery(GET_PATTERNS);

    const handleText= () => {
        const pattern = new Pattern(text);
        setModelRows(pattern.rowsToPoints());
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
        <div style={{ border: "1px solid red", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <axesHelper args={[50]}/>
                <ambientLight />
                <ThreeModel transformedPattern={{modelRows}}/>
                <OrbitControls />
            </Canvas>
        </div>
        <CreatePatternForm text={text} refetch={refetch}/>
    </>
}

export default PatternPage;
