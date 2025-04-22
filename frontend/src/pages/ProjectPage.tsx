import { gql, useQuery } from "@apollo/client";
import { Pattern, PatternFrontend, TransformedModel } from "../../../core/Pattern";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ThreeModel } from "./PatternPage";

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
    const [newProject, setNewProject] = useState<PatternFrontend[]>([]);
    const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);
    const [transformedModels, setTransformedModels] = useState<TransformedModel[]>([]);


    // blargh
    useEffect(() => {
        setTransformedModels(newProject.map((pattern) => {
            const patternInstance = new Pattern(pattern.text);
            const modelRows = patternInstance.rowsToPoints();
            const transform = {
                x: 0,
                y: 0,
                z: 0,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
            }
            return {
                modelRows,
                transform,
            }
        }))
    }, [newProject]);

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
                        <td><button onClick={() => setNewProject([...newProject, pattern])}>Add Pattern to Project</button></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <table>
            <thead>
                <tr>
                    <th>Pattern ID</th>
                    <th>Index</th>
                    <th>Pattern Name</th>
                </tr>
            </thead>
            <tbody>
                {newProject.map((pattern: PatternFrontend, index: number) => (
                    <tr key={index} style={{ fontWeight: selectedPatternIndex === index ? 'bold' : 'normal' }} onClick={() => setSelectedPatternIndex(index)}>
                        <td>{pattern.id}</td>
                        <td>{index+1}</td>
                        <td>{pattern.name}</td>
                        <td>
                            <button onClick={(e) => {setNewProject(newProject.filter((_, i) => i !== index)); setSelectedPatternIndex(-1); e.stopPropagation()}}>
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{ border: "1px solid red", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight />
                {transformedModels.map((model, index) => (
                    <ThreeModel key={index} modelRows={model.modelRows} />
                ))}
                <OrbitControls />
            </Canvas>
        </div>
    </>
}

export default ProjectPage;
