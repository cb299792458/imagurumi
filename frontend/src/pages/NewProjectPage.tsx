import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PROJECT, GET_PATTERNS } from "../utilities/gql";
import { PatternTransformer } from "./ProjectPage";
import { PatternRecord, Project } from "../utilities/types";
import { Pattern } from "../utilities/Pattern";
import { ThreeCanvas } from "../components/ThreeCanvas";

const NewProjectPage = () => {
    const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_PATTERNS);
    const [patterns, setPatterns] = useState<PatternRecord[]>([]);
    const [project, setProject] = useState<Project>([]);
    const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);

    // load a new pattern into project
    useEffect(() => {
        setProject((prev) =>
            patterns.map((pattern: PatternRecord, i: number) => {
                const existing = prev[i];
                const patternInstance = new Pattern(pattern.text);
                const patternPoints = patternInstance.toPatternPoints();
                return {
                    patternId: pattern.id,
                    patternPoints,
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
    }, [patterns]);

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
                    {patternData?.allPatterns.map((pattern: PatternRecord) => (
                        <tr key={pattern.id}>
                            <td>{pattern.id}</td>
                            <td>{pattern.name}</td>
                            <td>{pattern.description}</td>
                            <td><button onClick={() => setPatterns([...patterns, pattern])}>Add Pattern to Project</button></td>
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
                    {patterns.map((pattern: PatternRecord, index: number) => (
                        <tr key={index} style={{ fontWeight: selectedPatternIndex === index ? 'bold' : 'normal' }} onClick={() => setSelectedPatternIndex(index)}>
                            <td>{pattern.id}</td>
                            <td>{index+1}</td>
                            <td>{pattern.name}</td>
                            <td>
                                <button onClick={(e) => {setPatterns(patterns.filter((_, i) => i !== index)); setSelectedPatternIndex(-1); e.stopPropagation()}}>
                                    Remove
                                </button>
                            </td>
                            <td>
                                <PatternTransformer index={index} project={project} setProject={setProject}/>
                            </td>                      
                        </tr>
                    ))}
                </tbody>
            </table>
            <ThreeCanvas project={project} />
            
            <CreateProjectForm project={project} />
        </>
    );
}

const CreateProjectForm = ({ project }: { project: Project }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userId = 1; // TODO: get userId from context or props
  
    const [createProject, { data, loading, error }] = useMutation(CREATE_PROJECT);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const projectPatterns = project.map((p) => ({patternId: p.patternId, ...p.transform}));
        await createProject({ variables: { name, description, userId, projectPatterns }});
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
