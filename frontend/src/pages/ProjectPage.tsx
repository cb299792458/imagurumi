import { gql, useQuery } from "@apollo/client";
import { Pattern, PatternFrontend, TransformedModel } from "../../../core/Pattern";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ThreeModel } from "./PatternPage";
import { useParams } from "react-router-dom";

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
const GET_PROJECT = gql`
    query GetProject($id: Int!) {
        project(id: $id) {
            id
            name
            description
            projectPatterns {
                id
                x
                y
                z
                rotX
                rotY
                rotZ
                pattern {
                    id
                    name
                    description
                    text
                }
            }
        }
    }
`

type Project = {
    id: number;
    name: string;
    description: string;
    projectPatterns: ProjectPattern[];
}

type ProjectPattern = {
    id: number;
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    pattern: PatternFrontend;
}

const objectToProject = (project: Project) => {
    return project.projectPatterns.map((projectPattern: ProjectPattern) => {
        const { pattern, x, y, z, rotX, rotY, rotZ } = projectPattern;
        const patternInstance = new Pattern(pattern.text);
        const modelRows = patternInstance.rowsToPoints();
        return {
            modelRows,
            transform: {
                x,
                y,
                z,
                rotX,
                rotY,
                rotZ,
            }
        }
    });
}

const ProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_PATTERNS);
    const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECT, { variables: {id: parseInt(id || '')} });
    const [newProject, setNewProject] = useState<PatternFrontend[]>([]);
    const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);
    const [transformedModels, setTransformedModels] = useState<TransformedModel[]>([]);

    // load project data into newProject
    useEffect(() => {
        if (projectData?.project) {
            const projectPatterns = objectToProject(projectData.project);
            setTransformedModels(projectPatterns);
            setNewProject(projectData.project.projectPatterns.map((pp: ProjectPattern) => pp.pattern));
        }
    }, [projectData]);

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
        <h1>Project: {projectData?.project?.name}</h1>
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
                {patternLoading && <tr><td colSpan={4}>Loading...</td></tr>}
                {patternError && <tr><td colSpan={4}>Error: {patternError.message}</td></tr>}
                {patternData?.allPatterns.map((pattern: PatternFrontend) => (
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
        {projectLoading && <p>Loading project...</p>}
        {projectError && <p>Error: {projectError.message}</p>}
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

const PatternTransformer = ({index, transformedModels, setTransformedModels}: {index: number, transformedModels: TransformedModel[], setTransformedModels: React.Dispatch<React.SetStateAction<TransformedModel[]>>;}) => {
    type TransformKey = 'x' | 'y' | 'z' | 'rotX' | 'rotY' | 'rotZ';
    const transforms: TransformKey[] = ['x', 'y', 'z', 'rotX', 'rotY', 'rotZ'];

    return (
        <div style={{ display: 'flex' }}>
        {transforms.map((transform: TransformKey) => (
                <div key={transform}>
                    <label>{transform}</label>
                    <input type="number" 
                      value={transformedModels[index]?.transform?.[transform] ?? 0}
                    onChange={(e) => {
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
