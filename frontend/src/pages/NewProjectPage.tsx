import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PROJECT, GET_PATTERNS } from "../utilities/gql";
import { Pattern, PatternFrontend, TransformedModel } from "../../../core/Pattern";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ThreeModel } from "./PatternPage";
import { PatternTransformer } from "./ProjectPage";

type ProjectPattern = {
    patternId: number;
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
}

const NewProjectPage = () => {
    const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_PATTERNS);
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
                    patternId: pattern.id,
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

    return (
        <>
            <NavBar />
            <h1>Create a New Project</h1>
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
            
            <CreateProjectForm projectPatterns={transformedModels.map((model) => ({patternId: model.patternId, ...model.transform}))} />
        </>
    );
}

const CreateProjectForm = ({ projectPatterns }: { projectPatterns: ProjectPattern[] }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userId = 1; // TODO: get userId from context or props
  
    const [createProject, { data, loading, error }] = useMutation(CREATE_PROJECT);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await createProject({ variables: { name, description, userId, projectPatterns } });
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button type="submit">Save Project</button>
    
            {loading && <p>Submitting...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Created pattern: {data.createProject.name}</p>}
        </form>
    );
}

export default NewProjectPage;
