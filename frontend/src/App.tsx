import { useState } from 'react'
import './App.css'
import { useQuery, gql } from '@apollo/client';
import { Pattern } from '../../core/Pattern';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
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
`

function App() {
    const [text, setText] = useState<string>('')
    const [points, setPoints] = useState<number[][][]>([])
    const { loading, error, data } = useQuery(GET_PATTERNS);

    const handleText= () => {
        const pattern = new Pattern(text);
        setPoints(pattern.rowsToPoints());
    }

    const Spheres = ({points}: {points: number[][][]}) => {
        return (
            <>
                {points.map((pointSet, index) => (
                    <group key={index}>
                        {pointSet.map((point, i) => (
                            <mesh key={i} position={new THREE.Vector3(...point)}>
                                <sphereGeometry args={[0.1, 32, 32]} />
                                <meshStandardMaterial color="hotpink" />
                            </mesh>
                        ))}
                    </group>
                ))}
            </>
        )
    }

    return (<>
        <h1>Imagurumi</h1>
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
                <ambientLight />
                <Spheres points={points}/>
                <OrbitControls />
            </Canvas>
        </div>
    </>)
}

export default App
