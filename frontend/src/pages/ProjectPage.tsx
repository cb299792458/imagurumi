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

    // load a new pattern into project
    useEffect(() => {
        setTransformedModels((prev) =>
            newProject.map((pattern) => {
                const existing = prev.find((_, i) => newProject[i].id === pattern.id);
                const patternInstance = new Pattern(pattern.text);
                const modelRows = patternInstance.rowsToPoints();
                return {
                    modelRows,
                    transform: existing?.transform || {
                        x: 0,
                        y: 0,
                        z: 0,
                        rotX: 0,
                        rotY: 0,
                        rotZ: 0,
                    },
                };
            })
        );
    }, [newProject]);


    return <>
        <h1>Project Page</h1>
        <a href="/pattern">Go to Pattern Page</a>
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
                        <td>
                            <PatternTransformer index={index} transformedModels={transformedModels} setTransformedModels={setTransformedModels}/>
                        </td>                      
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{ border: "1px solid red", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight />
                <axesHelper />
                {transformedModels.map((model, index) => (
                    <ThreeModel key={index} modelRows={model.modelRows} transform={model.transform}/>
                ))}
                <OrbitControls />
            </Canvas>
        </div>
    </>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PatternTransformer = ({index, transformedModels, setTransformedModels}: {index: number, transformedModels: TransformedModel[], setTransformedModels: any}) => {
    const transforms = ['x', 'y', 'z', 'rotX', 'rotY', 'rotZ'];

    return (
        <div style={{ display: 'flex' }}>
        {transforms.map((transform: string) => (
                <div key={transform}>
                    <label>{transform}</label>
                    <input type="number" onChange={(e) => {
                        const newTransform = { ...transformedModels[index].transform, [transform]: parseFloat(e.target.value) };
                        setTransformedModels((prev: TransformedModel[]) => {
                            const newModels = [...prev];
                            newModels[index] = { ...newModels[index], transform: newTransform };
                            return newModels;
                        });
                    }} />
                </div>
            ))
        }
        </div>
    )
}

export default ProjectPage;
